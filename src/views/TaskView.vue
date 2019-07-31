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
							<label> Finalizado</label>
							{{task.finished || false}}
						</div>

						<task-times :times="task.times" :projectId="id" :taskId="taskId" />

						<task-comments :comments="task.comments" :projectId="id" :taskId="taskId" />

						<task-checklist :checklist="task.checklist" :projectId="id" :taskId="taskId" />


						<h3>Anexos</h3>

						<input type="file" @change="onFileUpload">

						<h3>Lista de Anexos</h3>
						<ul>
							<li v-for="file in task.files">
								{{ file.name }} <a :href="file.downloadUrl" target="_blank">visualizar</a>
							</li>
						</ul>





					</div>
				</section>
				<footer class="modal-card-foot">
					<!-- <button class="button is-success" type="submit">Salvar</button> -->
					<a href="#" @click.prevent="goBack" class="button">Fechar</a>
				</footer>
			</div>
		</div>
	</div>
</template>
<script>
	import firebase from '@/firebase'
	import taskComments from '../components/TaskComments';
	import taskChecklist from '../components/TaskChecklist';
	import taskTimes from '../components/TaskTimes';
	export default {
		components: {
			taskComments,
			taskChecklist,
			taskTimes
		},
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
					checklist: [],
					times: [],
					files: [],
				},
				comment: {
					description: '',
				},

				members: [],
				db: null,
				snapshotComments: null,
				snapshotChecklist: null,
				snapshotTimes: null,
			}
		},
		methods:{
			goBack() {
				if(this.$route.name == 'myTaskView') {
					this.$router.push({name:'myTasks'});
					return;
				}
				this.$router.push({name:'projectView', params: {id:this.id}});
			},
			onFileDownload(filePath){
				var storage = firebase.storage();
				var pathReference = storage.ref(filePath).getDownloadURL().then(function(url) {
					console.log('pathReference',url);

				})
				let storageRef = storage.ref();
				var pathReference2 = storageRef.child(filePath).getDownloadURL().then(function(url) {
					console.log('pathReference2',url);
				})

			},
			onFileUpload(e){
				let files = e.target.files || e.dataTransfer.files;
				if (!files.length) return;
				let file = files[0];

				let storageRef = firebase.storage().ref();
				var timestamp = new Date().getTime();
				let fileRef = storageRef.child(timestamp+'-'+file.name);
				let uploadTask = fileRef.put(file);
				// .then(function(snapshot) {
				// 	console.log('Uploaded a blob or file!');
				// 	console.log(snapshot);
				// });

				uploadTask.on('state_changed', snapshot => {
				  // Observe state change events such as progress, pause, and resume
				  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				  console.log('Upload is ' + progress + '% done');
				}, error => {
					console.log('Erro',error);
				  // Handle unsuccessful uploads
				}, () => {
				  // Handle successful uploads on complete
				  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
				  uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
				  	console.log('File available at', downloadURL);

					  if(!this.task.files) this.task.files = [];
					  this.task.files.push({name:file.name,downloadUrl:downloadURL});

					  this.db.doc(`projects/${this.id}/tasks/${this.taskId}`).update({files:this.task.files}).then(()=>{
					  	console.log('anexos salvos no db');
					  });

				  });





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



			if(this.taskId) {
				this.db.doc(`projects/${this.id}/tasks/${this.taskId}`).get().then(doc => {
					if(doc.exists){
						this.task = { id:doc.id, comments: [], checklist: [], times: [], files: [], ...doc.data() };

						const timesRef = this.db.collection(`projects/${this.id}/tasks/${this.taskId}/times`);
						this.snapshotTimes = timesRef.onSnapshot(querySnapshot => {
							let timesHandler = [];
							querySnapshot.forEach(register => {
								let time = { id:register.id, taskId: this.task.id, ...register.data() };
								timesHandler.push(time);
							});
							timesHandler = timesHandler.sort((a,b)=>{ return a.dateStart > b.dateStart? 1: -1 })
							this.task.times = timesHandler;
						});


						const commentsRef = this.db.collection(`projects/${this.id}/tasks/${this.taskId}/comments`);
						this.snapshotComments = commentsRef.onSnapshot(querySnapshot => {
							let commentsHandler = [];
							querySnapshot.forEach(register => {
								let comment = { id:register.id, taskId: this.task.id, ...register.data() };
								commentsHandler.push(comment);
							});
							commentsHandler = commentsHandler.sort((a,b)=>{ return a.dateCreated > b.dateCreated? 1: -1 })
							this.task.comments = commentsHandler;
						});


						const checklistRef = this.db.collection(`projects/${this.id}/tasks/${this.taskId}/checklist`);
						this.snapshotChecklist = checklistRef.onSnapshot(querySnapshot => {
							let checklistHandler = []
							querySnapshot.forEach(register => {
								let checklistItem = { id:register.id, taskId: this.task.id, ...register.data() };
								checklistHandler.push(checklistItem);
							});

							checklistHandler = checklistHandler.sort((a,b)=>{ return parseInt(a.order) > parseInt(b.order)? 1: -1 });

							this.task.checklist = checklistHandler;
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
			if(this.snapshotChecklist) this.snapshotChecklist();
			if(this.snapshotTimes) this.snapshotTimes();
		},
	}
</script>
