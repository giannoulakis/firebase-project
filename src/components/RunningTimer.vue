<template>

	<div class="runningTimer" v-if="runningTimer.timerId">
		{{ runningTimer.timerId }}
		{{ runningTimer.name }}
		{{ runningTimer.dateStart }}
		<button @click="onStop">Stop</button>
	</div>

</template>


<script>

	export default {
		computed:{
			runningTimer() {
				return this.$store.state.runningTimer;
			},
		},
		data() {
			return {}
		},
		methods: {
			onStop(){
				this.$store.dispatch('stopRunningTimer');
			},


		},
	}



</script>
