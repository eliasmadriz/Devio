import Vue from 'vue'
import Vuex from 'vuex'
import Users from '../static/data/users.json'
import Posts from '../static/data/posts.json'
import Techs from '../static/data/techs.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
    techs: Techs,
    users: Users,
    posts: Posts,
    loggedUserId: 'ccc',
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
    ]
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
        if (user.following.list.indexOf(post.authorId) !== -1)
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
    createPost ({state, commit, getters}, payload) {
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

      commit('createPost', {
        ...post
      })
    }
  },
  mutations: {
    createPost (state, payload) {
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
      //   FIRST METHOD (Works, but not optimal)
      // for (let i = 0; i < payload.techs.length; i++) {
      //   state.techs.find(function (tech) {
      //     if (tech.name === payload.techs[i]) {
      //       tech.posts.total++
      //       tech.posts.list.push(payload.id)
      //       return true
      //     }
      //   })
      // }

      //   SECOND METHOD (Works, but depends on name sorting and toLowerCase functions)
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
    }
  }
})