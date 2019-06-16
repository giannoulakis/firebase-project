<template>
	<div id="popup">
		<div class="modal is-active">
			<div class="modal-background"></div>
			<div class="modal-card">
				<form @submit.prevent="onSubmit">
					<header class="modal-card-head">
						<p class="modal-card-title">Modal title</p>
						<span class="delete" aria-label="close" @click="goBack"></span>
					</header>
					<section class="modal-card-body">
						<div id="form">
								<div class="field">
									<label> Nome</label>
									<input v-model="task.name">
								</div>
								<div class="field">
									<label> Membros</label>
									<select v-model="task.members" multiple>
										<option v-for="(member, index) in members" :key="index" :value="member.id">
											{{member.name}}
										</option>
									</select>
								</div>
								<div class="field">
									<label> Descrição</label>
									<textarea v-model="task.description"></textarea>
								</div>
								<div class="field">
									<label> Prazo</label>
									<input v-model="task.dateDue" type="date">
								</div>
								<div class="field">
									<label> Finished</label>
									<input type="checkbox" v-model="task.finished">
								</div>
						</div>
					</section>
					<footer class="modal-card-foot">
						<button class="button is-success" type="submit">Salvar</button>
						<a href="#" @click.prevent="goBack" class="button">Cancelar</a>
					</footer>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
import firebase from '@/firebase'
export default {
	props: {
		id: {
			type: String,
			required: false
		},
		taskId: {
			type: String,
			required: false
		},
	},
	data() {
		return {
			task: {
				name: '',
				members: [],
				dateDue: '',
			},
			members: [],
			db: null,
		}
  },
  methods:{
    onSubmit(){
      const taskRef = this.db.collection('projects').doc(this.id).collection('tasks');

      // const q = projectRef.doc(this.id).update({
      //   tasks: firebase.firestore.FieldValue.arrayUnion(this.task)
      //   }).then(() => {
			let q;
      if(this.taskId) {
        q = taskRef.doc(this.taskId).set(this.task);
      } else {
        q = taskRef.add(this.task);
      }

			q.then(() => {
				console.log("SAVE");
        this.$router.push({name:'projectView', params: {id: this.id}});
      }).catch(function(error) {
        console.error("Error adding document: ", error);
      });
		},
		goBack() {
			this.$router.push({name:'projectView', params: {id:this.id}});
		}
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



		if(this.taskId) {
			this.db.doc(`projects/${this.id}/tasks/${this.taskId}`).get().then(doc => {
				if(doc.exists){
					this.task = { id:doc.id, ...doc.data() };
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
