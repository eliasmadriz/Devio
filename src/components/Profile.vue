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
          <post-card v-if="posts !== 'empty'" v-for="post in posts" :post="post" :key="post.id" :showAuthor="false"></post-card>
          
          <div class="empty-post-list" v-if="posts === 'empty'">Este usuario aún no ha publicado nada <span>:(</span></div>
        </div>
      </div>
    </div>
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
        return this.$store.getters.getUserByUsername(this.username)
      },
      posts () {
        if (this.user.posts.list.length > 0) {
          return this.user.posts.list.map((postId) => {
            return this.$store.getters.getPost(postId)
          })
        } else {
          return 'empty'
        }
      }
    },
    methods: {
      fetchData () {
        alert('updated!')
        this.user = this.$store.getters.getUserByUsername(this.username)
      }
    }
  }
</script>

<style scoped src="../styles/profile.css"></style>
