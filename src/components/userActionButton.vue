<template>
  <div class="action">
    <router-link :to="'\/' + username"
        v-if="isLogged && $route.path === '\/'">
      <button class="button outlined secondary">Ver Perfil</button>
    </router-link>

    <button class="button outlined secondary edit-profile" 
        v-else-if="isLogged && $route.path !== '\/'"
        v-b-modal.EditProfileModal><span>Editar</span><img src="/static/icons/edit.svg" class="icon post"></button>

    <button class="button primary follow" 
        @click="toggleFollow" 
        @mouseover="showUnfollowButton" 
        @mouseleave="hideUnfollowButton" 
        :class="{filled: following, outlined: !following, unfollow: unfollow}" 
        v-else
        unselectable="on">{{ actionButtonMessage }}</button>
  </div>
</template>

<script>
  export default {
    props: ['id', 'username'],
    computed: {
      actionButtonMessage () {
        return this.following ? 'Siguiendo' : 'Seguir'
      },
      following () {
        return false;
      }, 
      unfollow () {
        return false;
      },
      isLogged () {
        return this.id === this.$store.state.loggedUserId
      }
    },
    methods: {
      toggleFollow () {
        // this.following = !this.following  
        // this.unfollow = false;
        // this.actionButtonMessage = this.following ? 'Siguiendo' : 'Seguir'
      },
      showUnfollowButton () {
        // if (this.following) {
        //   this.actionButtonMessage = 'Dejar de Seguir'
        //   this.unfollow = true;
        // }
      },
      hideUnfollowButton () {
        // if (this.following) {
        //   this.actionButtonMessage = this.following ? 'Siguiendo' : 'Seguir'
        //   this.unfollow = false;
        // }
      }
    }
  }
</script>

<style scoped>
  .action {
    align-self: center;
  }
  
  .unfollow {
    background-color: var(--danger) !important;
  }
  
  @media (max-width: 767px) {
    .action {
      display: flex;
      flex-direction: column;
    }
  }
  
  @media (max-width: 380px) {  
    .follow {
      align-self: center;
      display: flex;
      justify-content: center;
      max-width: 200px;
      text-align: center;
      width: 80%;
    }
  }
</style>
