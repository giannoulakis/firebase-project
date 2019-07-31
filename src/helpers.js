const helpers = {
	getCurrentDateTime: () => {
		let current_datetime = new Date()
		return helpers.getDateTime(current_datetime);
	},
	getDateTime: (dateTime) => {
		return dateTime.getFullYear() +
		"-" + (('0'+(dateTime.getMonth() + 1)).substr(-2)) +
		"-" + (('0'+dateTime.getDate()).substr(-2)) +
		" " + (('0'+dateTime.getHours()).substr(-2)) +
		":" + (('0'+dateTime.getMinutes()).substr(-2)) +
		":" + (('0'+dateTime.getSeconds()).substr(-2));
	},
	getCurrentDate: () => {
		let current_datetime = new Date()
		return helpers.getDate(current_datetime);
	},
	getDate: (dateTime) => {
		return dateTime.getFullYear() +
		"-" + (('0'+(dateTime.getMonth() + 1)).substr(-2)) +
		"-" + (('0'+dateTime.getDate()).substr(-2));
	},
	formatDuration: (seconds) => {
		if(!seconds) {
			seconds = 0;
		}
		//console.log()
		//var seconds = Math.floor(seconds % 60);
		var minutes = Math.floor((seconds / 60) % 60);
		var hours = Math.floor((seconds / (60 * 60)) % 24);
		var days = Math.floor((seconds / (60 * 60 * 24)));
		return ('0' + hours).slice(-2)+':'+('0' + minutes).slice(-2);
	}

}








export default helpers;