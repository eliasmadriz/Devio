<template>
  <img :src="source" class="avatar">
</template>

<script>
  export default {
    props: ['src'],
    computed: {
      source () {
        return this.src ? this.src : '/static/avatar/default.svg'
      }
    }
  }
</script>