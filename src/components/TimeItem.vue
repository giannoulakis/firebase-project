<template>
	<div class="time">
		<template v-if="!isEditing">
			{{ item.dateStart }} - {{ item.dateEnd }}
			<button v-if="item.id == runningTimer.timerId && item.member == userId" @click="onStop(item)">Parar</button>
			<button v-if="item.member == userId" @click="startEdit(item)">Editar</button>

		</template>
		<template v-else>
			<form @submit.prevent="onSubmit">
				<div class="field has-addons">
					<div class="control">
						<input class="input" type="text" v-model="item.dateStart">
					</div>
					<div class="control">
						<input class="input" type="text" v-model="item.dateEnd">
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
	}
}
</script>
