import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Profile from '@/components/Profile'
import Credits from '@/components/Credits'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/login',
			name: 'Login',
			component: Login,
			props: true
		},
		{
			path: '/signup',
			name: 'SignUp',
			component: SignUp,
			props: true
		},
    {
      path: '/credits',
      name: 'Credits',
      component: Credits
    },
    {
      path: '/:username',
      name: 'Profile',
      component: Profile,
      props: true
    }
	]
});