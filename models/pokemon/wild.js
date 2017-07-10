function object() {
	var self = this;
	self.encounter_id = 0;
	self.last_modified_timestamp_ms = 0;
	self.latitude = 0;
	self.longitude = 0;
	self.spawn_point_id = "";
	self.pokemon_data = null;
	self.time_till_hidden_ms = 0;
	
	self.get = function () {
		return {
			encounter_id: self.encounter_id,
			last_modified_timestamp_ms: self.last_modified_timestamp_ms,
			latitude: self.latitude,
			longitude: self.longitude,
			spawn_point_id: self.spawn_point_id,
			pokemon_data: self.pokemon_data,
			time_till_hidden_ms: self.time_till_hidden_ms,
		}
	};
};

module.exports = object;