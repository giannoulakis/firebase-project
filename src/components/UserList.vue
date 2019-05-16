<template>
  <div>
    <h1> User id: {{ userId }}</h1>
<ul>
  <li v-for="user in users">{{ user.id }} - {{ user.email }}</li>
</ul>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'UserList',
  data() {
    return {
      users: []
    }
  },
  computed: {
    userId(){
      return this.$store.getters.userId
    }
  },
  mounted(){
    let db = firebase.firestore();
    let usersRef = db.collection('users');
    usersRef.get().then(querySnapshot => {
      console.log(querySnapshot);
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        this.users.push({ id:doc.id, ...doc.data() });
      });
    }).catch(function(error){
      console.log("Error getting documents: ", error);
    });
  }
}

</script>

