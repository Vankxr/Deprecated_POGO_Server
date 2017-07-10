module.exports = {
	map: {
		cell: require('./map/cell.js'),
		gym: require('./map/gym.js'),
		pokestop: require('./map/pokestop.js'),
		spawnpoint: require('./map/spawnpoint.js'),
	},
	player: require('./player/player.js'),
	pokemon: {
		data: require('./pokemon/data.js'),
		nearby: require('./pokemon/nearby.js'),
		wild: require('./pokemon/wild.js'),
		map: require('./pokemon/map.js'),
	},
	inventory: {
		item: require('./inventory/item.js'),
		pokedex_entry: require('./inventory/pokedex_entry.js'),
		candy: require('./inventory/candy.js'),
		egg_incubator: require('./inventory/egg_incubator.js'),
		inventory_upgrade: require('./inventory/inventory_upgrade.js'),
	},
}