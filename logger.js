const fs		 = require('fs');
const colors	 = require('colors/safe');

module.exports = function (m, t) {
	var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	switch(t) {
		case 1:
			console.log(colors.red("[" + time + "] " + m));
			break;
		case 2: 
			console.log(colors.yellow("[" + time + "] " + m));
			break;
		case 3:
			console.log(colors.cyan("[" + time + "] " + m));
			break;
		case 4:
			console.log(colors.green("[" + time + "] " + m));
			break;
		case 5:
			console.log(colors.magenta("[" + time + "] " + m));
			break;
		case 6:
			console.log(colors.grey("[" + time + "] " + m));
			break;
		case 7:
			console.log(colors.blue("[" + time + "] " + m));
			break;
		case 8:
			console.log(colors.bgWhite(colors.black("[" + time + "] " + m)));
			break;
		default:
			console.log("[" + time + "] " + m);
			break;
	}
};