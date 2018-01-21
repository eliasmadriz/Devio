<template>
  <div class="page-content container">
    <div class="row">
      <!-- Left column -->
      <div class="user d-none d-md-block col-md-5 col-lg-4">
        <user-card :user="this.$store.getters.getUser(loggedUserId)" :minified="true"></user-card>

        <div class="post-shortcut">
          <h5>Comparte algo con tus seguidores</h5>
          <div class="button filled primary" v-b-modal.EditPostModal><span>Publicar</span><img src="/static/icons/megaphone.png" alt="" class="text-icon"></div>
        </div>
      </div>

      <!-- Posts section -->
      <div class="posts col-12 col-md-7 col-lg-8">
        <h3>Inicio</h3>

        <div class="posts-wrapper">
          <post-card v-if="posts !== 'empty'" v-for="post in posts" :post="post" :key="post.id" :showAuthor="true"></post-card>

          <div class="empty-post-list" v-if="posts.length === 0">Aún no sigues a nadie</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      posts () {
        return this.$store.getters.dashboardPosts
      },
      loggedUserId () {
        return this.$store.state.loggedUserId
      }
    }
  }
</script>

<style scoped>
  .post-shortcut {
    align-items: center;
    background-color: var(--neutral);
    border-radius: var(--semi-rounded-corner);
    box-shadow: var(--card-shadow);
    display: flex;
    flex-direction: column;
    margin-top: 1em;
    padding: .5em;
    text-align: center;
  }

  .post-list-selectors {
    align-items: center;
    background-color: var(--neutral);
    border-radius: var(--semi-rounded-corner);
    box-shadow: var(--card-shadow);
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
    padding: .5em 1em;
  }

  .posts-wrapper .post-card {
    margin-bottom: 1em;
  }

  @media (max-width: 767px) {
    .posts {
      text-align: center;
    }
  }
</style>
