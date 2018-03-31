<template>
  <b-navbar toggleable="md" type="dark" fixed="top" id="navbar" class="shady">
		<div class="container">
			<b-navbar-brand to="/"><div class="brand-logo"></div><span>Devio</span></b-navbar-brand>
			
			<b-navbar-toggle target="nav_collapse" id="menuButton" toggleable="md" class="d-md-none"><div class="menu-button"></div></b-navbar-toggle>
			
      <!-- Navbar for mobile devices -->
			<b-collapse is-nav id="nav_collapse">
			  <b-navbar-nav class="d-md-none">					
					<!-- Search bar -->
					<b-nav-form>
						<b-form-input size="sm" class="mr-sm-2 searchbar" type="text" placeholder="Buscar" autocomplete="off"/>
						<b-button size="sm" class="search-button my-2 my-sm-0">
						  <div></div>
						</b-button>
					</b-nav-form>
					
					<!-- Navbar for logged users -->		
					<div class="nav-items" v-if="loggedUserId !== undefined">
            <b-navbar-toggle target="nav_collapse">
              <button class="nav-item button filled primary" right v-b-modal.EditPostModal :update="{}"><span>Publicar</span><img src="/static/icons/megaphone.png"  class="icon post"></button>
            </b-navbar-toggle>

            <b-navbar-toggle target="nav_collapse">
              <router-link to="/" right class="nav-item">
                Inicio
              </router-link>
            </b-navbar-toggle>

            <!-- <b-navbar-toggle target="nav_collapse">
              <router-link to="/explore" right class="nav-item">
                Explorar
              </router-link>
            </b-navbar-toggle> -->
            
            <b-navbar-toggle target="nav_collapse" v-if="loggedUser">
              <router-link :to="'/' + loggedUser.username" right class="nav-item">
                Mi perfil
              </router-link>
            </b-navbar-toggle>
            
            <b-navbar-toggle target="nav_collapse">
              <button right class="nav-item" @click="logOut">
                Cerrar sesión
              </button>
            </b-navbar-toggle>
          </div>
          
          <!-- Navbar for unlogged users -->
          <div class="nav-items" v-if="!loggedUserId">
            <!-- <b-navbar-toggle target="nav_collapse">
              <router-link to="/explore" right class="nav-item">
                Explorar
              </router-link>
            </b-navbar-toggle> -->
             
            <b-navbar-toggle target="nav_collapse">
              <router-link to="/login" right class="nav-item">
                <div class="button outlined">
                  Iniciar Sesión
                </div>
              </router-link>
						</b-navbar-toggle>

            <b-navbar-toggle target="nav_collapse">
              <router-link to="/signup" right class="nav-item">
                <div class="button filled dark">
                  Registrarse
                </div>
              </router-link>
            </b-navbar-toggle>
					</div>
        </b-navbar-nav>
			</b-collapse>
			
      <!-- Navbar for desktop devices -->
			<b-navbar-nav class="d-none d-md-flex">					
        <div class="spacer"></div>
        <!-- Search bar -->
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2 searchbar" type="text" placeholder="Buscar" autocomplete="off"/>
          <b-button size="sm" class="search-button my-2 my-sm-0">
            <div></div>
          </b-button>
        </b-nav-form>
        
        <!-- Unlogged users -->
        <div class="nav-items" v-if="!loggedUserId">
          <!-- <router-link to="/explore" right class="nav-item">
            Explorar
          </router-link> -->

          <router-link to="/login" right class="nav-item">
            <div class="button outlined">Iniciar Sesión</div>
          </router-link>

          <router-link to="/signup" right class="nav-item">
            <div class="button filled dark">Registrarse</div>
          </router-link>
        </div>
        
        <!-- Logged users -->
        <div class="nav-items" v-else>
          <button class="nav-item button filled primary" right v-b-modal.EditPostModal><span>Publicar</span><img src="/static/icons/megaphone.png"  class="icon post"></button>
         
          <router-link to="/" right class="nav-item">
            Inicio
          </router-link>
          
          <!-- <router-link to="/explore" right class="nav-item">
            Explorar
          </router-link> -->
         
          <div class="dropdown nav-item">
            <img id="nav-avatar" :src="avatar" @click="showDropdown">
            <div id="dropdown-links" class="dropdown-content" v-if="loggedUser">
              <router-link :to="'/' + loggedUser.username" class="dropdown-link" right>Mi perfil</router-link>

              <button class="dropdown-link" right @click="logOut">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </b-navbar-nav>
		</div>

		<post-modal></post-modal>
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
      loggedUserId () {
        return this.$store.state.loggedUserId
      },
      loggedUser () {
        return this.$store.getters.getUser({userId: this.$store.state.loggedUserId})
      },
      currentPageIsLandingPage () {
        return this.$route.path.indexOf('/') === 0
      },
      avatar () {
        if (this.loggedUser)
          return this.loggedUser.avatar || '/static/avatar/default.svg'
        else
          return ''
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

      
    },
    methods: {
      showDropdown () {
        document.getElementById("dropdown-links").classList.toggle("show");
        // Close the dropdown menu if the user clicks outside of it
        window.onclick = function(event) {
          if (!event.target.matches('#nav-avatar')) {
          let openDropdown = document.getElementById("dropdown-links");
            if (openDropdown && openDropdown.classList.contains('show'))
              openDropdown.classList.remove('show')
          }
        }
      },
      logOut () {
        this.$store.dispatch('LogOut')
      }
    },
    watch: {
      loggedUserId () {
        this.$router.push('/')
      }
    }
  }
</script>

<style src="../styles/navbar.css"></style>
