<template>
  <div id="app">
  
		<!-- Barra de Navegación -->
		<b-navbar toggleable="md" type="dark" fixed="top" id="navbar">
		<div class="container">
			<b-navbar-brand href="#"><div class="brand-logo"></div><span>Devio</span></b-navbar-brand>
			
			<b-navbar-toggle target="nav_collapse" id="menuButton"><div class="menu-button"></div></b-navbar-toggle>
			
			<b-collapse is-nav id="nav_collapse">
			
				<!-- Right aligned nav items -->
				<b-navbar-nav>
					<div class="spacer d-none d-md-block"></div>
					<b-nav-form>
						<b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Buscar" autocomplete="off"/>
						<b-button size="sm" class="search-button my-2 my-sm-0" type="submit"><div></div></b-button>
					</b-nav-form>
								
					<div class="nav-items">
						<b-nav-item href="#" right>Explorar</b-nav-item>
									
						<b-nav-item href="#" right class="button outlined">Iniciar Sesión</b-nav-item>
						
						<b-nav-item href="#" right class="button filled"> Registrarse</b-nav-item>
					</div>
				</b-navbar-nav>
			
			</b-collapse>
		</div>
		</b-navbar>
   	
		<!-- Vista del enrutador	-->
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
	}
}
</script>

<style>
	@import 'styles/app.css';
</style>
