<template>
  <div class="user-card">
    <transition name="fade" mode="out-in">
      <loading-spinner variant="dark" v-if="!user"></loading-spinner>
  
      <div class="user-data" v-else>
        <div class="first-row">
          <router-link class="user" :to="'/' + user.username">
            <avatar :src="user.avatar"></avatar>
            <div class="names">
              <h6 class="public-name">{{ user.publicName }}</h6>
              <p class="username">@{{ user.username }}</p>
            </div>
          </router-link>
          <user-action-button :id="user.id" :username="user.username"></user-action-button>
        </div>
    
        <p class="bio" v-if="!minified">{{ user.bio }}</p>
    
        <div v-if="!minified && user.favTechs.length !== 0">
          <div class="badge-group techs" v-if="!$store.state.techs.loading">
            <img class="tech badge" :src="$store.state.techs[key].logo" v-for="key in user.favTechs" :key="key">
          </div>

          <loading-spinner v-else variant="dark" class="badge"></loading-spinner>
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
        
        <div class="last-row" v-if="!minified">
          <div class="badge-group social" v-if="user.socialLinks">
            <loading-spinner v-if="$store.state.social.length === 0" variant="dark"></loading-spinner>
            <a :href="value" target="_blank" class="badge social" v-else v-for="(value, key) in user.socialLinks" :key="key">
              <img :src="$store.getters.getSocialNetworkInfo(key).logo" :alt="key" :title="key">
            </a>
          </div>
          
          <a :href="user.website" target="_blank" class="website" v-if="user.website !== ''">
            Website
            <img src="/static/icons/popout.png">
          </a>
        </div>
      </div>
    </transition>
  </div>  
</template>

<script>
  export default {
    props: ['minified', 'user'],
    computed: {
      loadedTechs () {
        if (!this.$store.state.techs.loading) return true
        else return false
      }
    }
  }
</script>

<style scoped src="../styles/userCard.css"></style>
