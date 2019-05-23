<template>
	<div class="list-cards has-tasks">
	<div v-for="(task, index) in list" :key="index" class="card is-task">
		<div class="task-id">
			<strong>id</strong>
			{{task.id}}
		</div>
		<div class="task-name">
			<strong>name</strong>
			{{task.name}}
		</div>
        <!-- <div class="task-description">
			<strong>description</strong>
			{{task.description}}
		</div> -->
        <div class="task-dateDue">
			<strong>dateDue</strong>
			{{task.dateDue}}
		</div>
        <!-- members: [<users>], -->
        <div class="task-finished">
			<strong>finished</strong>
			{{task.finished}}
		</div>
		<router-link :to="{name:'taskUpdate', params:{id: task.projectId, taskId:task.id}}">Editar</router-link>
	</div>
	</div>
</template>
<script>
export default {
	props: {
		list: {
			type: Array,
			required: true
		}
	},


}
</script>
