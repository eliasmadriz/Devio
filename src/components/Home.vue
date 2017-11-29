<template>
  <div class="container page-content">
		<div class="row">
			<div class="col-10 offset-1 offset-md-0 col-md-5">
				<div class="welcome-text">
					<h3>Aprende a codificar con otros desarrolladores</h3>
					<p>Devio es el mejor lugar para compartir noticias, artículos, tutoriales e información sobre desarrollo de software.</p>
				</div>
				<div class="illustration col-sm-8 offset-sm-2 col-md-12 offset-md-0">
				</div>
			</div>

			<!-- Signup card -->
			<div class="col-10 offset-1 col-sm-8 offset-sm-2 col-md-6 offset-md-1 col-lg-5 offset-lg-2">
				<div class="signup-card">
					<div>
						<h3 class="mb-0">Regístrate</h3>
						<p>y únete a la comunidad</p>
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
							<input type="password" placeholder="Contraseña" id="passwordField">
							<span class="input-group-btn" data-toggle="tooltip" data-original-title="Mostrar contraseña" id="toggleShowPassword">
								<button class="btn show-password" type="button" data-toggle="button" id="passwordButton">
									<div class="icon eye"></div>
								</button>
							</span>
						</div>
					</div>
					
					
				 	<div class="form-line">
				   	<div class="button filled action">Registrarse</div>
				 	</div>
					
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
	mounted() {	
		var html = document.documentElement;
		var navbar = document.getElementById("navbar");
		var menuButton = document.getElementById("menuButton");
		
		// Add a shadow and a background color to the navbar once the user starts scrolling. Remove it if the viewport is at the top of the page (transparent navbar).		
		window.addEventListener('optimizedScroll', function() {
			if(html.scrollTop > 2) {
				navbar.classList.add('shady')
			} else {
				navbar.classList.remove('shady')
			}
		})
		
		// Ensure to add a background to the navbar in case that the menu is opened while the navbar is transparent
		menuButton.addEventListener("click", function () {
			if (menuButton.getAttribute('aria-expanded') === 'true') {
				navbar.classList.remove('open')
			} else {
				navbar.classList.add('open')
			}			
		})
		
		// This one should not be includen for mobile devices
		// remove the background of the navbar if the menu was open when the user resizes the page to a size bigger than 767px (sm breakpoint)
		window.addEventListener('optimizedResize', function () {
			if (window.innerWidth > 767) {
				if (navbar.classList.contains('open'))
					navbar.classList.remove('open')
			}
		})
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
	@import '../styles/home.css';
</style>
