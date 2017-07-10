const http		 = require('http');
const url		 = require('url');
const util		 = require('util');
const fs		 = require('fs');
const pogo		 = require('pogo-asset-downloader');

const protos	= require('./proto/index.js');
const output 	= require('./logger.js');
const db 		= require('./db/index.js');
const functions = require('./rpc/index.js');
const models 	= require('./models/index.js');

const rpc_port 	= 8080;

var pokemon 		= models.pokemon.data;
var wild_pokemon 	= models.pokemon.wild;
var nearby_pokemon	= models.pokemon.nearby;
var map_pokemon		= models.pokemon.map;

var player = models.player;

var inventory_item = models.inventory.item;

var pokestop	= models.map.pokestop;
var gym 		= models.map.gym;
var spawnpoint	= models.map.spawnpoint;

const authenticate	 = functions.authenticator;
const parse_requests = functions.request.parser;
const process_request = functions.request.processor;
const send_response	 = functions.response.sender;

var connected_players = [];

function now() {
	return new Date().getTime();
}

function get_pokemon_bundle_name(index) {
	return "pm" + (index >= 10 ? index >= 100 ? "0" : "00" : "000") + index;
}

function clear_connected_players() {
	for(var i = 0; i < connected_players.length; i++) {
		if(connected_players[i] && connected_players[i].auth_ticket) {
			if(connected_players[i].auth_ticket.expire_timestamp_ms < now()) {
				connected_players[i].sync();
				connected_players[i] = undefined;
			}
		}
	}
}

function get_player_by_ip(ip) {
	for(var i = 0; i < connected_players.length; i++) {
		if(connected_players[i] && connected_players[i].ip) {
			if(connected_players[i].ip == ip) {
				return connected_players[i];
			}
		}
	}
	return false;
}

function check_assets(platform_index, pokemon_index) {
	pogo.login(
		{
			provider: "google",
			username: "user",
			password: "pass"
		}
	).then(
		() => {
			try {
				fs.mkdirSync("./assets");
			} catch (e) {}
			
			var platform = pogo.platforms[platform_index];
			
			fs.access("./assets/game_master", fs.F_OK,
				function (e) {
					if(e) {
						console.log("Missing asset game_master");
						pogo.getGameMaster().then(
							(master) => {
								console.log("Downloaded asset game_master");
								fs.writeFileSync("./assets/game_master", master.toBuffer());
								
								check_assets(platform_index, start);
							}
						);
					} else {
						pogo.setPlatform(platform.name);
					
						try {
							fs.mkdirSync("./assets/" + platform.name);
						} catch (e) {}
						
						fs.access("./assets/" + platform.name + "/asset_digest", fs.F_OK,
							function (e) {
								if(e) {
									console.log("Missing asset " + platform.name + "/asset_digest");
									pogo.getAssetDigest(platform).then(
										(asset) => {
											console.log("Downloaded asset " + platform.name + "/asset_digest");
											fs.writeFileSync("./assets/" + platform.name + "/asset_digest", asset.toBuffer());
											
											check_assets(platform_index, start);
										}
									);
								} else {
									fs.access("./assets/" + platform.name + "/" + get_pokemon_bundle_name(pokemon_index), fs.F_OK,
										function (e) {
											if(e) {
												console.log("Missing asset " + platform.name + "/" + get_pokemon_bundle_name(pokemon_index));
												pogo.getAssetByPokemonId(pokemon_index).then(
													(downloads) => {
														downloads.map(
															(item) => {
																console.log("Downloaded asset " + platform.name + "/" + item.name);
																fs.writeFileSync("./assets/" + platform.name + "/" + item.name, item.body);
																
																if(pokemon_index < 151) {
																	check_assets(platform_index, pokemon_index + 1);
																} else if(platform_index < pogo.platforms.length - 1) {
																	check_assets(platform_index + 1, 1);
																}
															}
														);
													}
												);
											} else {
												if(pokemon_index < 151) {
													check_assets(platform_index, pokemon_index + 1);
												} else if(platform_index < pogo.platforms.length - 1) {
													check_assets(platform_index + 1, 1);
												}
											}
										}
									);
								}
							}
						);
					}
				}
			);
		}
	).catch(
		(e) => {
			console.log("Failed to check for assets! (" + e + ")");
		}
	);
}

function handle_requests(request, response) {
	var parsed_requests = parse_requests(request.envelope.requests);
								
	if(parsed_requests) {
		response.envelope.returns = [];
		
		function handle_request() {
			output("REQUEST MESSAGE: " + request.envelope.requests[0].toRaw().request_type, 5);
			process_request(request.player, parsed_requests[0],
				function (e, handled_request, data) {
					if(e) {
						output("ERROR: Failed to decode request message! Message: '" + e + "' BAD_REQUEST", 1);
						response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.BAD_REQUEST;
						return send_response(response);
					}
					
					if(handled_request) {
						response.envelope.returns.push(handled_request);
						parsed_requests.splice(0, 1);
						request.envelope.requests.splice(0, 1);
					}
					
					if(data[0]) {
						if(request.envelope.auth_info) {
							output("RPC: Successfully handled! OK_RPC_URL_IN_RESPONSE", 4);
							response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.OK_RPC_URL_IN_RESPONSE;
							response.envelope.api_url = "pgorelease.nianticlabs.com/plfe";
						} else {
							output("RPC: Successfully handled! OK", 4);
							response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.OK;
						}
						response.envelope.auth_ticket = new protos.Networking.Envelopes.AuthTicket(request.player.auth_ticket);
						return send_response(response);
					} else {
						return handle_request();
					}
				},
				[parsed_requests.length == 1]
			);
		}
		
		handle_request();
	} else {
		output("ERROR: Failed to decode request message! BAD_REQUEST", 1);
		response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.BAD_REQUEST;
		return send_response(response);
	}
}

function handle_rpc_request(request, response) {
	response.envelope = {};
	request.player = get_player_by_ip(request.remote_host);
	
	try {
		request.envelope = protos.Networking.Envelopes.RequestEnvelope.decode(request.body);
	} catch (e) {
		response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.BAD_REQUEST;
		return send_response(response);
	}
	
	if(request.envelope) {
		output("RPC: New request from '" + request.remote_host + "'...", 3);
		response.envelope.request_id = request.envelope.request_id;
		
		if(request.envelope.auth_info && request.envelope.auth_info.token && request.envelope.auth_info.token.contents) {
			authenticate(request.envelope.auth_info.provider, request.envelope.auth_info.token.contents,
				function (e, user_data, is_new) {
					if(e) {
						output("ERROR: Failed to authenticate player! Message: '" + e + "' INVALID_AUTH_TOKEN", 1);
						response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.INVALID_AUTH_TOKEN;
						return send_response(response);
					}
					
					if(!request.player) {
						output("PLAYER: New player connected! Username: " + user_data.email, 2);
						request.player = new player();
						connected_players.push(request.player);
					}
					
					request.player.id = user_data.id;
					request.player.ip = request.remote_host;
					
					request.player.auth_ticket.start = new Buffer((Math.random() * now() * 10).toString());
					request.player.auth_ticket.end = new Buffer((Math.random() * 10).toString());
					request.player.auth_ticket.expire_timestamp_ms = now() + 1800000;
					
					request.player.last_request_timestamp_ms = now();
					
					request.player.sync(
						function (e, success) {
							if(e) {
								output("ERROR: Failed to sync player! Message: '" + e + "' INVALID_AUTH_TOKEN", 1);
								response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.INVALID_AUTH_TOKEN;
								return send_response(response);
							}
							
							if(success) {
								return handle_requests(request, response);
							} else {
								output("ERROR: Failed to sync player! INVALID_AUTH_TOKEN", 1);
								response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.INVALID_AUTH_TOKEN;
								return send_response(response);
							}
						}
					);
				}
			);
		} else if(request.envelope.auth_ticket && request.envelope.auth_ticket.expire_timestamp_ms && request.envelope.auth_ticket.expire_timestamp_ms > now() && request.player) {
			
			request.player.auth_ticket.expire_timestamp_ms = now() + 1800000;
			request.player.last_request_timestamp_ms = now();
			
			request.player.sync(
				function (e, success) {
					if(e) {
						output("ERROR: Failed to sync player! Message: '" + e + "' INVALID_AUTH_TOKEN", 1);
						response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.INVALID_AUTH_TOKEN;
						return send_response(response);
					}
					
					if(success) {
						return handle_requests(request, response);
					} else {
						output("ERROR: Failed to sync player! INVALID_AUTH_TOKEN", 1);
						response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.INVALID_AUTH_TOKEN;
						return send_response(response);
					}
				}
			);
		} else {
			output("ERROR: Invalid authentication info! INVALID_AUTH_TOKEN", 1);
			response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.INVALID_AUTH_TOKEN;
			return send_response(response);
		}
	} else {
		output("ERROR: Failed to decode request! BAD_REQUEST", 1);
		response.envelope.status_code = protos.Networking.Envelopes.ResponseEnvelope.StatusCode.BAD_REQUEST;
		return send_response(response);
	}
}

function handle_asset_request(request, response, path) {
	var file = path.split("/");
	output("ASSET: New request from '" + request.remote_host + "' to download '" + path + "'...", 3);
	fs.readFile('./assets' + path,
		function (e, data) {
			if(e) {
				output("ERROR: Error reading file!", 1);
				response.statusCode = 404;
				return response.end();
			}
			output("ASSET: Successfully sent the asset!", 4);
			response.setHeader("Content-Disposition", "attachment; filename=" + file[file.length - 1]);
			return response.end(data);
		}
	);
}

var rpc_server = http.createServer(
	function (request, response) {
		request.route = url.parse(request.url).pathname.split("/");
		request.remote_host = request.headers.host == "127.0.0.1:8080" ? request.headers.proxy_host.replace("::", "").split(":")[1] : request.headers.host.split(":")[0];
		request.body = [];

		request.on('data',
			function(chunk) {
				request.body.push(chunk);
			}
		);

		request.on('end',
			function() {
				request.body = Buffer.concat(request.body);
				
				switch(request.route[1]) {
					case "plfe":
						if(request.method === "POST") {
							if(request.route[2] === "rpc") {
								return handle_rpc_request(request, response);
							}
							response.statusCode = 404;
							return response.end();
						}
					break;
					case "assets":
						request.route.splice(0, 2);
						var path = request.route.join("/");
						if(path) {
							return handle_asset_request(request, response, path);
						}
						response.statusCode = 404;
						return response.end();
					break;
					case "cert":
						output("CERTIFICATE: New request from '" + request.remote_host + "' to download the certificate...", 3);
						fs.readFile('./downloads/pogo.cer',
							function (e, data) {
								if(e) {
									output("ERROR: Error reading certificate file!", 1);
									response.statusCode = 404;
									return response.end();
								}
								output("ASSET: Successfully sent the certificate!", 4);
								response.setHeader("Content-Disposition", "attachment; filename=pogo.cer");
								return response.end(data);
							}
						);
						break;
					case "apk":
						output("APK: New request from '" + request.remote_host + "' to download the apk...", 3);
						fs.readFile('./downloads/0.35.0.apk',
							function (e, data) {
								if(e) {
									output("ERROR: Error reading apk file!", 1);
									response.statusCode = 404;
									return response.end();
								}
								output("ASSET: Successfully sent the apk!", 4);
								response.setHeader("Content-Disposition", "attachment; filename=pogo0.35.0unsigned.apk");
								return response.end(data);
							}
						);
						break;
					default:
						response.statusCode = 404;
						return response.end();
					break;
				}
			}
		);
	}
);

rpc_server.listen(rpc_port);
output('Pokemon GO Server started on port ' + rpc_port, 6);

setInterval(clear_connected_players, 60000);
//setTimeout(check_assets, 1000, 0, 1);