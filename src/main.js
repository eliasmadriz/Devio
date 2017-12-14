import Vue from 'vue'
import App from './App'
import router from './router'
import {store} from './store.js'
import BootstrapVue from 'bootstrap-vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import navbar from './components/Navbar.vue'
import footer from './components/Footer.vue'
import authCard from './components/AuthCard.vue'
import techCard from './components/TechCard.vue'
import postCard from './components/Postcard.vue'
import userCard from './components/UserCard.vue'
import userActionButton from './components/userActionButton.vue'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'swiper/dist/css/swiper.css'

Vue.use(BootstrapVue)
Vue.use(VueAwesomeSwiper)

Vue.component('auth-card', authCard)
Vue.component('tech-card', techCard)
Vue.component('nav-bar', navbar)
Vue.component('footer-section', footer)
Vue.component('post-card', postCard)
Vue.component('user-card', userCard)
Vue.component('user-action-button', userActionButton)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
	store,
  render: h => h(App)
})
