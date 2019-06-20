<template>

	<div class="card">
		<header class="card-header">
			<p class="card-header-title">Checklist</p>
		</header>
		<div class="card-content">
			<div class="content">
				<checklist-item v-for="item in checklist" @dragstart="onDragstart" @dragdrop="onDragdrop" :item="item" :projectId="projectId" :taskId="taskId" />

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

			</div>
		</div>
	</div>


</template>


<script>
	import firebase from '@/firebase';
	import checklistItem from '../components/ChecklistItem';
	export default {
		props: ['checklist', 'projectId', 'taskId'],
		components:{
			checklistItem
		},
		data() {
			return {
				db: null,
				item: {
					description: '',
				},
				itemDragged:null
			}
		},
		methods: {
			onSubmit(){
				const checklistRef = this.db.collection('projects').doc(this.projectId).collection('tasks').doc(this.taskId).collection('checklist');
				this.item.order = this.checklist[this.checklist.length-1].order + 1;
				checklistRef.add(this.item).then(() => {
					console.log("SAVE");
				}).catch(function(error) {
					console.error("Error adding document: ", error);
				});
				this.item = {description: ''};
			},
			onDragstart(itemId){
				this.itemDragged = this.checklist.find( item => item.id==itemId );
			},
			onDragdrop(itemId){

				let targetItem = this.checklist.find( item => item.id==itemId );

				let from = this.checklist.indexOf(this.itemDragged);
				let to = this.checklist.indexOf(targetItem);

				let removed = this.checklist.splice(from,1);
				this.checklist.splice(to,0,removed[0]);

				let batch = this.db.batch();

				const checklistRef = this.db.collection('projects').doc(this.projectId).collection('tasks').doc(this.taskId).collection('checklist');
				for(let i in this.checklist){
					let itemRef = checklistRef.doc(this.checklist[i].id);
					batch.update(itemRef, {order: i});
				}

				batch.commit().then(function () {
					console.log('Salvou nova ordem mundial!');
				});

			},

		},
		mounted() {
			this.db = firebase.firestore();

		}



	}
</script>