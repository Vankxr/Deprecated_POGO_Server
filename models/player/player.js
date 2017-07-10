const protos	= require('../../proto/index.js');
const db 		= require('../../db/index.js');

function object() {
	var self = this;
	self.id = 0;
	self.last_request_timestamp_ms = 0;
	self.auth_ticket = {
		start: null,
		expire_timestamp_ms: 0,
		end: null,
	};
	self.synced = false;
	self.ip = "";
	self.platform = 0;
	self.latitude = 0;
	self.longitude = 0;
	self.altitude = 0;
	
	self.codename = "";
	self.email = "";
	self.badges = [];
	self.avatar = {
		skin: 0,
		hair: 0,
		shirt: 0,
		pants: 0,
		hat: 0,
		shoes: 0,
		gender: 0,
		eyes: 0,
		backpack: 0,
	};
	self.team = 0;
	self.tutorial_states = [0, 1, 3, 4, 7];
	self.creation_timestamp_ms = 0;
	self.remaining_codename_claims = 0;
	self.max_pokemon_storage = 250;
	self.max_item_storage = 350;
	self.buddy_pokemon = null;
	self.currencies = [
		["POKECOIN", 0],
		["STARDUST", 0],
	];
	self.contact_settings = {
		send_marketing_emails: true,
		send_push_notifications: false,
	};
	self.daily_bonus = {
		next_collected_timestamp_ms: 0,
		next_defender_bonus_collect_timestamp_ms: 0,
	};
	self.equipped_badge = {
		badge_type: 0,
		level: 0,
		next_equip_change_allowed_timestamp_ms: 0,
	};
	
	self.inventory = {
		pokemons: [],
		deleted_pokemons: [],
		items: [],
		egg_incubators: [],
		pokedex_entries: [],
		player_stats: [],
		player_currencies: [],
		player_cameras: [],
		inventory_upgrades: [],
		applied_items: [],
		candies: [],
	};
	
	self.level = 1;
	self.experience = 0;
	self.prev_level_xp = 0;
	self.next_level_xp = 1000;
	self.km_walked = 0;
	self.pokemons_encountered = 0;
	self.unique_pokedex_entries = 0;
	self.pokemons_captured = 0;
	self.evolutions = 0;
	self.poke_stop_visits = 0;
	self.pokeballs_thrown = 0;
	self.eggs_hatched = 0;
	self.big_magikarp_caught = 0;
	self.battle_attack_won = 0;
	self.battle_attack_total = 0;
	self.battle_defended_won = 0;
	self.battle_training_won = 0;
	self.battle_training_total = 0;
	self.prestige_raised_total = 0;
	self.prestige_dropped_total = 0;
	self.pokemon_deployed = 0;
	self.pokemon_caught_by_type = [];
	self.small_rattata_caught = 0;
	
	self.get = function () {
		var _currencies = [];
		var _contact_settings = null;
		var _equipped_badge = null;
		var _daily_bonus = null;
		var _player_avatar = null;
		
		for(var i = 0; i < self.currencies.length; i++) {
			_currencies.push(
				new protos.Data.Player.Currency(
					{
						"name": self.currencies[i][0],
						"amount": self.currencies[i][1],
					}
				)
			);
		}
		_contact_settings = new protos.Data.Player.ContactSettings(self.contact_settings);
		_equipped_badge = new protos.Data.Player.EquippedBadge(self.equipped_badge);
		_daily_bonus = new protos.Data.Player.DailyBonus(self.daily_bonus);
		_player_avatar = new protos.Data.Player.PlayerAvatar(self.avatar);
		
		return {
			"creation_timestamp_ms": self.creation_timestamp_ms,
			"username": self.codename,
			"team": self.team,
			"tutorial_state": self.tutorial_states,
			"avatar": _player_avatar,
			"max_pokemon_storage": self.max_pokemon_storage,
			"max_item_storage": self.max_item_storage,
			"daily_bonus": _daily_bonus,
			"equipped_badge": _equipped_badge,
			"contact_settings": _contact_settings,
			"currencies": _currencies,
			"remaining_codename_claims": self.remaining_codename_claims,
			"buddy_pokemon": self.buddy_pokemon,
		}
	};
	
	self.sync = function (callback, extras) {
		if(self.synced) {
			//SAVE
		} else {
			//LOAD
			self.synced = true;
		}
		return callback(null, true, extras);
	};
	
	self.set_codename = function (codename) {
		self.codename = codename;
		return true;
	};
	
	self.add_exp = function (exp) {
		self.experience += exp;
		return true;
	};
	
	self.update_position = function (latitude, longitude, altitude) {
		self.latitude = latitude;
		self.longitude = longitude;
		self.altitude = altitude;
		return true;
	};
	
	self.get_badges = function () {
		var _badges = [];
		
		for(var i = 0; i < self.badges.length; i++) {
			_badges.push(
				new protos.Data.PlayerBadge(self.badges[i])
			);
		}
		
		return _badges;
	};
	
	self.set_avatar = function (avatar) {
		self.avatar = avatar;
		return protos.Networking.Responses.SetAvatarResponse.Status.SUCCESS;
	};
	
	self.complete_tutorial = function (state) {
		self.tutorial_states.push(state);
		return true;
	};
	
	self.set_tutorial_state = function (state) {
		self.tutorial_state = state;
		return true;
	};
	
	self.set_team = function (team_id) {
		if(self.team == 0) {
			self.team = team_id;
			return protos.Networking.Responses.SetPlayerTeamResponse.Status.SUCCESS;
		} else {
			return protos.Networking.Responses.SetPlayerTeamResponse.Status.TEAM_ALREADY_SET;
		}
	};
	
	self.set_contact_info = function (info) {
		//...
	};
	
	self.inventory.get = function () {
		var _inventory = [];
		for(var i = 0; i < self.inventory.pokemons; i++) {
			_inventory.push(
				new protos.Inventory.InventoryItem(
					{
						"modified_timestamp_ms": 0,
						"inventory_item_data": new protos.Inventory.InventoryItemData(
							{
								"pokemon_data": new protos.Data.PokemonData(self.inventory.pokemons[i].get()),
							}
						),
					}
				)
			);
		}
		for(i = 0; i < self.inventory.items; i++) {
			_inventory.push(
				new protos.Inventory.InventoryItem(
					{
						"modified_timestamp_ms": 0,
						"inventory_item_data": new protos.Inventory.InventoryItemData(
							{
								"item": new protos.Inventory.Item.ItemData(self.inventory.items[i].get()),
							}
						),
					}
				)
			);
		}
		for(i = 0; i < self.inventory.pokedex_entries; i++) {
			_inventory.push(
				new protos.Inventory.InventoryItem(
					{
						"modified_timestamp_ms": 0,
						"inventory_item_data": new protos.Inventory.InventoryItemData(
							{
								"pokedex_entry": new protos.Data.PokedexEntry(self.inventory.pokedex_entries[i].get()),
							}
						),
					}
				)
			);
		}
		
		_inventory.push(
			new protos.Inventory.InventoryItem(
				{
					"modified_timestamp_ms": 0,
					"inventory_item_data": new protos.Inventory.InventoryItemData(
						{
							"player_stats": new protos.Data.Player.PlayerStats(
								{
									"level": self.level,
									"experience": self.experience,
									"prev_level_xp": self.prev_level_xp,
									"next_level_xp": self.next_level_xp,
									"km_walked": self.km_walked,
									"pokemons_encountered": self.pokemons_encountered,
									"unique_pokedex_entries": self.unique_pokedex_entries,
									"pokemons_captured": self.pokemons_captured,
									"evolutions": self.evolutions,
									"poke_stop_visits": self.poke_stop_visits,
									"pokeballs_thrown": self.pokeballs_thrown,
									"eggs_hatched": self.eggs_hatched,
									"big_magikarp_caught": self.big_magikarp_caught,
									"battle_attack_won": self.battle_attack_won,
									"battle_attack_total": self.battle_attack_total,
									"battle_defended_won": self.battle_defended_won,
									"battle_training_won": self.battle_training_won,
									"battle_training_total": self.battle_training_total,
									"prestige_raised_total": self.prestige_raised_total,
									"prestige_dropped_total": self.prestige_dropped_total,
									"pokemon_deployed": self.pokemon_deployed,
									"pokemon_caught_by_type": self.pokemon_caught_by_type,
									"small_rattata_caught": self.small_rattata_caught,
								}
							),
						}
					),
				}
			)
		);
		
		//WIP - ...
		
		return _inventory;
	};
	
	self.inventory.recycle_item = function (item_id, count) {
		//...
	};
	
	self.inventory.use_item = function (item_id, data) {
		//...
	};
};

module.exports = object;