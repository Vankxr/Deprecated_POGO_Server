function object() {
	var self = this;
	self.encounter_id = 0;
	self.pokemon_id = 0;
	self.distance_in_meters = 0;
	self.fort_id = "";
	self.fort_image_url = "";
	
	self.get = function () {
		return {
			encounter_id: self.encounter_id,
			pokemon_id: self.pokemon_id,
			distance_in_meters: self.distance_in_meters,
			fort_id: self.fort_id,
			fort_image_url: self.fort_image_url,
		}
	};
};

module.exports = object;