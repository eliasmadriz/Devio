<template>
	<div>
		<div class="auth card">
			<transition name="fade" mode="out-in">
				<!-- Login Content -->
				<div class="wrapper" v-if="cardType === 'login'" key="login">
					<div>
						<h3 class="mb-3">Iniciar Sesión</h3>
					</div>
							
					<div class="form-line">
							<label for="username"></label>
							<input type="text" id="username" autocomplete="off" placeholder="Nombre de Usuario / Email">
					</div>
							
					<div class="form-line">
						<label for="password"></label>
							
						<div class="input-group line" data-toggle="buttons">
							<input :type="passwordFieldType" placeholder="Contraseña" id="passwordField">
							<span class="input-group-btn" data-toggle="tooltip" data-original-title="Mostrar contraseña" id="toggleShowPassword">
								<button :class="{show: show}" class="btn show-password" type="button" data-toggle="button" id="passwordButton" @click="changePasswordFieldType">
								</button>
							</span>
						</div>
					</div>		
						
					<div class="form-line mt-2 mb-3">
						<div class="filled action button">Iniciar Sesión</div>
					</div>
				
					<h6 class="mb-0">¿No tienes una cuenta aún?</h6>
					<span class="link" @click="changeCard">Regístrate ></span>
				</div>
				
				<!-- Signup Content -->
				<div class="wrapper" v-else key="signup">
					<div>
						<h3 class="mb-3">Regístrate</h3>
					</div>
				
					<div class="form-line">
							<label for="username"></label>
							<input type="text" id="username" autocomplete="off" placeholder="Nombre de Usuario">
					</div>
				
					<div class="form-line">
						<label for="email"></label>
						<input type="email" id="email" autocomplete="off" placeholder="Correo electrónico">
					</div>
				
					<div class="form-line">
						<label for="password"></label>
				
						<div class="input-group line" data-toggle="buttons">
							<input :type="passwordFieldType" placeholder="Contraseña" id="passwordField">
							<span class="input-group-btn" data-toggle="tooltip" data-original-title="Mostrar contraseña" id="toggleShowPassword">
								<button :class="{show: show}" class="btn show-password" type="button" data-toggle="button" id="passwordButton" @click="changePasswordFieldType">
								</button>
							</span>
						</div>
					</div>
				
					<div class="form-line mt-2 mb-3">
						<div class="filled action button">Registrarse</div>
					</div>
				
					<h6 class="mb-0">¿Ya tienes una cuenta?</h6>
					<span class="link" @click="changeCard">Inicia sesión ></span>
				</div>
			</transition>
		</div>			
	</div>
</template>

<script>
	export default {
		props: ['card'],
		data () {
			return {
				show: false,
				passwordFieldType: "password",
				cardType: this.card
			}
		},
		methods: {
			changePasswordFieldType () {
				this.show = !this.show;
				this.passwordFieldType === 'password' ? this.passwordFieldType = 'text' : this.passwordFieldType = 'password'
			},
			changeCard () {
				this.cardType === 'login' ? this.cardType = 'signup' : this.cardType = 'login'
			}
		}
	}
</script>

<style>
	@import '../styles/authCard.css';
</style>