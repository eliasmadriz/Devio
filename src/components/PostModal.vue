<template>
  <div>
    <b-modal id="PostModal" ref="PostModal" no-close-on-backdrop no-close-on-esc>
      <div slot="modal-header">
        <button class="button outlined dark" @click="hideModal"><img src="/static/icons/cancel-black.png" alt="" class="text-icon"> Cancelar</button>
        <h4 class="modal-title d-none d-md-block">Nueva Publicación</h4>
        <button class="button filled primary" @click="commitPost" :disabled="!validPost">Publicar <img src="/static/icons/megaphone.png" alt="" class="text-icon"></button>
      </div>
           
      <h4 class="title d-md-none">Nueva publicación</h4>
            
      <div class="left-column">
        <div class="form-line">
          <h5 class="label">Título</h5>
          <input type="text" class="field" v-model="newPost.title">
        </div>

        <div class="form-line">
          <h5 class="label">Descripción</h5>
          <textarea class="field" rows="7" v-model="newPost.description"></textarea>
        </div>

        <div class="form-line">
          <h5 class="label">Añadir tecnología</h5>
          <div class="field-and-button">
            <vue-awesomplete :setting="{ list: existingTechs, minChars: 1, autoFirst: true}" class="field" v-model="newTechName" ref="NewTechField"></vue-awesomplete>
            <button class="button outlined primary field-button" :disabled="techIndex === -1" @click="addTech(techIndex)">
              <img src="/static/icons/plus.png" alt="">
            </button>
          </div>
        </div>
        
        <div class="form-line">
          <h5 class="label">Añadir enlace</h5>
          <div class="link-url form-line-flex">
            <input type="text" class="field" placeholder="Dirección" v-model="newLinkUrl">
            <div class="link-types">
              <select name="type" id="link-type" ref="NewLinkType" @change="changeLinkType($refs.NewLinkType.selectedIndex)" required>
                <option value="null" selected disabled>Tipo</option>
                <option value="article">Artículo</option>
                <option value="video">Video</option>
                <option value="project">Proyecto</option>
                <option value="book">Libro</option>
                <option value="other">Otro</option>
              </select>
              <img src="/static/icons/chevron-down.png" alt="" class="arrow">
            </div>
          </div>

          <div class="form-line-flex">
            <button class="button outlined primary" :disabled="!validLink" @click="addLink">Añadir enlace</button>
          </div>
        </div>
      </div>

      <div class="right-column">         
        <div class="techs form-line">
          <h5 class="label">Tecnologías</h5>
          <div class="tech-list">
            <div class="list-entry" v-for="(tech, i) in newPost.techs" :key="i">
              <img :src='$store.getters.getTechInfo(tech).logo' alt="" class="entry-icon">
              <span class="entry-title">{{ tech }}</span>
              <button class="remove-entry button outlined dark" @click="deleteEntry('techs', i)"><img src="/static/icons/cancel-black.png" alt=""></button>
            </div>
            <div class="empty-list" v-if="!newPost.techs.length">
              <span>Aún no has agregado ninguna tecnología.</span>
            </div>
          </div>
        </div>
        <div class="links form-line">
          <h5 class="label">Enlaces</h5>
          <div class="link-list">
            <div class="list-entry" v-for="(link, i) in newPost.links" :key="i">
              <img :src='"/static/icons/" + link.type + ".png"' alt="" class="entry-icon">
              <a class="entry-title" :href="link.url" target="_blank">{{ link.url }}</a>
              <button class="remove-entry button outlined dark" @click="deleteEntry('links', i)"><img src="/static/icons/cancel-black.png" alt=""></button>
            </div>
            <div class="empty-list" v-if="!newPost.links.length">
              <span>Aún no has agregado ningún enlace.</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer"></div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        existingTechs: this.$store.state.techs.map(function (tech) {
          return tech.name.toLowerCase()
        }),
        newPost: {
          title: '',
          description: '',
          techs: [],
          links: [],
          language: "spanish",
          upvotes: {total: 0, list: []}
        },
        newTechName: '',
        newLinkUrl: '',
        newLinkType: 0,
        urlValidator: /\.+/,
        hasHttp: /^(http)+(s)?(:\/\/)+/i
      }
    },
    computed: {
      techIndex () {
        return this.existingTechs.indexOf(this.newTechName.toLowerCase())
      },
      validLink () {
        return (this.urlValidator.test(this.newLinkUrl)) && (this.newLinkType !== 0)
      },
      validTech () {
        return this.existingTechs.indexOf(this.newTechName) !== -1
      },
      validPost () {
        return (this.newPost.title !== '') &&(this.newPost.description !== '') && (this.newPost.techs.length !== 0) && (this.newPost.links.length !== 0)
      }
    },
    methods: {
      commitPost () {
        if (!this.validPost) 
          return;
        else {
          this.newPost.creationDate = new Date()
          this.$store.dispatch('createPost', this.newPost)
          this.newPost.title = ''
          this.newPost.description = ''
          this.newPost.techs = []
          this.newPost.links = []
          console.log(this.newPost)
          this.hideModal()
        }
      },
      hideModal () {
        this.$refs.PostModal.hide()
      },
      deleteEntry (arr, i) {
        this.newPost[arr].splice(i, 1)
      },
      addTech (i) {
        if (!this.validTech)
          return;
        else {
          if (this.newPost.techs.indexOf(this.$store.state.techs[i].name) === -1) {
            this.$refs.NewTechField.clear()
            this.newPost.techs.push(this.$store.state.techs[i].name)
          } else 
            console.log('You already added that tech!') // should be a tooltip or an alert
        }
      },
      addLink () {
        if (!this.validLink) 
          return;
        else {
          if (!this.hasHttp.test(this.newLinkUrl))
              this.newLinkUrl = this.newLinkUrl.replace(/^/, 'http://')
          if (this.newPost.links.indexOf(this.newLinkUrl) === -1) {
            this.newPost.links.push({type: this.$refs.NewLinkType.value, url: this.newLinkUrl})
            // reset state
            this.newLinkUrl = ''
            this.newLinkType = 0
            this.$refs.NewLinkType.selectedIndex = 0
          } else {
            console.log('You already added that link!')
          }
        }
      },
      changeLinkType (i) {
        this.newLinkType = i
      }
    }
  }
</script>

<style src="../styles/postModal.css"></style>