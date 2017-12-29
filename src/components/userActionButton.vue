<template>
  <div class="action">
    <div class="button primary follow" @click="toggleFollow" @mouseover="showUnfollowButton" @mouseleave="hideUnfollowButton" :class="{filled: following, outlined: !following, unfollow: unfollow}" unselectable="on">{{ actionButtonMessage }}</div>
  </div>
</template>

<script>
  export default {
    props: ['authorId'],
    data () {
      return {
        actionButtonMessage: this.following ? 'Siguiendo' : 'Seguir',
        following: false,
        unfollow: false,
      }
    },
    methods: {
      toggleFollow () {
        this.following = !this.following  
        this.unfollow = false;
        this.actionButtonMessage = this.following ? 'Siguiendo' : 'Seguir'
      },
      showUnfollowButton () {
        if (this.following) {
          this.actionButtonMessage = 'Dejar de Seguir'
          this.unfollow = true;
        }
      },
      hideUnfollowButton () {
        if (this.following) {
          this.actionButtonMessage = this.following ? 'Siguiendo' : 'Seguir'
          this.unfollow = false;
        }
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
      margin: .5em auto;
      max-width: 200px;
      text-align: center;
      width: 80%;
    }
  }
</style>
