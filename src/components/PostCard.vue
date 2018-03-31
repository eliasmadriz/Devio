<template>
  <div class="post-card">
    <div class="author-info" v-if="showAuthor">
      <router-link :to="'/' + author.username" class="user">
        <avatar :src="author.avatar"></avatar>
        <div class="names">
          <h6 class="public-name">
            {{ author.publicName }}
          </h6>
          <p class="username">
            @{{ author.username }}
          </p>
        </div>
      </router-link>
    </div>
    
    <div class="post-content">
      <div class="first-row">
        <div class="badge-group techs">
          <img class="tech badge" v-for="techName in post.techs" :src="$store.getters.getTechInfo(techName).logo" :key="techName" >
        </div>
        
        <div class="upvotes">
          <div class="vote-button" @click="toggleVote">           
            <transition name="quick-fade" mode="out-in">
              <img src="/static/icons/upvote-active.png"  v-if="userHasVoted" key="voted">
              
              <img src="/static/icons/upvote.png"  v-else key="not-voted">
            </transition>
          </div>
          <div class="votes-number">
            {{ post.upvotes.total }}
          </div>
        </div>
      </div>
      
      <router-link class="post-title" :to="'/post/' + post.id">
        <h5>{{ post.title }}</h5>
        <small class="date">6d</small>
      </router-link>
      
      <p class="description">
        {{ post.description }}
      </p>
      
      <div class="last-row">
        <div class="badges-section">
          <div class="badge-group links">
            <div class="badges">
              <a :href="link.url" target="_blank" class="link" v-for="link in post.links" :key="link.url">
                <div class="badge-holder">
                  <img class="badge" :src="'/static/icons/' + link.type + '.png'" :alt="link.type">
                </div>
                <span>{{ link.type }}</span>
              </a>
            </div>
          </div>          
<!--
          <div class="badge-group language">
            <img class="badge flag" :src="'/static/languages/' + post.language + '.svg'" >
          </div>
-->
        </div>

        <div class="post-buttons" v-if="(post.authorId === this.$store.state.loggedUserId) && (!erasing)">
          <div class="post-button edit" @click="editPost(post)" v-b-modal.EditPostModal> 
            <img src="/static/icons/edit.svg" alt="edit">
          </div>

          <div class="post-button edit" @click="erasePost(post)" v-b-modal.DeletePostModal>
            <img src="/static/icons/trash.png" >
          </div>
          
          <!-- <div class="post-button bookmark" @click="toggleBookmark">
            <transition name="quick-fade" mode="out-in">
              <img src="/static/icons/bookmark-active.png"  v-if="userHasBookmarked" key="bookmarked">
              <img src="/static/icons/bookmark.png"  v-else key="not-bookmarked">
            </transition>
          </div>           -->
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['post', 'showAuthor', 'erasing'],
    data () {
      return {
        author: this.$store.getters.getUser({userId: this.post.authorId}),
        userHasVoted: false, // should be a computed property based on the existence of the logged user's id in the list of users who upvoted the post.
        userHasBookmarked: false, // should be a computed property based on the existence of the post's id in the user's bookmarked posts list.
        showMoreOptions: false
      }
    },
    methods: {
      toggleVote () {
        this.userHasVoted = !this.userHasVoted
      },
      toggleBookmark () {
        this.userHasBookmarked = !this.userHasBookmarked
      },
      editPost (post) {
        this.$root.$emit('EditPost', post)
      },
      erasePost (post) {
        this.$root.$emit('DeletePost', post)
      }
    }
  }
</script>

<style scoped src="../styles/postCard.css"></style>
