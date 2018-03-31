<template>
  <div class="page-content container">
    <div class="row">
      <div class="user col-12 col-md-5 col-lg-4">
        <user-card :user="user"></user-card>
      </div>
      
      <!--    Create posts section -->
      <div class="posts col-12 col-md-7 col-lg-8">
        <h3>Publicaciones</h3>
        
        <div class="posts-wrapper">
          <loading-spinner v-if="$store.state.posts.loading" variant="dark"></loading-spinner>
          <post-card v-if="!posts.empty" v-for="post in posts" :post="post" :key="post.id" :showAuthor="false"></post-card>
          
          <div class="empty-post-list" v-else>Este usuario aún no ha publicado nada <span>:(</span></div>
        </div>
      </div>
    </div>

    <edit-profile-modal v-if="userIsLogged"></edit-profile-modal>
  </div>
</template>

<script>
  export default {
    update () {
      this.fetchData()
    },
    props: ['username'],
    computed: {
      user () {
        return this.$store.getters.getUser({username: this.username})
      },
      userIsLogged () {
        if (this.user)
        return this.user.id === this.$store.state.loggedUserId
        else return;
      },
      posts () {
        let posts = {}
        if (this.user && !this.$store.state.posts.loading) {
          if (!this.user.posts.list) posts.empty = true
          else
          for (let postId in this.user.posts.list) {
            delete posts.empty
            posts[postId] = this.$store.getters.getPost(postId)
          }
        }
        return posts
      }
    },
    methods: {
      fetchData () {
        this.user = this.$store.getters.getUser({username: this.username})
      }
    }
  }
</script>

<style scoped src="../styles/profile.css"></style>
