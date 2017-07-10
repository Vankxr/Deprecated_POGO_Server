const protos	= require('../../proto/index.js');
const db 		= require('../../db/index.js');

var pokestop	= require('./pokestop.js');
var gym 		= require('./gym.js');
var spawnpoint	= require('./spawnpoint.js');

function now() {
	return new Date().getTime();
}

function object() {
	var self = this;
	self.id = 0;
	self.last_request_timestamp_ms = 0;
	
	self.forts = [];
	self.spawn_points = [];
	self.wild_pokemons = [];
	self.catchable_pokemons = [];
	self.nearby_pokemons = [];

	
	self.sync = function (callback, extras) {
		db.query("SELECT * FROM forts WHERE cell_id=?; SELECT * FROM spawnpoints WHERE cell_id=?;", [self.id.toString(), self.id.toString()],
			function (e, db_res) {
				if(e) {
					return callback(e, false, extras);
				}
				
				if(db_res) {
					for(var i = 0; i < db_res[0].length; i++) {
						var new_fort;
						if(db_res[0][i].type == 1) {
							new_fort = new pokestop();
							new_fort.id = db_res[0][i].id.toString();
							new_fort.cell_id = self.id;
							new_fort.latitude = db_res[0][i].latitude;
							new_fort.longitude = db_res[0][i].longitude;
							new_fort.sponsor = db_res[0][i].sponsor;
							new_fort.rendering_type = db_res[0][i].rendering_type;
							new_fort.name = db_res[0][i].name;
							new_fort.description = db_res[0][i].description;
							new_fort.image_urls.push(db_res[0][i].image_url);
						} else {
							new_fort = new gym();
							new_fort.id = db_res[0][i].id.toString();
							new_fort.cell_id = self.id;
							new_fort.latitude = db_res[0][i].latitude;
							new_fort.longitude = db_res[0][i].longitude;
							new_fort.name = db_res[0][i].name;
							new_fort.description = db_res[0][i].description;
							new_fort.image_urls.push(db_res[0][i].image_url);
							new_fort.owned_by_team = db_res[0][i].owned_by_team;
							new_fort.fp = db_res[0][i].fp;
						}
						self.forts.push(new_fort);
					}
					for(i = 0; i < db_res[1].length; i++) {
						var new_spawnpoint = new spawnpoint();
						new_spawnpoint.id = db_res[1][i].id.toString();
						new_spawnpoint.cell_id = self.id;
						new_spawnpoint.latitude = db_res[1][i].latitude;
						new_spawnpoint.longitude = db_res[1][i].longitude;
						self.spawn_points.push(new_spawnpoint);
					}
					
					return callback(null, true, extras);
				} else {
					return callback("Invalid database result!", false, extras);
				}
			}
		);
	};
	
	self.get = function (player) {
		var _wild_pokemons = [];
		var _catchable_pokemons = [];
		var _nearby_pokemons = [];
		var _forts = [];
		var _spawn_points = [];
		
		for(var i = 0; i < self.forts.length; i++) {
			_forts.push(new protos.Map.Fort.FortData(self.forts[i].get()));
		}
		for(i = 0; i < self.spawn_points.length; i++) {
			_spawn_points.push(new protos.Map.SpawnPoint(self.spawn_points[i].get()));
		}
		for(i = 0; i < self.wild_pokemons.length; i++) {
			_wild_pokemons.push(new protos.Map.Pokemon.WildPokemon(self.wild_pokemons[i].get()));
		}
		for(i = 0; i < self.nearby_pokemons.length; i++) {
			_nearby_pokemons.push(new protos.Map.Pokemon.NearbyPokemon(self.nearby_pokemons[i].get()));
		}
		for(i = 0; i < self.catchable_pokemons.length; i++) {
			_catchable_pokemons.push(new protos.Map.Pokemon.MapPokemon(self.catchable_pokemons[i].get()));
		}
		
		return {
			"s2_cell_id": self.id,
			"current_timestamp_ms": now(),
			"forts": _forts,
			"spawn_points": _spawn_points,
			"deleted_objects": [],
			"is_truncated_list": false,
			"fort_summaries": [],
			"decimated_spawn_points": [],
			"wild_pokemons": _wild_pokemons,
			"catchable_pokemons": _catchable_pokemons,
			"nearby_pokemons": _nearby_pokemons,
		};
	};
};

module.exports = object;