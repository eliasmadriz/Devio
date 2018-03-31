import Vue from 'vue'
import App from './App'
import router from './router'
import {store} from './store.js'
import * as firebase from 'firebase'


import navbar from './components/Navbar.vue'
import footer from './components/Footer.vue'
import authCard from './components/AuthCard.vue'
import techCard from './components/TechCard.vue'
import postCard from './components/PostCard.vue'
import userCard from './components/UserCard.vue'
import userActionButton from './components/UserActionButton.vue'
import landing from './components/Landing.vue'
import dashboard from './components/Dashboard.vue'
import postModal from './components/PostModal.vue'
import singlePost from './components/SinglePost.vue'
import editProfileModal from './components/EditProfileModal.vue'
import loadingSpinner from './components/LoadingSpinner.vue'
import avatar from './components/Avatar.vue'
import message from './components/Message.vue'

import BootstrapVue from 'bootstrap-vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueAwesomplete from './components/Awesomplete.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'swiper/dist/css/swiper.css'
import AwesompleteCss from 'awesomplete/awesomplete.css'
import VueCroppie from 'vue-croppie'

Vue.use(BootstrapVue)
Vue.use(VueAwesomeSwiper)
Vue.use(VueAwesomplete)
Vue.use(VueCroppie)

Vue.component('auth-card', authCard)
Vue.component('tech-card', techCard)
Vue.component('nav-bar', navbar)
Vue.component('footer-section', footer)
Vue.component('post-card', postCard)
Vue.component('user-card', userCard)
Vue.component('user-action-button', userActionButton)
Vue.component('landing', landing)
Vue.component('dashboard', dashboard)
Vue.component('post-modal', postModal)
Vue.component('vue-awesomplete', VueAwesomplete)
Vue.component('single-post', singlePost)
Vue.component('edit-profile-modal', editProfileModal)
Vue.component('loading-spinner', loadingSpinner)
Vue.component('avatar', avatar)
Vue.component('message', message)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
	store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyByyA0UczEnX7Agw9JuI0B7N10W-M_YMx0',
      authDomain: 'devio-app.firebaseapp.com',
      databaseURL: 'https://devio-app.firebaseio.com',
      projectId: 'devio-app',
      storageBucket: 'devio-app.appspot.com'
    })
  },
  mounted () {
    this.$store.dispatch('loadTechs')
    this.$store.dispatch('loadUsers')
    this.$store.dispatch('loadPosts')
    this.$store.dispatch('loadSocial')
  }
})
