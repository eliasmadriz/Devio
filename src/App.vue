<template>
  <div id="app">
  
		<!-- Barra de Navegación -->
		<b-navbar toggleable="md" type="dark" fixed="top" id="navbar">
		<div class="container">
			<b-navbar-brand to="/"><div class="brand-logo"></div><span>Devio</span></b-navbar-brand>
			
			<b-navbar-toggle target="nav_collapse" id="menuButton" v-if="!focusNavbar"><div class="menu-button"></div></b-navbar-toggle>
			
			<b-collapse is-nav id="nav_collapse">
			
				<!-- Right aligned nav items -->
				<b-navbar-nav>
					<div class="spacer d-none d-md-block"></div>
					
					<!-- Search bar -->
					<b-nav-form v-if="!focusNavbar">
						<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Buscar" autocomplete="off"/>
						<b-button size="sm" class="search-button my-2 my-sm-0" to="/searchResults"><div></div></b-button>
					</b-nav-form>
					
					<!-- Navbar for logged users -->		
					<div class="nav-items" v-if="userIsLogged">
						<b-nav-item href="#" class="button outlined" right>Publicar</b-nav-item>
									
						<b-nav-item to="/explore" right>Explorar</b-nav-item>
					
						<div class="dropdown nav-item d-none d-md-block">
							<img id="nav-avatar" src="./assets/avatar/avatar.svg" alt="">
							<div id="dropdown-links" class="dropdown-content">
								<b-nav-item to="/LoggedUserId" class="dropdown-link" right>Mi perfil</b-nav-item>
						
								<b-nav-item to="/" class="dropdown-link" right>Cerrar Sesión</b-nav-item>
							</div>
						</div>
										
						<b-nav-item href="#" right class="d-md-none">Mi perfil</b-nav-item>
						
						<b-nav-item href="#" right class="d-md-none">Cerrar Sesión</b-nav-item>
					</div>
								
					<!-- Navbar for unlogged users -->
					<div class="nav-items" v-if="!focusNavbar && !userIsLogged">
						<router-link to="/explore" right>Explorar</router-link>

						<router-link to="/login" right class="button outlined">Iniciar Sesión</router-link>

						<router-link to="/signup" right class="button filled">Registrarse</router-link>
					</div>
				</b-navbar-nav>		
			</b-collapse>
		</div>
		</b-navbar>
   	
		<!-- Vista del enrutador -->
    <router-view></router-view>
  </div>
</template>

<script>
(function() {
	var throttle = function(type, name, obj) {
			obj = obj || window;
			var running = false;
			var func = function() {
					if (running) { return; }
					running = true;
					 requestAnimationFrame(function() {
							obj.dispatchEvent(new CustomEvent(name));
							running = false;
					});
			};
			obj.addEventListener(type, func);
	};

	/* init - you can init any event */
	throttle("resize", "optimizedResize");
	throttle("scroll", "optimizedScroll");
})();
		
export default {
	data () {
		return {
			
		}
	},
	computed: {
		userIsLogged () {
			return false;
		},
		focusNavbar () {
			return this.$route.path.indexOf('/login') === 0 || this.$route.path.indexOf('/register') === 0
		},
		currentPageIsLandingPage () {
			return this.$route.path.indexOf('/') === 0
		}
	},		
	mounted () {
		// Profile links dropdown
		var drop = document.getElementById("nav-avatar");
		if (drop != undefined) {
			drop.addEventListener("click", function() {
					document.getElementById("dropdown-links").classList.toggle("show");
				});
			// Close the dropdown menu if the user clicks outside of it
			window.onclick = function(event) {
				if (!event.target.matches('#nav-avatar')) {
					var openDropdown = document.getElementById("dropdown-links");				
					if (openDropdown.classList.contains('show'))
						openDropdown.classList.remove('show');
				}
			}
		}
	}
}
</script>

<style>
	@import 'styles/app.css';
</style>
