<template>
	<div class="card">
		<header class="card-header">
			<p class="card-header-title">Comentários</p>
		</header>
		<div class="card-content">
			<div class="content">
				<form @submit.prevent="onSubmit">
					<div class="field has-addons">
						<div class="control">
							<input class="input" type="text" v-model="item.description">
						</div>
						<div class="control">
							<button type="submit" class="button is-success">Enviar</button>
						</div>
					</div>
				</form>
				<div v-for="item in comments">
					<comment-item :item="item" :projectId="projectId" :taskId="taskId" />
				</div>

			</div>
		</div>
	</div>


</template>


<script>
	import firebase from '@/firebase';
	import commentItem from '../components/CommentItem';
	export default {
		props: ['comments', 'projectId', 'taskId'],
		components:{
			commentItem
		},
		data() {
			return {
				db: null,
				item: {
					description: '',
				},
			}
		},
		computed: {
			userId() {
				return this.$store.getters.userId;
			},
		},
		methods: {
			onSubmit(){
				const commentsRef = this.db.collection('projects').doc(this.projectId).collection('tasks').doc(this.taskId).collection('comments');

				this.item.dateCreated = helpers.getCurrentDateTime();
				this.item.member = this.userId;

				commentsRef.add(this.item).then(() => {
					console.log("SAVE");
				}).catch(function(error) {
					console.error("Error adding document: ", error);
				});
				this.item = {description: ''};
			},

		},
		mounted() {
			this.db = firebase.firestore();
		}
	}
</script>