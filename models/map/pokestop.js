const protos	= require('../../proto/index.js');
const db 		= require('../../db/index.js');

function now() {
	return new Date().getTime();
}

function object() {
	var self = this;
	self.id = "";
	self.enabled = true;
	
	self.cell_id = 0;
	self.latitude = 0;
	self.longitude = 0;
	
	self.last_modified_timestamp_ms = 0;
	
	self.lure_info = null;
	
	self.sponsor = 0;
	self.rendering_type = 0;
	
	self.name = "";
	self.description = "";
	self.image_urls = [];
	self.modifiers = [];
	
	self.rewards = [];
	self.cooldown = 300000;
	self.player_cooldowns = [];
	
	
	self.get_details = function () {
		return {
			"fort_id": self.cell_id.toString() + "." + self.id.toString(),
			"name": self.name,
			"image_urls": self.image_urls,
			"type": 1,
			"latitude": self.latitude,
			"longitude": self.longitude,
			"description": self.description,
			"modifiers": self.modifiers,
		};
	};
	
	self.get_player_cooldown = function (player) {
		for(var i = 0; i < self.player_cooldowns.length; i++) {
			if(self.player_cooldowns[i].id == player.id) {
				return self.player_cooldowns[i].timestamp_ms;
			}
		}
		return 0;
	};
	
	self.set_player_cooldown = function (player) {
		for(var i = 0; i < self.player_cooldowns.length; i++) {
			if(self.player_cooldowns[i].id == player.id) {
				self.player_cooldowns[i].timestamp_ms = now() + self.cooldown;
				return true;
			}
		}
		self.player_cooldowns.push(
			{
				"id": player.id,
				"timestamp_ms": now() + self.cooldown,
			}
		);
		return true;
	};
	
	self.get = function (player) {
		return {
			"id": self.cell_id.toString() + "." + self.id.toString(),
			"last_modified_timestamp_ms": self.last_modified_timestamp_ms,
			"latitude": self.latitude,
			"longitude": self.longitude,
			"enabled": self.enabled,
			"type": 1,
			"active_fort_modifier": self.modifiers,
			"lure_info": self.lure_info,
			"cooldown_complete_timestamp_ms": self.get_player_cooldown(player),
			"sponsor": self.sponsor,
			"rendering_type": self.rendering_type,
		};
	};
	
	self.search = function (player) {
		//...
		self.set_player_cooldown(player);
	}
};

module.exports = object;