const helpers = {
	getCurrentDateTime: () => {
		let current_datetime = new Date()
		return current_datetime.getFullYear() +
		"-" + (('0'+(current_datetime.getMonth() + 1)).substr(-2)) +
		"-" + (('0'+current_datetime.getDate()).substr(-2)) +
		" " + (('0'+current_datetime.getHours()).substr(-2)) +
		":" + (('0'+current_datetime.getMinutes()).substr(-2)) +
		":" + (('0'+current_datetime.getSeconds()).substr(-2));
	},
	formatDuration: (seconds) => {
		//console.log()
		//var seconds = Math.floor(seconds % 60);
		var minutes = Math.floor((seconds / 60) % 60);
		var hours = Math.floor((seconds / (60 * 60)) % 24);
		var days = Math.floor((seconds / (60 * 60 * 24)));
		return ('0' + hours).slice(-2)+':'+('0' + minutes).slice(-2);
	}

}








export default helpers;