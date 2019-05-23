<template>
	<div id="form">
		<div class="field">
			<strong> Nome</strong>
			<p>{{project.name}}</p>
		</div>
		<div class="field">
			<strong> Membros</strong>
			<p>
				<template v-for="(member) in members">
					{{member.name}},
				</template>
			</p>
		</div>
		<div class="field">
			<strong> Data inicial</strong>
			<p>{{project.dateStart}}</p>
		</div>
		<div class="field">
			<strong> Data final</strong>
			<p>{{project.dateEnd}}</p>
		</div>
		<router-link :to="{name:'taskNew', params: {id:id}}">Nova Tarefa</router-link>
		<task-list :list="tasks"></task-list>
	</div>
</template>
<script>
import firebase from '@/firebase';
import taskList from '../components/TaskList';
export default {
	props: {
		id: {
			type: String,
			required: false
		}
	},
	components: { taskList },
	data() {
		return {
			project: {
				name: '',
				members: [],
				dateStart: '',
				dateEnd: '',
			},
			tasks: [],
			members: [],
			db: null,
		}
  },
  methods:{
  },
	mounted() {
		this.db = firebase.firestore();
		const usersRef = this.db.collection('users');
		usersRef.get().then(querySnapshot => {
			querySnapshot.forEach(doc => {
				this.members.push({ id:doc.id, ...doc.data() });
			});
		}).catch(function(error){
			console.log("Error getting documents: ", error);
		});

		if(this.id) {
			const projectRef = this.db.collection('projects');
			projectRef.doc(this.id).get().then(doc => {
				if(doc.exists){
					this.project = { id:doc.id, ...doc.data() };
					const taskRef = this.db.collection(`projects/${this.id}/tasks`);
					taskRef.get().then(querySnapshot => {
						querySnapshot.forEach(register => {
							this.tasks.push({ id:register.id, projectId: this.project.id, ...register.data() });
						});
					});

				} else {
					console.log("Registro não encontrado");
				}
			}).catch(function(error){
				console.log("Error getting documents: ", error);
			});
		}
	},
}
</script>
