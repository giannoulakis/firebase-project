<template>
	<div id="form">
		<form @submit.prevent="onSubmit">
			<div class="field">
				<label> Nome</label>
				<input v-model="project.name">
			</div>
			<div class="field">
				<label> Membros</label>
				<select v-model="project.members" multiple>
					<option v-for="(member, index) in members" :key="index" :value="member.id">
						{{member.name}}
					</option>
				</select>
			</div>
			<div class="field">
				<label> Data inicial</label>
				<input v-model="project.dateStart" type="date">
			</div>
			<div class="field">
				<label> Data final</label>
				<input v-model="project.dateEnd" type="date">
			</div>
			<input value="Salvar" type="submit" />
		</form>
	</div>
</template>
<script>
import firebase from '@/firebase'
export default {
	props: {
		id: {
			type: String,
			required: false
		}
	},
	data() {
		return {
			project: {
				name: '',
				members: [],
				dateStart: '',
				dateEnd: '',
			},
			members: [],
			db: null,
		}
  },
  methods:{
    onSubmit(){
      const projectRef = this.db.collection('projects');
      let q;
      if(this.id) {
        q = projectRef.doc(this.id).set(this.project);
      } else {
        q = projectRef.add(this.project);
      }
      q.then(() => {
        console.log("SAVE");
        this.$router.push({name:'projects'});
      }).catch(function(error) {
        console.error("Error adding document: ", error);
      });
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

		if(this.id) {
			const projectRef = this.db.collection('projects');
			projectRef.doc(this.id).get().then(doc => {
				if(doc.exists){
					this.project = { id:doc.id, ...doc.data() };
				} else {
					console.log("Registro não encontrado");
				}
			}).catch(function(error){
				console.log("Error getting documents: ", error);
			});
		}
	},
}
// projects: {
//     name: "...",
//     members: [<users>],
//     dateStart: "...",
//     dateEnd: "...",
//     tasks: {
//         name: "...",
//         description: "...",
//         dateDue: "...",
//         members: [<users>],
//         finished: true/false,
//         checklist: [{
//             finished: true/false,
//             description:"..."
//         }],
//         comments: [ {
//             dateCreated:"...",
//             description:"...",
//             member: <users>,
//         } ],
//         times: [ {
//             dateStart: "...",
//             dateEnd: "...",
//             member: <users>,
//         } ]
//     }
// }
</script>
