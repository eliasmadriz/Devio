<template>
  <div>
    <div class="container-fluid page-content landing-section">
      <div class="row">
        <div class="col-md-5">
          <div class="welcome-text">
            <h3>Aprende a codificar con otros desarrolladores</h3>
            <p>Devio es el mejor lugar para compartir noticias, artículos, tutoriales e información sobre desarrollo de software.</p>
          </div>
          <div class="illustration col-sm-8 offset-sm-2 col-md-12 offset-md-0">
          </div>
        </div>
    
        <!-- Auth card -->
        <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-1 col-xl-5 offset-xl-2">
          <auth-card></auth-card>
        </div>
      </div>
    </div>
    
    <!-- Techs -->
    <section class="container-fluid secondary">
      <div class="content-card">
        <h3 class="mb-3 section-title">Tecnologías Populares</h3>
        <div class="swiper-section">
          <swiper :options="swiperOptions" ref="mySwiper" class="popular techs">
            <swiper-slide v-for="(tech, index) in popularTechs" :key="tech.name">
              <tech-card :info="tech"></tech-card>
            </swiper-slide>

            <div class="swiper-pagination"   slot="pagination"></div>
          </swiper>
        </div>
        
        <a href="">Ver todas ></a>
      </div>      
    </section>
    
    <!-- Posts -->
    <section class="container-fluid secondary">
      <div class="content-card">
        <h3 class="mb-3 section-title">Publicaciones Destacadas</h3>
        <div class="swiper-section">
          <swiper :options="swiperOptions" ref="mySwiper" class="popular posts">
            <swiper-slide v-for="post in trendingPosts" :key="post.id">
              <post-card :post="post" :showAuthor="true"></post-card>
            </swiper-slide>
            
            <div class="swiper-pagination"   slot="pagination"></div>           
          </swiper>
        </div>
        
        <a href="">Ver todas ></a>        
      </div>      
    </section>
       
    <!-- Users -->
    <section class="container-fluid secondary">
      <div class="content-card">
        <h3 class="mb-3 section-title">Usuarios Destacados</h3>
        <div class="swiper-section">
          <swiper :options="swiperOptions" ref="mySwiper" class="popular users">
            <swiper-slide v-for="user in trendingUsers" :key="user.id">
              <user-card :user="user"></user-card>
            </swiper-slide>

            <div class="swiper-pagination"   slot="pagination"></div>
          </swiper>
        </div>
        
        <a href="">Ver todas ></a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {      
      swiperOptions: {
        centeredSlides: true,
        roundLengths: true,
        slidesPerView: 'auto',
        spaceBetween: 48,
        threshold: 8,
        breakpoints: {
          400: {
            autoHeight: true
          }
        },
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true,
          clickable: true
        },
        mousewheel: {
          forceToAxis: true,
          invert: true
        }
      },
      popularTechs: this.$store.getters.popularTechs,
      trendingPosts: this.$store.getters.trendingPosts,
      trendingUsers: this.$store.getters.trendingUsers
    }
  },
	beforeMount() {    
		// Makes sure that the body has the class that provides the home screen its own particular styles
    document.querySelector('body').classList.add('home')
	},
	beforeDestroy() {
		document.querySelector('body').classList.remove('home')
	},
	mounted() { 
    document.querySelector('body').classList.add('home')
    if (document.documentElement.scrollTop === 0)
    document.querySelector('nav').classList.remove('shady')
	}
}
</script>

<style src="../styles/home.css"></style>
