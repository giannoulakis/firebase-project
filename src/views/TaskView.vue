<template>
	<div id="popup">
		<div class="modal is-active">
			<div class="modal-background"></div>
			<div class="modal-card">
					<header class="modal-card-head">
						<p class="modal-card-title">Modal title</p>
						<span class="delete" aria-label="close" @click="goBack"></span>
					</header>
					<section class="modal-card-body">
						<div id="form">
								<div class="field">
									<label> Nome</label>
									<span> {{task.name}} </span>
								</div>
								<div class="field">
									<label> Membros</label>
                  <ul>
                    <li v-for="(member, indexMember) in task.members" :key="indexMember">
                      {{member.name}}
                    </li>
                  </ul>
                </div>
								<div class="field">
									<label> Descrição</label>
									<span> {{task.description}}</span>
								</div>
								<div class="field">
									<label> Prazo</label>
									<span> {{task.dateDue}} </span>
								</div>
								<div class="field">
									<label> Finished</label>
									{{task.finished || false}}
								</div>
                <form @submit.prevent="onSubmit">
                  <div class="field">
                    <input class="input" v-model="comment.description">
                    <button class="button is-success" type="submit">Comentar</button>
                  </div>
				        </form>
                <div class="comments" v-for="comment in commentList">
                  <div class="comment">
                    {{comment.dateCreated}}
                    {{comment.description}}
                  </div>
                </div>
						</div>
					</section>
					<footer class="modal-card-foot">
						<button class="button is-success" type="submit">Salvar</button>
						<a href="#" @click.prevent="goBack" class="button">Cancelar</a>
					</footer>
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
        comments: [],
      },
      comment: {
        description: '',
      },
			members: [],
      db: null,
      snapshotComments: null,
		}
  },
  computed: {
    userId() {
      return this.$store.getters.userId;
    },
    commentList() {
      return this.task.comments.sort((a,b)=>{ return a.dateCreated > b.dateCreated? 1: -1 })
    },
  },
  methods:{
    onSubmit(){
      const commentsRef = this.db.collection('projects').doc(this.id).collection('tasks').doc(this.taskId).collection('comments');

			let q;
      this.comment.dateCreated = new Date().getTime();
      this.comment.member = this.userId;
      q = commentsRef.add(this.comment);

			q.then(() => {
        console.log("SAVE");
        this.comment = {description: ''};
        // this.$router.push({name:'projectView', params: {id: this.id}});
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
          this.task = { id:doc.id, comments: [], ...doc.data() };
          const commentsRef = this.db.collection(`projects/${this.id}/tasks/${this.taskId}/comments`);
					this.snapshotComments = commentsRef.onSnapshot(querySnapshot => {
						this.task.comments = [];
						querySnapshot.forEach(register => {
							let comment = { id:register.id, taskId: this.task.id, ...register.data() };
							// task.members = this.$store.getters.getUsersById(task.members);
							this.task.comments.push(comment);
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
	beforeDestroy() {
		if(this.snapshotComments) this.snapshotComments();
	},
}
</script>
