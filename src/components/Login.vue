<template>
  <div class="page-content">
		<!-- Auth card -->
		<div class="col-10 offset-1">
			<auth-card card="login"></auth-card>
		</div>
	</div>
</template>

<script>
	export default {
		beforeMount () {
			if (this.$store.state.loggedUserId !== undefined)
				this.$router.push('/')
		}
	}
</script>