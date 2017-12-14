<template>
  <div class="tech-card">
    <div class="tech-logo">
      <img :src="info.logo" alt="" class="logo">
    </div>
    <div class="tech-info">
      <h6 class="name">{{ info.name }}</h6>
      <span>{{ info.totalPosts }}+ Publicaciones</span>
      <span>{{ info.totalDevs }}+ Desarrolladores</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['info'],
    data () {
      return {
        
      }
    }
  }
</script>

<style>
  @import '../styles/techCard.css'
</style>