<template>
	<div draggable="true" :data-checklist-item-id="item.id">
		<template v-if="!isEditing">
			<label class="checkbox">
				<input type="checkbox" v-model="item.finished" @change="markFinished(item)">
				{{ item.description }}
				<a href="#" @click.stop.prevent="startEdit">Editar</a>
				<a href="#" @click.stop.prevent="onDelete">Deletar</a>
			</label>
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
				this.db.collection(`projects/${this.projectId}/tasks/${this.taskId}/checklist/`).doc(this.item.id).set(this.item);
				this.endEdit();
			},

			markFinished(item){
				this.db.collection(`projects/${this.projectId}/tasks/${this.taskId}/checklist/`).doc(item.id).set(item);
			},

			onDelete() {
				if(!confirm('Deseja deletar mesmo?')) return;
				this.db.collection(`projects/${this.projectId}/tasks/${this.taskId}/checklist/`).doc(this.item.id).delete().then(()=>{
					// alert('deletou');
				});
			},
		},
		mounted() {
			let item = document.querySelector('[data-checklist-item-id="'+this.item.id+'"]');

			item.addEventListener('dragstart', (e) => {
				this.$emit('dragstart',this.item.id);
			});

			item.addEventListener('dragover', (e) => {
				e.preventDefault();
				return false;
			}, false);

			item.addEventListener('drop', (e) => {
				if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting.
				this.$emit('dragdrop',this.item.id);
			});

			this.db = firebase.firestore();
		}

	}
</script>