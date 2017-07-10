function object() {
	var self = this;
	self.id = 0;
	
	self.cell_id = 0;
	self.latitude = 0;
	self.longitude = 0;
	
	self.get = function () {
		return {
			"latitude": self.latitude,
			"longitude": self.longitude,
		}
	};
};

module.exports = object;