const protos	= require('../../proto/index.js');
const db 		= require('../../db/index.js');

function object() {
	var self = this;
	self.id = "";
	self.enabled = true;
	
	self.cell_id = 0;
	self.latitude = 0;
	self.longitude = 0;
	
	self.last_modified_timestamp_ms = 0;
	
	self.name = "";
	self.description = "";
	self.image_urls = [];
	
	self.is_in_battle = false;
	self.owned_by_team = 0;
	self.pokemon_data = null;
	self.fp = 0;

	
	self.get_details = function () {
		return {
			"fort_id": self.cell_id.toString() + "." + self.id.toString(),
			"team_color": self.owned_by_team,
			"pokemon_data": self.pokemon_data,
			"name": self.name,
			"image_urls": self.image_urls,
			"fp": self.fp,
			"stamina": 0,
			"max_stamina": 0,
			"type": 0,
			"latitude": self.latitude,
			"longitude": self.longitude,
			"description": self.description,
		};
	};
	
	self.get = function () {
		return {
			"id": self.cell_id.toString() + "." + self.id.toString(),
			"last_modified_timestamp_ms": self.last_modified_timestamp_ms,
			"latitude": self.latitude,
			"longitude": self.longitude,
			"enabled": self.enabled,
			"type": 0,
			"owned_by_team": self.owned_by_team,
			"guard_pokemon_id": (self.pokemon_data && self.pokemon_data.pokemon_id ? self.pokemon_data.pokemon_id : 0),
			"guard_pokemon_cp": (self.pokemon_data && self.pokemon_data.cp ? self.pokemon_data.cp : 0),
			"gym_points": self.fp,
			"is_in_battle": self.is_in_battle,
		};
	};
};

module.exports = object;