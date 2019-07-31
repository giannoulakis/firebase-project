<template>
  <div>
    <router-link tag="button" :to="{name:'projectForm'}">Adicionar</router-link>

<table class="table is-hoverable is-striped">
  <thead>
    <tr>
      <th>Projeto</th>
      <th>Início</th>
      <th>Conclusão</th>
      <th>Tempo total</th>
      <th>Membros</th>
      <th>Tarefas</th>
      <th colspan="3">Acoes</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(project, index) in listProjects" :key="index">
      <td>{{ project.name }}</td>
      <td>{{ project.dateStart }}</td>
      <td>{{ project.dateEnd }}</td>
      <td>{{ project.totalTime }}</td>
      <td><span v-for="(member, indexMember) in project.members" :key="indexMember">{{ member.name }}, </span></td>
      <td>{{ project.finishedTasks }}/{{ project.totalTasks }}</td>
      <td><router-link :to="{name:'projectView', params: {id: project.id}}">Visualizar</router-link></td>
    	<td><router-link :to="{name:'projectForm', params: {id: project.id}}">Editar</router-link></td>
    	<td><a href="#" @click.prevent="onDelete(project.id)">Deletar</a></td>
    </tr>
  </tbody>
</table>

  </div>
</template>
<script>
import firebase from '@/firebase'
export default {
	data() {
		return {
			projects: []
		}
	},
	computed: {
		users() {
			return this.$store.state.users;
    },
    listProjects() {
      return this.projects.map(item => {
        item.totalTime = helpers.formatDuration(item.totalTime);
        item.totalTask = (item.totalTask ? item.totalTask : 0);
        item.finishedTask = (item.finishedTask ? item.finishedTask : 0);
        return item;
      })
    }
  },
  methods: {
    onDelete(id) {
      if(!confirm('Deseja deletar mesmo?')) return;
      const db = firebase.firestore();
      db.collection('projects').doc(id).delete().then(()=>{
        alert('deletou');
        this.getList();
      });
    },
    
    getList(){
      this.projects = [];
      const db = firebase.firestore();
      const projectRef = db.collection('projects');
      projectRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let auxObject = { id:doc.id, ...doc.data() };
          auxObject.members = auxObject.members.map(memberId => {
            return this.users.reduce( (carry, user) => {
              if(user.id == memberId) {
                carry = user;
              }
              return carry;
            }, null);
          });
          this.projects.push(auxObject);
        });
      }).catch(function(error){
        console.log("Error getting documents: ", error);
      });
    }
  },
	mounted() {
		this.getList();
	},
}
</script>
