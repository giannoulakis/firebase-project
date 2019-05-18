<template>
  <div>
    <h1> User id: {{ userId }}</h1>
<ul>
  <li v-for="(user, index) in users" :key="index">{{ user.id }} - {{ user.email }}</li>
</ul>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'UserList',
  data() {
    return {
    }
  },
  computed: {
    userId(){
      return this.$store.getters.userId
    },
    users() {
      return this.$store.state.users
    }
  },
  mounted(){
  }
}

</script>
