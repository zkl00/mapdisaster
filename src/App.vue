<template>
  <div id="app">
    <router-view/>
    <Home/>
  </div>
</template>

<script>
import Home from './views/Home'
export default {
  components: {
    Home
  }
}
</script>

<style lang="scss">
#app{
  height: 100%;
  width: 100%;
}
</style>
