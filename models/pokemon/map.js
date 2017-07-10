function object() {
	var self = this;
	self.encounter_id = 0;
	self.pokemon_id = 0;
	self.latitude = 0;
	self.longitude = 0;
	self.spawn_point_id = "";
	self.expiration_timestamp_ms = 0;
	
	self.get = function () {
		return {
			encounter_id: self.encounter_id,
			pokemon_id: self.pokemon_id,
			latitude: self.latitude,
			longitude: self.longitude,
			spawn_point_id: self.spawn_point_id,
			expiration_timestamp_ms: self.expiration_timestamp_ms,
		}
	};
};

module.exports = object;