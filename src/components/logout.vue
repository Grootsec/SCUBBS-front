<template>

</template>

<script>
  export default {
    name: "logout",
    mounted(){
      this.$http.get('/api/v1/logout').then(function(){
        this.$router.push("/")
      })
    }
  }
</script>

<style scoped>

</style>
