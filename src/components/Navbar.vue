<template>
  <b-navbar toggleable="md" type="dark" fixed="top" id="navbar" class="shady">
		<div class="container">
			<b-navbar-brand to="/"><div class="brand-logo"></div><span>Devio</span></b-navbar-brand>
			
			<b-navbar-toggle target="nav_collapse" id="menuButton" v-if="!focusPage"><div class="menu-button"></div></b-navbar-toggle>
			
			<b-collapse is-nav id="nav_collapse">
			
				<!-- Right aligned nav items -->
				<b-navbar-nav>
					<div class="spacer d-none d-md-block"></div>
					
					<!-- Search bar -->
					<b-nav-form v-if="!focusPage">
						<b-form-input size="sm" class="mr-sm-2 searchbar" type="text" placeholder="Buscar" autocomplete="off"/>
						<b-button size="sm" class="search-button my-2 my-sm-0">
						  <div></div>
						</b-button>
					</b-nav-form>
					
					<!-- Navbar for logged users -->		
					<div class="nav-items" v-if="userIsLogged">
						<router-link to="/" class="nav-item" right>
              <div class="button filled primary">Publicar <img src="/static/icons/megaphone.png" alt="" class="text-icon"></div>
            </router-link>
									
						<router-link to="/explore" right class="nav-item">
              Explorar
            </router-link>
					
						<div class="dropdown nav-item d-none d-md-block">
							<img id="nav-avatar" src="/static/avatar/avatar.svg" alt="" class="button outlined">
							<div id="dropdown-links" class="dropdown-content">
								<router-link to="/LoggedUserusername" class="dropdown-link" right>Mi perfil</router-link>
								
								<router-link to="/LoggedUserId" class="dropdown-link" right>Marcadores</router-link>
						
								<router-link to="/" class="dropdown-link" right>Cerrar Sesión</router-link>
							</div>
						</div>
									
            <!-- For mobile only -->
						<router-link to="/" right class="d-md-none nav-item">Mi perfil</router-link>
						
						<router-link to="/" right class="d-md-none nav-item">Cerrar Sesión</router-link>
					</div>
								
					<!-- Navbar for unlogged users -->
					<div class="nav-items" v-if="!focusPage && !userIsLogged">
						<router-link to="/explore" right class="nav-item">
				      Explorar
						</router-link>

						<router-link to="/login" right class="nav-item">
						  <div class="button outlined">Iniciar Sesión</div>
						</router-link>

						<router-link to="/signup" right class="nav-item">
						  <div class="button filled neutral">Registrarse</div>
						</router-link>
					</div>
				</b-navbar-nav>		
			</b-collapse>
		</div>
  </b-navbar>
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
    computed: {
      focusPage () {
        return this.$route.path.indexOf('/login') === 0 || this.$route.path.indexOf('/signup') === 0
      },
      userIsLogged () {
        return 0
      },
      currentPageIsLandingPage () {
        return this.$route.path.indexOf('/') === 0
      }
    },
    mounted () {
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

      // Ensures to add a background to the navbar in case that the menu is opened while the navbar is transparent
      if (menuButton) {
        menuButton.addEventListener("click", function () {
          if (menuButton.getAttribute('aria-expanded') === 'true') {
            navbar.classList.remove('open')
          } else {
            navbar.classList.add('open')
          }			
        })
      }

      // Removes the background of the navbar if the menu was open when the user resizes the page to a size bigger than 767px (sm breakpoint). This one should not be included for mobile devices
      window.addEventListener('optimizedResize', function () {
        if (window.innerWidth > 767) {
          if (navbar.classList.contains('open'))
            navbar.classList.remove('open')
        }
      })
      
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

<style src="../styles/navBar.css"></style>