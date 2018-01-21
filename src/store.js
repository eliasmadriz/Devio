import Vue from 'vue'
import Vuex from 'vuex'
import Users from '../static/data/users.json'
import Posts from '../static/data/posts.json'
import Techs from '../static/data/techs.json'
import emailsAndUsers from '../static/data/emailsAndUsers.json'

import * as firebase from 'firebase'

Vue.use(firebase)
Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
    techs: Techs,
    users: Users,
    posts: Posts,
    emailsAndUsers: [],
    loggedUserId: undefined,
    social: [
      {
        name: 'Github',
        logo: '/static/social/github.png'
      },
      {
        name: 'Stack Overflow',
        logo: '/static/social/stackoverflow.png'
      },
      {
        name: 'Twitter',
        logo: '/static/social/twitter.png'
      }
    ],
    loading: false,
    error: null
	},
  getters: {
    popularTechs (state) {
      return state.techs.sort(function (techA, techB) {
        return techA.totalPosts < techB.totalPosts
      }).slice(0, 5)
    },
    trendingPosts (state) {
      return state.posts.sort(function (postA, postB) {
        return postA.upvotes.total < postB.upvotes.total
      }).slice(0, 5)
    },
    trendingUsers (state) {
      return state.users.sort(function (userA, userB) {
        return userA.points < userB.points
      }).slice(0, 5)
    },
    dashboardPosts (state) {
      const user = store.getters.getUser(state.loggedUserId)
      return state.posts.filter(function (post) {
        if (user && user.following.list.indexOf(post.authorId) !== -1)
        return post
      }).sort(function (postA, postB) {
        return postA.creationDate < postB.creationDate
      })
    },
    getPost (state) {
      return function (postId) {
        return state.posts.find(function (post) {
          return post.id === postId
        })
      }
    },
    getUser (state) {
      return function (userId) {
        return state.users.find(function (user) {
          return user.id === userId
        })
      }
    },
    getUserByUsername (state) {
      return function (username) {
        return state.users.find(function (user) {
          return user.username === username
        }) 
      }
    },
    getTechInfo (state) {
      return function (techName) {
        var found = state.techs.find(function (tech) {
          return tech.name === techName
        })
        if (!found.logo) found.logo = '/static/icons/other.png'
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
    createPost ({commit}, payload) {
      const post = {
        id: payload.id,
        title: payload.title,
        description: payload.description,
        techs: payload.techs,
        links: payload.links,
        creationDate: payload.creationDate,
        authorId: payload.authorId,
        upvotes: payload.upvotes,
        language: payload.language
      }

      commit('CreatePost', {
        ...post
      })
    },
    DeletePost ({commit}, payload) {
      commit('DeletePost', payload)
    },
    SignUp ({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let checkUsername = new Promise((resolve, reject) => {
          firebase.database().ref('emailsAndUsers').once('value').then(function (data) {
            let flag = false
            const obj = data.val()
            for (let key in obj) {
              if (obj[key].username === payload.username) {
                reject({code: 'auth/taken_username'})
                flag = true
                break
              }
            }
            if (!flag)
              resolve()
          }).catch((error) => {reject(error)})
        }).then(function (response) {
          firebase.database().ref('emailsAndUsers').push({email: payload.email, username: payload.username})
          firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then().catch((error) => {reject(error)})
          .then(
            user => {
              commit('setLoading', false)
              const newUser = {
                id: user.uid,    
                avatar: "/static/avatar/newUser.svg",
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
              commit('SetUser', {newUser: newUser, email: payload.email})
            }
          )
          .catch(function (error) {
            commit('setLoading', false)
            reject(error)
          })
        })
        .catch((error) => {
          reject(error)
        })
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
            .then((data) => {
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
            .catch((error) => {reject(error)})
          }
        })
        .then(function (response) {
          return new Promise((resolve, reject) => {
            commit('setLoading', true)
            firebase.auth().signInWithEmailAndPassword(response.email, response.password)
            .then(function (user) {
              commit('setLoading', false)
              const userId = user.uid
              commit('SignIn', userId)
              commit('setLoading', false)
              resolve()
            })
            .catch(function (error) {
              reject(error)
            })
          }).then()
          .catch((error) => {
            reject(error)
          })
        })
        .catch(function (error) {
          commit('setLoading', false)
          reject(error)
        })
      })
    },
    LogOut ({commit}) {
      commit('LogOut')
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    clearError (state, payload) {
      state.error = null
    },
    CreatePost (state, payload) {
      let statePostsLength = state.posts.length
      for (let i = 0; i < statePostsLength; i++) {

        // If the post already existed (edit)
        if (state.posts[i].id === payload.id) {
          state.posts[i] = payload
          break;
        }
        
        // If the post is new (create)
        if (i === statePostsLength - 1) {          
          state.posts.push(payload)

          // Find the author and update their total posts number
          state.users.find(function (user) {
            if (user.id === state.loggedUserId) {
              user.posts.total++
              user.posts.list.push(payload.id)
              return true
            }
          })
        }
      }

      // Find the techs and update their total posts number
      
      // payload.techs = payload.techs.sort(function (techA, techB) {
      //   return techA.toLowerCase() > techB.toLowerCase()
      // })
      // let stateTechsLenght = state.techs.length
      // let payloadIndex = 0
      // let payloadLenght = payload.techs.length
      // for (let i = 0; i < stateTechsLenght; i++) {      
      //   if (payload.techs[payloadIndex] === state.techs[i].name) {
      //     payloadIndex++;
      //   }
      //   if (payloadIndex === payloadLenght) 
      //     break
      // }
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
    SetUser (state, payload) {      
      state.users.push(payload.newUser)
      state.loggedUserId = payload.newUser.id
      state.emailsAndUsers.push({email: payload.email, username: payload.newUser.username})
    },
    SignIn (state, payload) {
      state.loggedUserId = payload
    },
    LogOut(state) {
      state.loggedUserId = undefined
    }
  }
})