<template>
  <div class="auth card">
    <b-alert :variant="alert.type"
             dismissible
             :show="alert.show"
             @dismissed="alert.show = false">
      {{ alert.message }}
    </b-alert>
    <transition name="fadeHeight" mode="out-in">
      <!-- Login Content -->
      <div class="wrapper" v-if="cardType === 'login'" key="login">
        <form @submit.prevent="commitSignin">
        <div>
          <h3 class="mb-3">Iniciar Sesión</h3>
        </div>
            
        <div class="form-line">
          <label for="signinEmail">
            <img src="/static/icons/user.png">
          </label>
          <input type="text" id="signinEmail" required placeholder="Correo o usuario" v-model="signinCredentials.email">
        </div>
            
        <div class="form-line">
          <label for="signinPassword">
            <img src="/static/icons/lock.png" alt="">
          </label>
            
          <div class="input-group line" data-toggle="buttons">
            <input :type="passwordFieldType" placeholder="Contraseña" required id="signinPassword" v-model="signinCredentials.password">
            <span class="input-group-btn" id="toggleShowPassword">
              <button :class="{show: show}" class="btn show-password" type="button" data-toggle="button" @click="changePasswordFieldType">
              </button>
            </span>
          </div>
        </div>

        <div class="form-line submit mt-2 mb-3">
          <button type="submit" class="filled action button" :disabled="commiting">
            <transition name="fade" mode="out-in">
              <span v-if="!commiting" key="button-text">Iniciar Sesión</span>
              <div class="loading spinner" v-if="commiting" key="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
              </div>
            </transition>
          </button>
        </div>
        </form>
      
        <h6 class="mb-0">¿No tienes una cuenta aún?</h6>
        <span class="link" @click="changeCard">Regístrate ></span>
      </div>
      
      <!-- Signup Content -->
      <div class="wrapper" v-else key="signup">
        <form @submit.prevent="commitSignup">
        <div>
          <h3 class="mb-3">Regístrate</h3>
        </div>

        <div class="form-line">
          <label for="signupName">
            <img src="/static/icons/user.png">
          </label>
          <input type="text" id="signupName" autocomplete="off" required placeholder="Nombre completo" v-model="signupCredentials.name">
        </div>

        <div class="form-line">
          <label for="signupUsername">
            <span>@</span>
          </label>
          <input type="text" id="signupUsername" autocomplete="off" required placeholder="Nombre de usuario" v-model="signupCredentials.username">
        </div>
      
        <div class="form-line">
          <label for="signupEmail">
            <img src="/static/icons/mail.png">
          </label>
          <input type="email" id="signupEmail" autocomplete="off" required placeholder="Correo electrónico" v-model="signupCredentials.email">
        </div>
      
        <div class="form-line">
          <label for="signupPassword">
            <img src="/static/icons/lock.png">
          </label>
      
          <div class="input-group line" data-toggle="buttons">
            <input :type="passwordFieldType" placeholder="Contraseña" id="signupPassword" required v-model="signupCredentials.password">
            <span class="input-group-btn">
              <button :class="{show: show}" class="btn show-password" type="button" data-toggle="button" id="passwordButton" @click="changePasswordFieldType">
              </button>
            </span>
          </div>
        </div>
      
        <div class="form-line submit mt-2 mb-3">
          <button type="submit" class="filled action button" :disabled="commiting">
            <transition name="fade" mode="out-in">
              <span v-if="!commiting" key="button-text">Registrarse</span>
              <div class="loading spinner" v-if="commiting" key="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
              </div>
            </transition>
          </button>
        </div>
        </form>
      
        <h6 class="mb-0">¿Ya tienes una cuenta?</h6>
        <span class="link" @click="changeCard">Inicia sesión ></span>
      </div>
    </transition>
  </div>
</template>

<script>
  import * as firebase from 'firebase'
	export default {
		props: ['card'],
		data () {
			return {
				show: false,
				passwordFieldType: "password",
        cardType: this.card,
        signupCredentials : {
          name: '',
          username: '',
          email: '',
          password: ''
        },
        signinCredentials: {
          email: '',
          password: ''
        },
        emailValidator: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
        usernameHasSpaces: /^\S*$/,
        usernameValidator: /^[a-z0-9_]+$/,
        alert: {
          message: '',
          show: false,
          type: 'danger'
        },
        commiting: false
			}
		},
		methods: {
      showError (message) {
        this.alert.message = message
        this.alert.show = true
      },
			changePasswordFieldType () {
				this.show = !this.show;
				this.passwordFieldType === 'password' ? this.passwordFieldType = 'text' : this.passwordFieldType = 'password'
			},
			changeCard () {
        this.alert.show = false
				this.cardType === 'login' ? this.cardType = 'signup' : this.cardType = 'login'
      },
      commitSignin () {
        this.alert.show = false
        // Validate the info provided
        let isEmail = this.emailValidator.test(this.signinCredentials.email)

        let _this = this
        function dispatchSignin (data) {
          _this.commiting = true
          _this.$store.dispatch('SignIn', data)
          .then()
          .catch(function (error) {            
              _this.commiting = false
              if (error.code === 'auth/wrong-password')
                _this.showError('Contraseña inválida')
              else if (error.code === 'auth/user-not-found')
                _this.showError('No existe una cuenta asociada a ese correo electrónico')
              else if (error.code === 'auth/invalid_username')
                _this.showError('No existe una cuenta con ese nombre de usuario')
              else 
                _this.showError('Parece que hubo un error')
          })
        }
        dispatchSignin(this.signinCredentials)
      },
      commitSignup () {
        this.alert.show = false
        // Variables to double-check all the info is provided
        let hasName = this.signupCredentials.name !== ''
        let hasUsername = this.signupCredentials.username !== ''
        let hasEmail = this.signupCredentials.email !== ''
        let hasPassword = this.signupCredentials.password !== ''

        // Variables to validate the info provided
        let validEmail = this.emailValidator.test(this.signupCredentials.email)
        let validPassword = this.signupCredentials.password.length >= 6
        let validName = this.signupCredentials.name.length <= 20

        this.signupCredentials.username = this.signupCredentials.username.toLowerCase()
        let usernameHasSpaces = this.usernameHasSpaces.test(this.signupCredentials.username)
        let usernameTooLong = this.signupCredentials.username.length > 16
        let validUsername = this.usernameValidator.test(this.signupCredentials.username)

        // Validate the info
        if (!hasName || !hasUsername || !hasEmail || !hasPassword) {
          this.showError('Los campos aún son obligatorios ;)')
        } else if (!validName) {
          this.showError('El nombre público es muy largo, usa menos de 20 caracteres')
        } else if (!validEmail) {
          this.showError('Utiliza una dirección de correo válida')
        } else if (!validPassword) {
          this.showError('La contraseña debe contener al menos 6 caracteres')          
        } else if (!usernameHasSpaces) {
          this.showError('El nombre de usuario no puede contener espacios')
        } else if (usernameTooLong) {
          this.showError('El nombre de usuario es demasiado largo. Usa menos de 16 caracteres')
        } else if (!validUsername) {
          this.showError('El nombre de usuario solo puede conteners letras, números y guines bajos (_)')
        } else {
          this.commiting = true
          let _this = this
          this.$store.dispatch('SignUp', this.signupCredentials)
          .then()
          .catch(function (error) {
            _this.commiting = false
            if (error.code === 'auth/email-already-in-use')
              _this.showError('Ya existe una cuenta con esa dirección de correo')
            else if (error.code === 'auth/taken_username')
              _this.showError('El nombre de usuario no está disponible, elige otro')
            else if (error.code === 'auth/network-request-failed')
              _this.showError('Algo salió mal. Verifica tu conexión e intenta de nuevo')
            else
              _this.showError('Parece que hubo un error')
          })
        }
      }
    }
	}
</script>

<style scoped src="../styles/authCard.css"></style>