<template>
  <div>
<!--     <router-link tag="button" :to="{name:'projectForm'}">Adicionar</router-link> -->

<table>
  <thead>
    <tr>
      <th>Projeto</th>
      <th>Tarefa</th>
      <!-- <th>Membros</th> -->
      <th>Prazo</th>
      <th>Tempo Total</th>
      <th>Finalizado</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(task, index) in tasks" :key="index">
      <td>{{ task.projectName }}</td>
      <td>{{ task.name }}</td>
<!--       <td><span v-for="(member, indexMember) in task.members" :key="indexMember">{{ member.name }}, </span></td> -->
      <td>{{ task.dateDue }}</td>
      <td>{{ task.totalTime }}</td>
      <td>{{ task.finished || false }}</td>
      <td><router-link :to="{name:'myTaskView', params: {id: task.projectId, taskId: task.id}}">Visualizar</router-link></td>
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
			tasks: []
		}
	},
	computed: {
    userId() {
      return this.$store.getters.userId;
    },
		users() {
			return this.$store.state.users;
		}
  },
  methods: {
    getList(){
      let arr = [];
      const db = firebase.firestore();
      const tasksRef = db.collectionGroup('tasks');
      let query = tasksRef.where('members','array-contains',this.userId)
      query.onSnapshot(querySnapshot => {
        this.tasks = [];
        querySnapshot.forEach(register => {
          let task = register.data();
          task.id = register.id;
          task.totalTime = helpers.formatDuration(task.totalTime);


          let projectRef = register.ref.parent.parent;
          task.projectId = projectRef.id;
          let promiseProject = projectRef.get().then(register => {
            let project = register.data();
            task.projectName = project.name;
            this.tasks.push(task);
          });


          // Promise.all([promiseProject,promiseTime]).then(() => {
          // });


        });

        //tasks.sort((a,b)=>{ })
        // this.tasks = tasks;
      });

    }
  },
	mounted() {
		this.getList();
	},
}
</script>
