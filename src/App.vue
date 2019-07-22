<template>
  <div id="app">
    <div class="container">
      <div v-if="!isLoading">
        <div id="nav">
          <router-link :to="{name: 'home'}">Home</router-link> |
          <router-link :to="{name: 'about'}">About</router-link> |
          <router-link :to="{name: 'projects'}">Projects</router-link> |
          <router-link :to="{name: 'myTasks'}">My Tasks</router-link> |
          <router-link :to="{name: 'signup'}">Sign Up</router-link> |
          <a href="#" v-if="isAuthenticated" @click.prevent="logout">Logout</a>
          <running-timer />
        </div>
        <router-view/>
      </div>
      <div v-else>
        Carregando...
      </div>
      <router-view name="popup" :key="$route.fullPath"/>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
/* eslint-disable no-console */

import runningTimer from '@/components/RunningTimer';

export default {
  components:{
    runningTimer
  },
  data() {
    return {}
  },
  computed:{
    isAuthenticated(){
      return this.$store.state.isAuthenticated
    },
    isLoading(){
      return this.$store.state.isLoading
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('userSignOut');
    }
  },

}
</script>