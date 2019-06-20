<template>
	<div class="comment">
		<template v-if="!isEditing">
			{{item.dateCreated}}
			{{item.description}}
			<a href="#" @click.prevent="startEdit">Editar</a>
			<a href="#" @click.prevent="onDelete">Deletar</a>
		</template>
		<template v-else>
			<form @submit.prevent="onSubmit">
				<div class="field has-addons">
					<div class="control">
						<input class="input" type="text" v-model="item.description">
					</div>
					<div class="control">
						<button type="submit" class="button is-success">
						Enviar
						</button>
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
	methods: {
		startEdit() {
			this.isEditing = true;
		},
		endEdit() {
			this.isEditing = false;
		},
		onSubmit() {
			this.db.collection(`projects/${this.projectId}/tasks/${this.taskId}/comments/`).doc(this.item.id).set(this.item);
			this.endEdit();
		},
		onDelete() {
			if(!confirm('Deseja deletar mesmo?')) return;
				this.db.collection(`projects/${this.projectId}/tasks/${this.taskId}/comments/`).doc(this.item.id).delete().then(()=>{
			});
		},
	},
	mounted() {
		this.db = firebase.firestore();
	}
}
</script>
