const mysql 	 = require('mysql');
const db		 = mysql.createConnection({
	host     			 : '127.0.0.1',
	user    			 : 'localuser',
	password 			 : 'local123test',
	database 			 : 'pogoserver',
	multipleStatements : true,
});

module.exports = db;