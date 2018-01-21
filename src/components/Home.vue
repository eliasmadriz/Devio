<template>
  <dashboard v-if="loggedUserId !== undefined"></dashboard>

  <landing v-else></landing>
</template>

<script>
  export default {
    computed: {
      loggedUserId () {
        return this.$store.state.loggedUserId
      }
    },
    watch: {
      loggedUserId (value) {
        if (value !== null && value !== undefined)
        this.$router.push('/')
      }
    }
  }
</script>
