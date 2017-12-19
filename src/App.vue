<template>
  <div id="app">
		<!-- Barra de Navegación -->
		<nav-bar></nav-bar>
   	
		<!-- Vista del enrutador -->
    <router-view></router-view>
    
    <!-- Footer -->
    <footer-section></footer-section>
  </div>
</template>

<script>
  export default {
    watch: {
      $route () {
        document.documentElement.scrollTop = 0;
      }
    }
  }
</script>

<style src="./styles/app.css"></style>
