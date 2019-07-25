<template>
	<div class="columns">
		<div class="column is-3" v-for="(task, index) in list" :key="index">
			<div class="card is-task">
				<div class="card-header">
					<div class="card-header-title">
						{{task.id}} - {{task.name}}
					</div>
				</div>
				<div class="card-content">
					<div class="task-dateDue">
						<strong>Data de vencimento</strong>
						{{task.dateDue}}
					</div>
					<div class="task-finished">
						<strong>Membros</strong>
						<ul>
							<li v-for="(member, indexMember) in task.members" :key="indexMember">
								{{member.name}}
							</li>
						</ul>
					</div>
					<div class="task-finished">
						<strong>Finalizado</strong>
						{{task.finished || false}}
					</div>
					<div class="task-total-time">
						<strong>Tempo total</strong>
						{{task.totalTime }}
					</div>
				</div>
				<!-- <div class="task-description">
					<strong>description</strong>
					{{task.description}}
				</div> -->
				<!-- members: [<users>], -->
				<div class="card-footer">
					<router-link class="button is-info" :to="{name:'taskUpdate', params:{id: task.projectId, taskId:task.id}}">Editar</router-link>
					<router-link class="button is-info" :to="{name:'taskView', params:{id: task.projectId, taskId:task.id}}">Visualizar</router-link>
				</div>
			</div>
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
