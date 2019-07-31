<template>
	<div class="time">
		<template v-if="!isEditing">
			{{ itemMutable.dateStart }} - {{ itemMutable.dateEnd }}
			<button v-if="item.id == runningTimer.timerId && item.member == userId" @click="onStop(item)">Parar</button>
			<button v-if="item.member == userId" @click="startEdit(item)">Editar</button>

		</template>
		<template v-else>
			<form @submit.prevent="onSubmit">
				<div class="field has-addons">
					<div class="control">
						<input class="input" type="text" v-model="itemMutable.dateStart">
					</div>
					<div class="control">
						<input class="input" type="text" v-model="itemMutable.dateEnd">
					</div>
					<div class="control">
						<button type="submit" class="button is-success">
						Enviar
						</button>
					</div>
					<div class="control">
						<button class="button is-danger" @click.prevent="onDelete">Deletar</button>
					</div>
				</div>
			</form>
		</template>
	</div>
</template>
<script>
import firebase from '@/firebase';
export default {
	props: ['item', 'projectId', 'taskId'],
	data() {
		return {
			isEditing: false,
			db: null,
			itemMutable: {
				dateStart: '',
				dateEnd: '',
			}
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
		startEdit() {
			this.isEditing = true;
		},
		endEdit() {
			this.isEditing = false;
		},
		onSubmit() {
			this.item.dateStart = new Date(this.itemMutable.dateStart);
			this.item.dateEnd = new Date(this.itemMutable.dateEnd);
			this.db.collection(`projects/${this.projectId}/tasks/${this.taskId}/times/`).doc(this.item.id).set(this.item);
			this.endEdit();
		},
		onDelete() {
			if(!confirm('Deseja deletar mesmo?')) return;
			this.db.collection(`projects/${this.projectId}/tasks/${this.taskId}/times/`).doc(this.item.id).delete().then(()=>{
				this.endEdit();
			});
		},
		onStop(){
			this.$store.dispatch('stopRunningTimer');
		},
	},
	mounted() {
		this.db = firebase.firestore();
		// this.itemMutable = this.item;
		this.itemMutable.dateStart = helpers.getDateTime(this.item.dateStart.toDate()); 
		this.itemMutable.dateEnd = helpers.getDateTime(this.item.dateEnd.toDate()); 
		
	}
}
</script>
