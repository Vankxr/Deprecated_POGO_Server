function object() {
	var self = this;
	self.id = 0;
	
	self.pokemon_id = 0;
	self.cp = 0;
	self.stamina = 0;
	self.stamina_max = 0;
	self.move_1 = 0;
	self.move_2 = 0;
	self.deployed_fort_id = "";
	self.owner_name = "";
	self.is_egg = false;
	self.egg_km_walked_target = 0;
	self.egg_km_walked_start = 0;
	self.origin = 0;
	self.height_m = 0;
	self.weight_kg = 0;
	self.individual_attack = 0;
	self.individual_defense = 0;
	self.individual_stamina = 0;
	self.cp_multiplier = 0;
	self.pokeball = 0;
	self.captured_cell_id = 0;
	self.battles_attacked = 0;
	self.battles_defended = 0;
	self.egg_incubator_id = "";
	self.creation_time_ms = 0;
	self.num_upgrades = 0;
	self.additional_cp_multiplier = 0;
	self.favorite = 0;
	self.nickname = "";
	self.from_fort = 0;
	self.buddy_candy_awarded = 0;
	
	self.owner = null;
	
	self.get = function () {
		return {
			id: self.id = 0,
			pokemon_id: self.pokemon_id,
			cp: self.cp,
			stamina: self.stamina,
			stamina_max: self.stamina_max,
			move_1: self.move_1,
			move_2: self.move_2,
			deployed_fort_id: self.deployed_fort_id,
			owner_name: self.owner_name,
			id_egg: self.is_egg,
			egg_km_walked_target: self.egg_km_walked_target,
			egg_km_walked_start: self.egg_km_walked_start,
			origin: self.origin,
			height_m: self.height_m,
			weight_kg: self.weight_kg,
			individual_attack: self.individual_attack,
			individual_defense: self.individual_defense,
			individual_stamina: self.individual_stamina,
			cp_multiplier: self.cp_multiplier,
			pokeball: self.pokeball,
			captured_cell_id: self.captured_cell_id,
			battles_attacked: self.battles_attacked,
			battles_defended: self.battles_defended,
			egg_incubator_id: self.egg_incubator_id,
			creation_time_ms: self.creation_time_ms,
			num_upgrades: self.num_upgrades,
			additional_cp_multiplier: self.additional_cp_multiplier,
			favorite: self.favorite,
			nickname: self.nickname,
			from_fort: self.from_fort,
			buddy_candy_awarded: self.buddy_candy_awarded,
		};
	};
	
	self.evolve = function () {
		//...
	}
	
	self.release = function () {
		//... DONT FORGET ADD PLAYER DELETED
	}
	
	self.power_up = function () {
		//...
	}
	
	self.revive = function (hp) {
		//...
	}
	
	self.heal = function (hp) {
		//...
	}
};

module.exports = object;