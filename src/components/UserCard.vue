<template>
  <div class="user-card">
    <div class="first-row">
      <div class="user">
        <img :src="user.avatar" alt="" class="avatar">
        <div class="names">
          <h5 class="public-name">{{ user.publicName }}</h5>
          <p class="username">@{{ user.username }}</p>
        </div>
      </div>
      <user-action-button :id="user.id"></user-action-button>
    </div>
    <p class="bio small">{{ user.bio }}</p>
    <div class="badge-group techs">
      <img class="tech badge" v-for="tech in user.favTechs" :key="tech.name" :src="$store.getters.getTechInfo(tech).logo" alt="">
    </div>
    
    <div class="stats unselectable">
      <div class="total-posts">
        <small class="label">Posts</small>
        <h4 class="number">{{ user.posts.total }}</h4>
      </div>
      <div class="total-followers">
        <small class="label">Seguidores</small>
        <h4 class="number">{{ user.followers.total }}</h4>
      </div>
      <div class="total-following">
        <small class="label">Siguiendo</small>
        <h4 class="number">{{ user.following.total }}</h4>
      </div>
      <div class="total-points">
        <small class="label">Puntos</small>
        <h4 class="number">{{ user.points }}</h4>
      </div>
    </div>
    
    <div class="last-row">
      <div class="badge-group social">
        <a :href="socialLink.url" target="_blank" class="badge social" v-for="socialLink in user.socialLinks" :key="socialLink.name">
          <img :src="$store.getters.getSocialNetworkInfo(socialLink.name).logo" alt="">
        </a>
      </div>
      
      <a :href="user.website" target="_blank" class="website">
        Website
        <img src="/static/icons/popout.png" alt=""> 
      </a>
    </div>
  </div>  
</template>

<script>
  export default {
    props: ['user'],
    data () {
      return {
        
      }
    }
  }
</script>

<style scoped src="../styles/userCard.css"></style>