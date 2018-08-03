<template>
  <div>
        <Content :style="{padding: '0 50px'}">
            <div>消息......</div>
            <slot></slot>
        </Content>
  </div>
</template>

<script>
  import headers from './header/headers'
  export default {
    name: "content",
    component:{
      headers
    },
    mounted(){

    }
  }
</script>

<style scoped>

</style>
