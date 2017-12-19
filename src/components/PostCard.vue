<template>
  <div class="post-card">
    <div class="author-info" v-if="showAuthor">
      <router-link :to="'/' + author.username" class="user">
        <img :src="author.avatar" alt="" class="avatar">
        <div class="names">
          <h6 class="public-name">
            {{ author.publicName }}
          </h6>
          <p class="username">
            @{{ author.username }}
          </p>
        </div>
      </router-link>
      <user-action-button :id="author.id"></user-action-button>
    </div>
    
    <div class="post-content">
      <div class="first-row">
        <div class="badge-group techs">
          <img class="tech badge" v-for="techName in post.techs" :src="$store.getters.getTechInfo(techName).logo" alt="">
        </div>
        
        <div class="upvotes">
          <div class="vote-button" @click="toggleVote">           
            <transition name="quick-fade" mode="out-in">
              <img src="/static/icons/upvote-active.png" alt="" v-if="userHasVoted" key="voted">
              
              <img src="/static/icons/upvote.png" alt="" v-else key="not-voted">
            </transition>
          </div>
          <div class="votes-number">
            {{ post.upvotes.total }}
          </div>
        </div>
      </div>
      
      <h5 class="post-title">
        <a href="">{{ post.title }}</a>
      </h5>
      
      <p class="description">
        {{ post.description }}
      </p>
      
      <div class="last-row">
        <div class="badges-section">
          <div class="badge-group links">
            <div class="badges">
              <a :href="link.url" class="link" v-for="link in post.links">
                <div class="badge-holder">
                  <img class="badge" :src="'/static/icons/' + link.type + '.png'" alt="">
                </div>
                <span>{{ link.type }}</span>
              </a>
            </div>
          </div>
          
          <div class="badge-group language">
            <img class="badge flag" :src="'/static/languages/' + post.language + '.svg'" alt="">
          </div>
        </div>
        
        <div class="post-buttons">     
          <div class="post-button edit">
            <img src="/static/icons/edit.svg" alt="">
          </div>
          
          <div class="post-button bookmark" @click="toggleBookmark">
            <transition name="quick-fade" mode="out-in">
              <img src="/static/icons/bookmark-active.png" alt="" v-if="userHasBookmarked" key="bookmarked">
              <img src="/static/icons/bookmark.png" alt="" v-else key="not-bookmarked">
            </transition>
          </div>          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['post', 'showAuthor'],
    data () {
      return {
        author: this.$store.getters.getUser(this.post.authorId),
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
      }
    }
  }
</script>

<style scoped src="../styles/postCard.css">  </style>