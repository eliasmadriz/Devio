<template>
  <b-modal id="EditProfileModal" ref="EditProfileModal" no-close-on-backdrop no-close-on-esc v-if="newProfile.id !== ''" @show="initializeProfile">
    <div slot="modal-header">
      <div class="first-row">
        <button class="button outlined secondary" @click="discardAndClose">
          <img src="/static/icons/cancel-black.png"  class="icon prev">
          <span>Cancelar</span>
        </button>
        <h4 class="modal-title d-none d-md-block">Editar Perfil</h4>
        <button class="button filled primary" @click="saveProfileChanges" :disabled="committing">
          <transition name="fade" mode="out-in">
            <span v-if="!committing" key="text"><span>Guardar</span><img src="/static/icons/checkmark-white.png" class="icon post" key="save"></span>
            <loading-spinner v-else key="spinner"></loading-spinner>
          </transition>
        </button>
      </div>

      <message :config="message" type="general"></message>
    </div>
    <div class="columns-wrapper">
      <div class="left-column">
        <!-- Avatar -->
        <message :config="message" type="avatar">
          <button class="button filled primary message-button" @click="undoAvatarDeletion">Deshacer</button>
        </message>

        <div class="form-line avatar">
          <h5 class="label">Avatar</h5>
          <avatar :src="newProfile.avatar"></avatar>

          <button class="button filled primary" @click="pickImage">
            <span>Subir</span>
            <img src="/static/icons/upload-white.png" class="icon post">
          </button>
          <input type="file" accept="image/*" class="d-none" ref="ImagePicker" @change="editAvatar">

          <button class="button outlined" 
                @click="deleteAvatar" 
                :disabled="this.newProfile.avatar === undefined" 
                :class="{'disabled': this.newProfile.avatar === undefined, 'secondary': this.newProfile.avatar !== undefined}">
            <span>Eliminar</span>
            <img src="/static/icons/cancel-black.png" class="icon post">
          </button>
        </div>

        <div class="form-line">
          <h5 class="label">Nombre completo</h5>
          <input type="text" spellcheck="false" class="field" v-model="newProfile.publicName">
        </div>

        <div class="form-line">
          <h5 class="label">Nombre de usuario</h5>
          <input type="text" spellcheck="false" class="field" v-model="newProfile.username">
        </div>
        <message :config="message" type="link"></message>

        <div class="form-line">
          <h5 class="label">Biografía</h5>
          <textarea class="field" rows="5" v-model="newProfile.bio"></textarea>
        </div>

        <div class="form-line">
          <h5 class="label">Sitio Web</h5>
          <input type="text" spellcheck="false" class="field" v-model="newProfile.website" @click="message.show = false">
          <message :config="message" type="website"></message>
        </div>
      </div>

      <div class="right-column">
        <div class="form-line">
          <h5 class="label">Añadir tecnología</h5>
          <div class="form-line-flex">
            <vue-awesomplete :setting="{ list: techsNames, minChars: 2, autoFirst: true}" class="field" ref="NewTechField" v-model="newTechName"></vue-awesomplete>
            <button class="button outlined primary field-button" @click="addTech(techIndexInList)">
              <img src="/static/icons/plus.png">
            </button>
          </div>
          <message :config="message" type="tech"></message>
        </div>

        <div class="techs form-line">
          <div class="tech-list">
            <div class="list-entry" v-for="(tech, i) in newProfile.favTechs" :key="i">
              <img :src='$store.getters.getTechInfo(tech).logo' class="entry-icon">
              <span class="entry-title">{{ $store.getters.getTechInfo(tech).name }}</span>
              <button class="remove-entry button outlined secondary" @click="deleteEntry('favTechs', i)"><img src="/static/icons/cancel-black.png" ></button>
            </div>
            <div class="empty-list" v-if="!newProfile.favTechs.length">
              <span>Aún no has agregado ninguna tecnología.</span>
            </div>
          </div>
        </div>

        <div class="form-line">
          <h5 class="label">Redes sociales</h5>
          <div class="link-url form-line-flex">
            <div class="link-types">
              <select name="type" 
                    id="link-type" 
                    required 
                    @click="message.show = false"
                    @change="renderSocialLink" 
                    ref="SocialLinkName">
                <option value="null" selected disabled>Sitio</option>
                <option :value="social.name" v-for="social in existingSocialNetworks" :key="social.name">{{ social.name }}</option>
              </select>
              <img src="/static/icons/chevron-down.png"  class="arrow">
            </div>
            <input type="text" 
                  class="field" 
                  placeholder="Dirección" 
                  ref="SocialLinkField" 
                  @click="message.show = false">
            <button class="button outlined primary field-button" @click="applySocialLinkChange">
              <img src="/static/icons/checkmark.png">
            </button>
          </div>

          <message :config="message" type="social"></message>
        </div>
      </div>
    </div>

    <div slot="modal-footer"></div>

    <!-- Edit Avatar Modal -->
    <div class="custom-modal edit-avatar-modal" v-show="editingAvatar">
      <!-- Modal content -->
      <div class="custom-modal-body">
        <div class="custom-modal-header">
          <button class="button outlined secondary modal-left-button" @click="cancelAvatarEdition">
            <img src="/static/icons/cancel-black.png" class="icon prev"><span>Cancelar</span>
          </button>
          <h5 class="modal-title">Editar avatar</h5>
          <button class="button filled primary modal-right-button" @click="setAvatar">
            <span>Guardar</span><img src="/static/icons/checkmark-white.png" class="icon post">
          </button>
        </div>
        
        <message :config="{variant: 'info', permanent: true}">Arrastra la imagen para moverla y usa la rueda del ratón para acercar o alejar la imagen</message>
        <div class="cropper-wrapper">
          <!-- Edit Avatar Canvas -->
          <vue-croppie 
            ref="avatarCropper"
            :enableResize="false"
            :boundary="{width: cropperSize, height: cropperSize}"
            :viewport="{width: cropperSize, height: cropperSize, type: 'circle'}"
            customClass="avatar-cropper"
            @result="setAvatar">
          </vue-croppie>
          <!-- <img :src="cropImage" class="avatar"> -->
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>  
  export default {
    data () {
      return {
        newProfile: {},
        existingSocialNetworks: this.$store.state.social,
        userSocialNetworks: {},
        newTechName: '',
        urlValidator: /\.+/,
        hasHttp: /^(http)+(s)?(:\/\/)+/i,
        message: {
          show: false,
          text: '',
          type: '',
          variant: ''
        },
        committing: false,
        editingAvatar: false,
        newAvatar: '',
        cropperSize: 400
      }
    },
    computed: {
      oldProfile () {
        return this.$store.getters.getUser({userId: this.$store.state.loggedUserId})
      },
      techIndexInList () {
        return this.techsNames.indexOf(this.newTechName.toLowerCase())
      },
      techsNames () {
        return this.$store.state.techsNames
      }
    },
    methods: {
      restartProfile () {
        let newProfile = {
          avatar: this.oldProfile.avatar,
          bio: this.oldProfile.bio,
          favTechs: [],
          publicName: this.oldProfile.publicName,
          socialLinks: [],
          username: this.oldProfile.username,
          website: this.oldProfile.website
        }

        for (let tech in this.oldProfile.favTechs) {
          newProfile.favTechs.push(this.oldProfile.favTechs[tech])
        }

        for (let key in this.oldProfile.socialLinks) {
          this.userSocialNetworks[key] = this.oldProfile.socialLinks[key]
        }

        // Restart the social link selector and url field
        if (this.$refs.SocialLinkField) {
          this.$refs.SocialLinkField.value = ''
          this.$refs.SocialLinkName.value = 'null'
        }

        return newProfile
      },
      discardAndClose () {
        this.message.show = false
        this.$refs.EditProfileModal.hide()
        this.committing = false
      },
      changesAreValid () {
        // Validate the public name
        if (this.newProfile.publicName === '') this.showMessage('El nombre público no puede estar vacío', 'general', 'danger')
        // Validate the website
        else if (this.newProfile.website !== '') {
          if (this.urlValidator.test(this.newProfile.website)) {
            if (!this.hasHttp.test(this.newProfile.website))
              this.newProfile.website.replace(/^/, 'http://')
          } else {
            this.showMessage('La dirección es inválida', 'general', 'danger')
          }
        }
        // Validate the username
        else if (this.newProfile.username === '') {
          this.showMessage('El nombre de usuario no puede estar vacío', 'general', 'danger')
        } else if (this.newProfile.username.match(/[^A-Za-z0-9_]/)) {
          this.showMessage('El nombre de usuario solo puede contener letras, números y guiones bajos (_)', 'general', 'danger')
        }
        // If everything is fine
        else return true
        
        // Otherwise
        return false
      },
      saveProfileChanges () {
        if (!this.changesAreValid()) return;
        this.message.show = false
        this.committing = true
        
        let newFavTechs = []
        for (let tech in this.newProfile.favTechs) {
          newFavTechs.push(this.newProfile.favTechs[tech])
        }

        let _this = this
        function save() {
          return new Promise((resolve, reject) => {
            _this.$store.dispatch('SaveProfile', {
              newProfile: {
                id: _this.oldProfile.id,
                avatar: _this.newProfile.avatar,
                bio: _this.newProfile.bio,
                favTechs: newFavTechs,
                publicName: _this.newProfile.publicName,
                socialLinks: _this.userSocialNetworks,
                username: _this.newProfile.username,
                website: _this.newProfile.website
              }, 
              oldUsername: _this.oldProfile.username
            }).then(() => {
              // Data saved in the database
              resolve()
            }).catch((error) => {
              // There was an error saving data in the database
              _this.showMessage(error.message, 'general', 'danger')
              console.log(error)
              reject(error)
            })
          })
        }

        function commitSave() {
          save().then(() => {
            _this.$router.push('/' + _this.newProfile.username)
            if (_this.$refs.EditProfileModal) _this.discardAndClose()
          }).catch(error => {
            console.log(error)
            _this.committing = false
          })
        }

        if (_this.newProfile.username !== _this.oldProfile.username) {
          _this.$store.dispatch('isUsernameAvailable', _this.newProfile.username).then(() => commitSave()).catch((error) => {
            // Username is taken (or there's a network error)
            console.log(error)
            _this.showMessage('El nombre de usuario no está disponible', 'general', 'danger')
            _this.committing = false
          })
        } else {
          commitSave()
        }
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
          if (this.newProfile.favTechs.indexOf(techID) === -1) {
            this.$refs.NewTechField.clear()
            this.newProfile.favTechs.push(techID)
          } else
            this.showMessage('Ya agregaste esa tecnología', 'tech')
        }
      },
      deleteEntry (arr, i) {
        this.newProfile[arr].splice(i, 1)
      },
      renderSocialLink (event) {
        this.$refs.SocialLinkField.value = ''
        if (this.oldProfile.socialLinks)
          if (this.oldProfile.socialLinks[event.currentTarget.value] !== undefined)
            this.$refs.SocialLinkField.value = this.userSocialNetworks[event.currentTarget.value]
      },
      applySocialLinkChange () {
        if (this.$refs.SocialLinkName.value === 'null')
          return;

        if (this.$refs.SocialLinkField.value === '') {
          // Erase the property from the social links object
          delete this.userSocialNetworks[this.$refs.SocialLinkName.value]
        } else if (this.urlValidator.test(this.$refs.SocialLinkField.value)) {
          let link = this.$refs.SocialLinkField.value
          if (!this.hasHttp.test(link))
            link = link.replace(/^/, 'http://')
          // Apply changes
          this.userSocialNetworks[this.$refs.SocialLinkName.value] = link
        } else {
          this.showMessage('La direción que has ingresado es inválida', 'social', 'danger')
          return;
        }
        this.showMessage('Dirección actualizada', 'social')
      },
      showMessage (text, type, variant) {
        this.message.type = type
        this.message.text = text
        this.message.variant = variant || 'info'
        this.message.show = true
      },
      pickImage () {
        this.$refs.ImagePicker.click()
      },
      cancelAvatarEdition () {
        this.editingAvatar = false
        this.newProfile.avatar = this.oldProfile.avatar
        this.$refs.avatarCropper.bind({url: ''})
        this.$refs.ImagePicker.value = ""
      },
      editAvatar (event) {
        this.editingAvatar = true
        let input = event.target
        let image = event.target.files
        if (image.length === 0) {
          this.editingAvatar = false
          return;
        }
        let filename = image[0].name
        if (filename.lastIndexOf('.') === -1) {
          return;
        }
        var fileReader = new FileReader()
        fileReader.onload = e => {
          this.$refs.avatarCropper.bind({url: e.target.result})
        }
        fileReader.readAsDataURL(event.target.files[0])
      },
      setAvatar (newAvatar) {
        let options = {
          format: 'jpeg',
          circle: true
        }
        this.$refs.avatarCropper.result(options, (newAvatar) => {
          this.newAvatar = newAvatar
          this.newProfile.avatar = newAvatar
        })
        this.editingAvatar = false
      },
      deleteAvatar () {
        if (this.newProfile.avatar !== '') {
          this.newProfile.avatar = ''
          this.showMessage('Has eliminado tu avatar', 'avatar', 'info')
        }
      },
      undoAvatarDeletion () {
        this.newProfile.avatar = this.newAvatar
        this.message.show = false
      },
      initializeProfile () {
        this.newProfile = this.restartProfile()
        let socialLinksNumber = this.oldProfile.socialLinks ? this.oldProfile.socialLinks.length : []
        for (let i = 0; i < socialLinksNumber; i++) {
          this.userSocialNetworks[this.oldProfile.socialLinks[i].name] = this.oldProfile.socialLinks[i].url
        }
      }
    },
    created () {
      this.newProfile = this.restartProfile()
      if (window.innerWidth > 0) {
        if (window.innerWidth <= 520) {
          this.cropperSize = window.innerWidth - 40
        } else {
          this.cropperSize = 400
        }
      } else {
        this.cropperSize = screen.width - 40
      }
    }
  }
</script>