<template>
  <div class="page-content container">
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2">
        <post-card v-if="post" :post="post" :showAuthor="true"></post-card>
        <loading-spinner v-else variant="dark"></loading-spinner>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['postId'],
    computed: {
      post () {
        return this.$store.getters.getPost(this.postId)
      }
    }
  }
</script>