<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <user-list></user-list>
  </div>
</template>

<script>
// @ is an alias to /src
import UserList from '@/components/UserList.vue'

export default {
  name: 'home',
  components: {
    UserList
  }
}
</script>