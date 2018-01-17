<template>
  <div class="page-content container">
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2">
        <post-card :post="post" :showAuthor="true"></post-card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['username', 'postId'],
    computed: {
      post () {
        return this.$store.getters.getPost(this.postId)
      },
      user () {
        return this.$store.getters.getUserByUsername(this.username)
      }
    }
  }
</script>