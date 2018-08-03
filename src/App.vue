<template>
<div id="app">
  <transition name="fade">
    <router-view/>
  </transition>
</div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.ivu-avatar {
  margin-right: 0.5rem;
}
</style>
