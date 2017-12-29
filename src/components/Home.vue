<template>
  <dashboard v-if="loggedUserId !== undefined"></dashboard>

  <landing v-else></landing>
</template>

<script>
  export default {
    data () {
      return {
        loggedUserId: this.$store.state.loggedUserId
      }
    }
  }
</script>
