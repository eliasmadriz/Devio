import Vue from 'vue'
import Vuex from 'vuex'
import Users from '../static/data/users.json'
import Posts from '../static/data/posts.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
    techs: [
        {
          logo: '/static/tech/javascript.png',
          name: 'Javascript',
          totalPosts: 2,
          totalDevs: 5
        },
        {
          logo: '/static/tech/node.png',
          name: 'Node.js',
          totalPosts: 2,
          totalDevs: 2
        },
        {
          logo: '/static/tech/angular.png',
          name: 'Angular',
          totalPosts: 0,
          totalDevs: 1
        },
        {
          logo: '/static/tech/react.png',
          name: 'React',
          totalPosts: 2,
          totalDevs: 3
        },
        {
          logo: '/static/tech/vue.png',
          name: 'Vue.js',
          totalPosts: 1,
          totalDevs: 3
        },
        {
          logo: '/static/tech/html.png',
          name: 'HTML',
          totalPosts: 1,
          totalDevs: 1
        }
      ],
    users: Users,
    posts: Posts,
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
    getUserInfo (state) {
      return function (userId) {
        return state.users.find(function (user) {
          return user.id === userId
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
  }
})