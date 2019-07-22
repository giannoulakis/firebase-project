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
      <td>{{ task.totalTime }}</td>
      <td>{{ task.dateDue }}</td>
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
      let tasks = [];
      let arr = [];
      const db = firebase.firestore();
      const tasksRef = db.collectionGroup('tasks');
      let query = tasksRef.where('members','array-contains',this.userId)
      query.onSnapshot(querySnapshot => {
        querySnapshot.forEach(register => {
          let task = register.data();
          console.log(task);
          task.id = register.id;


          let projectRef = register.ref.parent.parent;
          task.projectId = projectRef.id;
          let promiseProject = projectRef.get().then(register => {
            let project = register.data();
            task.projectName = project.name;
            //task.projectId = register.id;
            console.log('project Name set')
          });

          let totalTime = 0;
          let promiseTime = register.ref.collection(`times`).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              let time = doc.data();
              if(time.dateEnd){
                var duration = new Date(time.dateEnd).getTime() - new Date(time.dateStart).getTime();
                totalTime += duration/1000;
              }
            });
            task.totalTime = helpers.formatDuration(totalTime);
          });

          Promise.all([promiseProject,promiseTime]).then(() => {
            tasks.push(task);
          });


        });

        //tasks.sort((a,b)=>{ })
        this.tasks = tasks;

  //      Promise.all(arr).then(res=>{
//
  //      })


      });

    }
  },
	mounted() {
		this.getList();
	},
}
</script>
