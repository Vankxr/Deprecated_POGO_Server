const db = require('../db/index.js');
const token_decode 	= require('jwt-decode');

module.exports = function (provider, token, callback, extras) {
	if(provider && token && token != "") {
		if(provider == "google") {
			var decoded_token = false;
			try {
				decoded_token = token_decode(token);
			} catch (e) {
				return callback(e, null, false, extras);
			}
			
			if(decoded_token && decoded_token.email) {
				db.query("SELECT * FROM users WHERE email=? LIMIT 1", [decoded_token.email],
					function (e, db_res) {
						if(e) {
							return callback(e, null, false, extras);
						}
						
						if(db_res) {
							if(db_res.length > 0) {
								callback(null, db_res[0], false, extras);
							} else {
								db.query("INSERT INTO users (email) VALUES (?); SELECT * FROM users WHERE email=? LIMIT 1", [decoded_token.email, decoded_token.email],
									function (e, db_res) {
										if(e) {
											return callback(e, null, false, extras);
										}
										
										if(db_res && db_res[1]) {
											if(db_res[1].length > 0) {
												callback(null, db_res[1][0], true, extras);
											} else {
												callback(null, null, false, extras);
											}
										} else {
											callback(null, null, false, extras);
										}
									}
								);
							}
						} else {
							callback(null, null, false, extras);
						}
					}
				);
			}
		}
	}
};