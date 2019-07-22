<template>
	<div class="card">
		<header class="card-header">
			<p class="card-header-title">Tempos</p>
		</header>
		<div class="card-content">
			<div class="content">
				<div class="field has-addons">
					<div class="control">
						<button @click="onStart" v-if="!runningTimer.timerId" class="button is-success">Iniciar</button>
					</div>
				</div>
				<hr />
				<div v-for="item in times">
					<time-item :item="item" :projectId="projectId" :taskId="taskId" />

				</div>
			</div>
		</div>
	</div>


</template>


<script>
	import firebase from '@/firebase';
	import timeItem from '../components/TimeItem';
	export default {
		props: ['times', 'projectId', 'taskId'],
		components:{
			 timeItem
		},
		data() {
			return {
				db: null,
				// item: {
				// 	description: '',
				// },
			}
		},
		computed: {
			userId() {
				return this.$store.getters.userId;
			},
			runningTimer() {
				return this.$store.state.runningTimer;
			},
		},
		methods: {
			onStart(){
				const taskRef = this.db.collection('projects').doc(this.projectId).collection('tasks').doc(this.taskId);

				const timesRef = taskRef.collection('times');

				let taskDescription = '';
				taskRef.get().then(doc => {
					if(doc.exists){
						taskDescription = doc.data().description;
					}
				}).catch(function(error){ });

				let item = {};
				item.member = this.userId;
				item.dateStart = helpers.getCurrentDateTime();
				item.dateEnd = '';

				timesRef.add(item).then((docRef) => {
					console.log("SAVE");
				}).catch(function(error) {
					console.error("Error adding document: ", error);
				});

			},




		},
		mounted() {
			this.db = firebase.firestore();
		}
	}
</script>