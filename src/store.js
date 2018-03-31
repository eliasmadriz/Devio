import Vue from 'vue'
import Vuex from 'vuex'

import * as firebase from 'firebase'

Vue.use(firebase)
Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
    techs: {
      loading: true
    },
    users: {
      loading: true
    },
    posts: {
      loading: true
    },
    social: [],
    techsNames: [],
    loggedUserId: undefined    
	},
  getters: {
    popularTechs (state) {
      // return state.techs.sort(function (techA, techB) {
      //   return techA.totalPosts < techB.totalPosts
      // }).slice(0, 5)
    },
    trendingPosts (state) {
      // return state.posts.sort(function (postA, postB) {
      //   return postA.upvotes.total < postB.upvotes.total
      // }).slice(0, 5)
    },
    trendingUsers (state) {
      // return state.users.sort(function (userA, userB) {
      //   return userA.points < userB.points
      // }).slice(0, 5)
    },
    dashboardPosts (state) {
      if (state.loggedUserId !== undefined) {
        const user = store.getters.getUser({userId: state.loggedUserId})
        let posts = {}
        if (user)
        if (user.following.list)
        for (let post in state.posts) {
          if (user.following.list[state.posts[post].authorId]) posts[post] = state.posts[post]
        }
        return posts
      }
    },
    getPost (state) {
      return function (postId) {
        return state.posts[postId]
      }
      // return function (postId) {
      //   return state.posts.find(function (post) {
      //     return post.id === postId
      //   })
      // }
    },
    getUser (state) {
      return function (payload) {
        if (payload.userId) {
          return state.users[payload.userId]
        } else if (payload.username) {
          for (let key in state.users) {
            if (state.users[key].username === payload.username) {
              return state.users[key]
              break
            }
          }
        }
      }
    },
    getTechInfo (state) {
      return function (techName) {
        let found = state.techs[techName]
        // let found = state.techs.find(function (tech) {
        //   return tech.name === techName
        // })

        // Tech fallback for the new techs added to a post until is committed
        if (found === undefined)
          found = {
            name: techName
          }
        
        // Logo fallback for the new techs stored in the database
        if (found.logo === undefined)
          found.logo = '/static/icons/other.png'

        return found
      }
    },
    getSocialNetworkInfo (state) {
      return function (socialName) {
        return state.social.find(function (socialNetwork) {
          return socialNetwork.name === socialName
        })
      }
    }
  },
  actions: {
    createPost ({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        // If the post already existed, update it
        if (payload.id) {
          let post = {
            title: payload.title,
            description: payload.description,
            techs: payload.techs,
            links: payload.links,
            language: payload.language
          }
          firebase.database().ref('posts/' + payload.id).update({
            ...post
          }).then(() => {
            resolve()
            commit('CreatePost', {
              ...post,
              id: payload.id
            })
          })
          .catch(error => {
            reject(error)
          })
        } else {
          let post = {
            title: payload.title,
            description: payload.description,
            techs: payload.techs,
            links: payload.links,
            creationDate: payload.creationDate,
            authorId: state.loggedUserId,
            upvotes: {total: 0, list: []},
            language: payload.language
          }

          post.id = firebase.database().ref('posts').push().key
    
          firebase.database().ref('posts/' + post.id).set({
            ...post
          }).then(() => {
            // TODO: The functions below should be cloud functions to guarantee that they'll run and update the data
            firebase.database().ref('users/' + post.authorId + '/posts/list/' + post.id).set(true).then(() => {
              firebase.database().ref('users/' + post.authorId + '/posts/total').transaction(function(number) {
                number ? number++ : number = 1
                return number;
              })
            }).catch(error => reject(error))
            resolve()
            commit('CreatePost', post)
          }).catch(error => reject(error))
        }
      })
    },
    DeletePost ({commit}, payload) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('posts/' + payload.id).remove().then(() => {
          firebase.database().ref('users/' + payload.authorId + '/posts/list/' + payload.id).remove().then(() => {
            firebase.database().ref('users/' + payload.authorId + '/posts/total').transaction(function (number) {
              number > -1 ? number-- : number = 0
              return number
            }).then(() => {
              commit('DeletePost', payload)
              resolve()
            }).catch(error => {
              reject(error)
            })
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      })
    },
    isUsernameAvailable ({commit}, payload) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('emailsAndUsers').once('value').then(function (data) {
          let flag = false
          const obj = data.val()
          for (let key in obj) {
            if (obj[key].username === payload) {
              reject({code: 'auth/taken_username'})
              flag = true
              break
            }
          }
          if (!flag)
            resolve()
        }).catch(error => {reject(error)})
      })
    },
    SignUp ({commit}, payload) {
      return new Promise((resolve, reject) => {
        this.dispatch('isUsernameAvailable', payload.username)
        .then(function (response) {
          firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then(user => {
            
              let newUser = {
                id: user.uid,
                avatar: '',
                username: payload.username,
                publicName: payload.name,
                bio: "",
                favTechs: [],
                posts: {
                  total: 0,
                  list: []
                },
                followers: {
                  total: 0,
                  list: []
                },
                following: {
                  total: 0,
                  list: []
                },
                points: 0,
                socialLinks: [],
                website: ""
              }
              firebase.database().ref('users/' + user.uid).set(newUser).then(() => {
                firebase.database().ref('emailsAndUsers/' + user.uid).set({email: payload.email, username: payload.username}).then(() => {
                  commit('CreateUser', {id: user.uid, ...newUser})
                }).catch(error => reject(error))
              }).catch(error => reject(error))
            }
          ).catch(error => reject(error))
        }).catch(error => reject(error))
      })
    },
    SignIn ({state, commit}, payload) {
      return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
          let emailValidator = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
          let isEmail = emailValidator.test(payload.email)
          
          if (isEmail) {
            resolve(payload)
          } else {
            firebase.database().ref('emailsAndUsers').once('value')
            .then(data => {
              const obj = data.val()
              let newPayload = {}
              let flag = false
              for (let key in obj) {
                if (obj[key].username === payload.email) {
                  newPayload = {email: obj[key].email, password: payload.password}
                  flag = true
                  resolve(newPayload)
                  break
                }
              }
              if (!flag) {
                reject({code: 'auth/invalid_username'})
              }
            })
            .catch(error => {reject(error)})
          }
        })
        .then(function (response) {
          return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(response.email, response.password)
            .then(function (user) {
              const userId = user.uid
              commit('SignIn', userId)
              resolve()
            })
            .catch(function (error) {
              reject(error)
            })
          }).then()
          .catch(error => {
            reject(error)
          })
        })
        .catch(function (error) {
          reject(error)
        })
      })
    },
    LogOut ({commit}) {
      commit('LogOut')
    },
    SaveProfile ({commit}, payload) {
      return new Promise((resolve, reject) => {
        // If the username has changed, change it in the emailsAndUsers database as well
        if (payload.newProfile.username !== payload.oldUsername)
            firebase.database().ref('emailsAndUsers/' + payload.newProfile.id).update({
              username: payload.newProfile.username
            }).then().catch(error => reject(error))

        // Update the profile in firebase
        firebase.database().ref('users/' + payload.newProfile.id).update({
          ...payload.newProfile
        }).then(() => {
          commit('SaveProfile', payload.newProfile)
          resolve()
        }).catch(error => {reject(error)})
      })
    },
    loadTechs ({commit}) {
      let techs = {}
      firebase.database().ref('techs').once('value')
      .then(data => {
        const obj = data.val()
        for (let key in obj) {
          techs[key] = obj[key]
        }

        commit('loadTechs', techs)
      })
    },
    loadUsers ({commit}) {
      let users = {}
      firebase.database().ref('users').once('value').then(data => {
        const obj = data.val()
        for (let key in obj) {
          users[key] = obj[key]
          if (!users[key].favTechs) users[key].favTechs = []
        }
        commit('loadUsers', users)
      }).catch(error => console.log(error))
    },
    loadPosts ({commit}) {
      let newPosts = {}
      firebase.database().ref('posts').once('value').then(data => {
        const obj = data.val()
        commit('loadPosts', obj)
      }).catch(error => console.log(error))
    },
    loadSocial ({commit}) {
      let social = []
      firebase.database().ref('social').once('value')
      .then(data => {
        const obj = data.val()
        for (let key in obj) {
          social.push({name: key, logo: obj[key]})
        }

        commit('loadSocial', social)
      })
      .catch(error => console.log(error))
    }
  },
  mutations: {
    CreatePost (state, payload) {
        state.posts[payload.id] = payload
        // Find the author and update their total posts number
        state.users[state.loggedUserId].posts.total++
        state.users[state.loggedUserId].posts.list[payload.id] = true
    },
    DeletePost (state, payload) {
      let statePostsLength = state.posts.length
      for (let i = 0; i < statePostsLength; i++) {
        if (payload.id === state.posts[i].id) {
          state.posts.splice(i, 1)
          state.users.find(function (user, index) {
            if (user.id === state.loggedUserId) {
              user.posts.total--
              let deletePostIndex = user.posts.list.findIndex(function (id) {
                return id === payload.id
              })
              state.users[index].posts.list.splice(deletePostIndex, 1)
              return true
            }
          })
          break;
        }
      }
    },
    CreateUser (state, payload) {
      state.users[payload.id] = payload
      state.loggedUserId = payload.id
    },
    SignIn (state, payload) {
      state.loggedUserId = payload
    },
    LogOut (state) {
      state.loggedUserId = undefined
    },
    SaveProfile (state, payload) {
      // state.users.find(function (user, index) {
      //   let found = user.id === payload.id
      //   if (found) {
      //     state.users[index].avatar = payload.avatar
      //     state.users[index].bio = payload.bio
      //     state.users[index].favTechs = payload.favTechs
      //     state.users[index].publicName = payload.publicName
      //     let newSocialLinks = []
      //     for (let social in payload.socialLinks) {
      //       newSocialLinks.push({
      //         name: social,
      //         url: payload.socialLinks[social]
      //       })
      //     }
      //     state.users[index].username = payload.username
      //     state.users[index].website = payload.website
      //   }
      //   return found
      // })
      state.users[payload.id].avatar = payload.avatar
      state.users[payload.id].publicName = payload.publicName
      state.users[payload.id].username = payload.username
      state.users[payload.id].bio = payload.bio
      state.users[payload.id].website = payload.website
      state.users[payload.id].favTechs = payload.favTechs
      state.users[payload.id].socialLinks = payload.socialLinks
    },
    loadTechs (state, payload) {
      state.techs = payload
      let techs = []
      for (let tech in payload) {
        techs.push(payload[tech].name.toLowerCase())
      }
      state.techsNames = techs
    },
    loadUsers (state, payload) {
      state.users = payload
    },
    loadPosts (state, payload) {
      state.posts = payload
    },
    loadSocial (state, payload) {
      state.social = payload
    }
  }
})