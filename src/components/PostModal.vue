<template>
  <div v-if="$store.state.loggedUserId !== undefined">
    <b-modal id="EditPostModal" ref="EditPostModal" no-close-on-backdrop no-close-on-esc @show="initializePost">
      <div slot="modal-header">
        <div class="first-row">
          <button class="button outlined secondary" @click="hideEditPostModal">
            <img src="/static/icons/cancel-black.png"  class="icon prev">
            <span>Cancelar</span>
          </button>
          <h4 class="modal-title d-none d-md-block">Nueva Publicación</h4>
          <button class="button filled primary" @click="commitPost" :disabled="committing">
            <transition name="fade" mode="out-in">
              <span v-if="!committing" key="text"><span>Publicar</span><img src="/static/icons/megaphone.png" class="icon post"></span>
              <loading-spinner v-else key="spinner"></loading-spinner>
            </transition>
          </button>
        </div>
        <message :config="message" type="general"></message>
      </div>
           
      <h4 class="title d-md-none mb-4">Nueva publicación</h4>

      <div class="columns-wrapper">
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
            <div class="form-line-flex">
              <vue-awesomplete :setting="{ list: techsNames, minChars: 2, autoFirst: true}" class="field" v-model="newTechName" ref="NewTechField"></vue-awesomplete>
              <button class="button outlined primary field-button" @click="addTech(techIndexInList)">
                <img src="/static/icons/plus.png" >
              </button>
            </div>
            <message :config="message" type="tech"></message>
          </div>
          
          <div class="form-line">
            <h5 class="label">Añadir enlace</h5>
            <div class="link-url form-line-flex">
              <input type="text" class="field" placeholder="Dirección" v-model="newLinkUrl" @click="message.show = false">
              <div class="link-types">
                <select required name="type" id="link-type" 
                      ref="NewLinkType" 
                      @change="changeLinkType($refs.NewLinkType.selectedIndex)">
                  <option value="null" selected disabled>Tipo</option>
                  <option value="article">Artículo</option>
                  <option value="video">Video</option>
                  <option value="project">Proyecto</option>
                  <option value="book">Libro</option>
                  <option value="other">Otro</option>
                </select>
                <img src="/static/icons/chevron-down.png"  class="arrow">
              </div>
            </div>

            <div class="form-line-flex">
              <button class="button outlined primary" 
                    @click="addLink">Añadir enlace</button>
            </div>

            <message :config="message" type="link"></message>
          </div>
        </div>

        <div class="right-column">
          <div class="techs form-line">
            <h5 class="label">Tecnologías</h5>
            <div class="tech-list">
              <div class="list-entry" v-for="(tech, i) in newPost.techs" :key="i">
                <img :src='$store.getters.getTechInfo(tech).logo' class="entry-icon">
                <span class="entry-title">{{ $store.getters.getTechInfo(tech).name }}</span>
                <button class="remove-entry button outlined secondary" @click="deleteEntry('techs', i)"><img src="/static/icons/cancel-black.png"></button>
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
                <img :src='"/static/icons/" + link.type + ".png"'  class="entry-icon">
                <a class="entry-title" :href="link.url" target="_blank">{{ link.url }}</a>
                <button class="remove-entry button outlined secondary" @click="deleteEntry('links', i)"><img src="/static/icons/cancel-black.png"></button>
              </div>
              <div class="empty-list" v-if="!newPost.links.length">
                <span>Aún no has agregado ningún enlace.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer"></div>
    </b-modal>

    <b-modal id="DeletePostModal" ref="DeletePostModal" no-close-on-backdrop no-close-on-esc>
      <div slot="modal-header">
        <div class="first-row">
          <button class="button outlined secondary" @click="hideDeletePostModal"><img src="/static/icons/cancel-black.png" class="icon prev"><span>No</span></button>

          <h4 class="modal-title">¿Eliminar?</h4>

          <button class="button filled danger" @click="DeletePost"><span>Sí</span><img src="/static/icons/trash-white.png" class="icon post"></button>
        </div>
      </div>
      
      <post-card :post="erasingPostComputed" :showAuthor="false" :erasing="true" v-if="newPost.id"></post-card>

      <div class="modal-footer"></div>
    </b-modal>

    <!--
    <div class="custom-modal alert-modal confirm-close-modal" v-if="confirmClosePrompt">
      // Modal content
      <div class="custom-modal-body">
        <div class="custom-modal-header">
          <h5 class="modal-title">¿Descartar los cambios?</h5>
        </div>

        <p>Si no guarda los cambios en su perfil, éstos se perderán. ¿Desea dejar de editar y descartar los cambios?</p>
        
        <div class="custom-modal-body-buttons">
          <button class="button outlined secondary" @click="discardAndClose">
            <span>Salir y descartar</span>
          </button>
          <button class="button filled primary" @click="confirmClosePrompt = false">
            <span>Seguir editando</span>
          </button>
        </div>
      </div>
    </div>
    -->
    
  </div>
</template>

<script>
  export default {
    mounted () {
      const _this = this
      this.$root.$on('EditPost', function (post) {
        _this.newPost = post
      })
      this.$root.$on('DeletePost', function (post) {
        _this.newPost = post
      })
    },
    data () {
      return {
        newPost: {
          title: '',
          description: '',
          techs: [],
          links: [],
          language: "spanish"
        },
        newTechName: '',
        newLinkUrl: '',
        newLinkType: 0,
        urlValidator: /\.+/,
        hasHttp: /^(http)+(s)?(:\/\/)+/i,
        message: {
          show: false,
          text: '',
          type: '',
          variant: ''
        },
        initialPost: {},
        committing: false
      }
    },
    computed: {
      erasingPostComputed () {
        return this.newPost
      },
      techIndexInList () {
        return this.techsNames.indexOf(this.newTechName.toLowerCase())
      },
      techsNames () {
        return this.$store.state.techsNames
      }
    },
    methods: {
      restartPost() {
        this.newPost = {
          title: '',
          description: '',
          techs: [],
          links: [],
          language: "spanish"
        }
      },
      initializePost () {
        let _this = this
        this.initialPost.title = this.newPost.title
        this.initialPost.description = this.newPost.description
        this.initialPost.techs = []
        this.initialPost.links = []
        for (let tech in this.newPost.techs) {
          this.initialPost.techs.push(_this.newPost.techs[tech])
        }
        for (let link in this.newPost.links) {        
          this.initialPost.links.push({type: _this.newPost.links[link].type, url: _this.newPost.links[link].url})
        }
      },
      commitPost () {
        this.message.show = false
        if (this.newPost.title === '')
          this.showMessage('Debes colocarle un título a la publicación', 'general')
        else if (this.newPost.description === '')
          this.showMessage('Debes colocarle una descripción a la publicación', 'general')
        else if (this.newPost.techs.length === 0)
          this.showMessage('La publicación debe contener al menos una tecnología', 'general')
        else if (this.newPost.links.length === 0)
          this.showMessage('La publicación debe contener al menos un enlace', 'general')
        else {
          this.committing = true
          this.newPost.creationDate = this.newPost.creationDate || new Date().toISOString()
          this.$store.dispatch('createPost', this.newPost).then(() => {
            this.hideEditPostModal()
          })
          .catch((error) => {
            console.log(error)
          })
        }
      },
      DeletePost () {
        this.$store.dispatch('DeletePost', {...this.erasingPostComputed}).then(() => {
          this.hideDeletePostModal()
        }).catch((error) => {
          console.log(error)
        })
      },
      hideEditPostModal () {
        this.$refs.EditPostModal.hide()
        this.restartPost()
        this.committing = false
      },
      hideDeletePostModal () {
        this.$refs.DeletePostModal.hide()
        this.restartPost()
      },
      discardAndClose () {
        this.hideEditPostModal()
      },
      deleteEntry (arr, i) {
        this.newPost[arr].splice(i, 1)
      },
      addTech (i) {
        this.message.show = false
        if (this.techIndexInList === -1) {
          this.showMessage('Hmm... no conocemos esa tecnología.', 'tech')
        } else {
          let techID = undefined;
          for (let key in this.$store.state.techs) {
            if (this.$store.state.techs[key].name.toLowerCase() === this.newTechName.toLowerCase()) {
              techID = key
              break
            }
          }
          if (this.newPost.techs.indexOf(techID) === -1) {
            this.$refs.NewTechField.clear()
            this.newPost.techs.push(techID)
          } else
            this.showMessage('Ya agregaste esa tecnología', 'tech')
        }
      },
      addLink () {
        this.message.show = false
        if (this.newLinkUrl === '')
          this.showMessage('La dirección del enlace no puede estar vacía', 'link')
        else if (!this.urlValidator.test(this.newLinkUrl))
          this.showMessage('En enlace que has ingresado es inválido', 'link', 'danger')
        else if (this.newLinkType === 0)
          this.showMessage('Debes seleccionar un tipo de enlace', 'link')
        else {
          if (!this.hasHttp.test(this.newLinkUrl)) {
            this.newLinkUrl = this.newLinkUrl.replace(/^/, 'http://')
          }
          
          let _this = this
          
          if (this.newPost.links.findIndex(function (obj) {return obj.url === _this.newLinkUrl}) === -1) {
            this.newPost.links.push({type: this.$refs.NewLinkType.value, url: this.newLinkUrl})
            // reset state
            this.newLinkUrl = ''
            this.newLinkType = 0
            this.$refs.NewLinkType.selectedIndex = 0
          } else
            this.showMessage('Ya agregaste ese enlace', 'link')
        }
      },
      changeLinkType (i) {
        this.newLinkType = i
      },
      showMessage (text, type, variant) {
        this.message.text = text
        this.message.type = type
        this.message.variant = variant || 'info'
        this.message.show = true
      }
    }
  }
</script>

<style src="../styles/postModal.css"></style>