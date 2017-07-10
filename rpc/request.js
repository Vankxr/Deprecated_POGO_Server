const fs 	= require('fs');
const util	= require('util');
const s2 = require('s2-geometry').S2;

const protos	= require('../proto/index.js');
const db 		= require('../db/index.js');
const models 	= require('../models/index.js');
const output 	= require('../logger.js');

var pokemon 		= models.pokemon.data;
var wild_pokemon 	= models.pokemon.wild;
var nearby_pokemon	= models.pokemon.nearby;
var map_pokemon		= models.pokemon.map;

var player = models.player;

var inventory_item 			= models.inventory.item;
var inventory_candy 		= models.inventory.candy;
var inventory_egg_incubator = models.inventory.egg_incubator;
var inventory_pokedex_entry = models.inventory.pokedex_entry;
var inventory_upgrade		= models.inventory.inventory_upgrade;

var cell 		= models.map.cell;
var pokestop	= models.map.pokestop;
var gym 		= models.map.gym;
var spawnpoint	= models.map.spawnpoint;

var loaded_cells = [];

function clear_loaded_cells() {
	for(var i = 0; i < loaded_cells.length; i++) {
		if(loaded_cells[i].last_request_timestamp_ms < now() - 300000) {
			output("MAP: Cell #" + loaded_cells[i].id + " timed out!", 7);
			loaded_cells[i] = undefined;
		}
	}
}

function get_cell_by_id(id) {
	for(var i = 0; i < loaded_cells.length; i++) {
		if(loaded_cells[i] && loaded_cells[i].id) {
			if(loaded_cells[i].id.toString() == id.toString()) {
				return loaded_cells[i];
			}
		}
	}
	return false;
}

function get_fort_by_id(id) {
	var id = id.split(".");
	var cell_id = id[0];
	var fort_id = parseInt(id[1]);
	if(cell_id && fort_id) {
		var cell = get_cell_by_id(cell_id);
		if(cell && cell.forts && cell.forts.length > 0) {
			for(var i = 0; i < cell.forts.length; i++) {
				if(cell.forts[i].id == fort_id) {
					return cell.forts[i];
				}
			}
			return false;
		}
		return false;
	}
	return false;
}

function now() {
	return new Date().getTime();
}

module.exports = {
	parser: function (requests) {
		var parsed_requests = [];
		if(requests && requests.length > 0) {
			for(var i = 0; i < requests.length; i++) {
				var request = requests[i];
				var parsed_request;
				
				if(request && request.request_type && request.request_message) {
					switch(parseInt(request.request_type)) {
						case protos.Networking.Requests.RequestType.PLAYER_UPDATE:
							try {
								parsed_request = protos.Networking.Requests.Messages.PlayerUpdateMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_PLAYER:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetPlayerMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_INVENTORY:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetInventoryMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.DOWNLOAD_SETTINGS:
							try {
								parsed_request = protos.Networking.Requests.Messages.DownloadSettingsMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.DOWNLOAD_ITEM_TEMPLATES:
							try {
								parsed_request = protos.Networking.Requests.Messages.DownloadItemTemplatesMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.DOWNLOAD_REMOTE_CONFIG_VERSION:
							try {
								parsed_request = protos.Networking.Requests.Messages.DownloadRemoteConfigVersionMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.FORT_SEARCH:
							try {
								parsed_request = protos.Networking.Requests.Messages.FortSearchMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.ENCOUNTER:
							try {
								parsed_request = protos.Networking.Requests.Messages.EncounterMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.CATCH_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.CatchPokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.FORT_DETAILS:
							try {
								parsed_request = protos.Networking.Requests.Messages.FortDetailsMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.ITEM_USE:
							parsed_requests.push(request.request_message);
						break;
						case protos.Networking.Requests.RequestType.GET_MAP_OBJECTS:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetMapObjectsMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.FORT_DEPLOY_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.FortDeployPokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.FORT_RECALL_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.FortRecallPokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.RELEASE_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.ReleasePokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.USE_ITEM_POTION:
							try {
								parsed_request = protos.Networking.Requests.Messages.UseItemPotionMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.USE_ITEM_CAPTURE:
							try {
								parsed_request = protos.Networking.Requests.Messages.UseItemCaptureMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.USE_ITEM_FLEE:
							parsed_requests.push(request.request_message);
						break;
						case protos.Networking.Requests.RequestType.USE_ITEM_REVIVE:
							try {
								parsed_request = protos.Networking.Requests.Messages.UseItemReviveMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.TRADE_SEARCH:
						case protos.Networking.Requests.RequestType.TRADE_OFFER:
						case protos.Networking.Requests.RequestType.TRADE_RESPONSE:
						case protos.Networking.Requests.RequestType.TRADE_RESULT:
							parsed_requests.push(request.request_message);
						break;
						case protos.Networking.Requests.RequestType.GET_PLAYER_PROFILE:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetPlayerProfileMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_ITEM_PACK:
						case protos.Networking.Requests.RequestType.BUY_ITEM_PACK:
						case protos.Networking.Requests.RequestType.BUY_GEM_PACK:
							parsed_requests.push(request.request_message);
						break;
						case protos.Networking.Requests.RequestType.EVOLVE_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.EvolvePokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_HATCHED_EGGS:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetHatchedEggsMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.ENCOUNTER_TUTORIAL_COMPLETE:
							try {
								parsed_request = protos.Networking.Requests.Messages.EncounterTutorialCompleteMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.LEVEL_UP_REWARDS:
							try {
								parsed_request = protos.Networking.Requests.Messages.LevelUpRewardsMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.CHECK_AWARDED_BADGES:
							try {
								parsed_request = protos.Networking.Requests.Messages.CheckAwardedBadgesMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.USE_ITEM_GYM:
							try {
								parsed_request = protos.Networking.Requests.Messages.UseItemGymMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_GYM_DETAILS:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetGymDetailsMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.START_GYM_BATTLE:
							try {
								parsed_request = protos.Networking.Requests.Messages.StartGymBattleMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.ATTACK_GYM:
							try {
								parsed_request = protos.Networking.Requests.Messages.AttackGymMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.RECYCLE_INVENTORY_ITEM:
							try {
								parsed_request = protos.Networking.Requests.Messages.RecycleInventoryItemMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.COLLECT_DAILY_BONUS:
							try {
								parsed_request = protos.Networking.Requests.Messages.CollectDailyBonusMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.USE_ITEM_XP_BOOST:
							try {
								parsed_request = protos.Networking.Requests.Messages.UseItemXpBoostMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.USE_ITEM_EGG_INCUBATOR:
							try {
								parsed_request = protos.Networking.Requests.Messages.UseItemEggIncubatorMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.USE_INCENSE:
							try {
								parsed_request = protos.Networking.Requests.Messages.UseIncenseMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_INCENSE_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetIncensePokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.INCENSE_ENCOUNTER:
							try {
								parsed_request = protos.Networking.Requests.Messages.IncenseEncounterMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.ADD_FORT_MODIFIER:
							try {
								parsed_request = protos.Networking.Requests.Messages.AddFortModifierMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.DISK_ENCOUNTER:
							try {
								parsed_request = protos.Networking.Requests.Messages.DiskEncounterMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.COLLECT_DAILY_DEFENDER_BONUS:
							try {
								parsed_request = protos.Networking.Requests.Messages.CollectDailyDefenderBonusMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.UPGRADE_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.UpgradePokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.SET_FAVORITE_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.SetFavoritePokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.NICKNAME_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.NicknamePokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.EQUIP_BADGE:
							try {
								parsed_request = protos.Networking.Requests.Messages.EquipBadgeMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.SET_CONTACT_SETTINGS:
							try {
								parsed_request = protos.Networking.Requests.Messages.SetContactSettingsMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.SET_BUDDY_POKEMON:
							try {
								parsed_request = protos.Networking.Requests.Messages.SetBuddyPokemonMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_BUDDY_WALKED:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetBuddyWalkedMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_ASSET_DIGEST:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetAssetDigestMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_DOWNLOAD_URLS:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetDownloadUrlsMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.GET_SUGGESTED_CODENAMES:
							try {
								parsed_request = protos.Networking.Requests.Messages.GetSuggestedCodenamesMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.CHECK_CODENAME_AVAILABLE:
							try {
								parsed_request = protos.Networking.Requests.Messages.CheckCodenameAvailableMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.CLAIM_CODENAME:
							try {
								parsed_request = protos.Networking.Requests.Messages.ClaimCodenameMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.SET_AVATAR:
							try {
								parsed_request = protos.Networking.Requests.Messages.SetAvatarMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.SET_PLAYER_TEAM:
							try {
								parsed_request = protos.Networking.Requests.Messages.SetPlayerTeamMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.MARK_TUTORIAL_COMPLETE:
							try {
								parsed_request = protos.Networking.Requests.Messages.MarkTutorialCompleteMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.LOAD_SPAWN_POINTS:
							parsed_requests.push(request.request_message);
						break;
						case protos.Networking.Requests.RequestType.CHECK_CHALLENGE:
							try {
								parsed_request = protos.Networking.Requests.Messages.CheckChallengeMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.VERIFY_CHALLENGE:
							try {
								parsed_request = protos.Networking.Requests.Messages.VerifyChallengeMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.ECHO:
							try {
								parsed_request = protos.Networking.Requests.Messages.EchoMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.DEBUG_UPDATE_INVENTORY:
						case protos.Networking.Requests.RequestType.DEBUG_DELETE_PLAYER:
							parsed_requests.push(request.request_message);
						break;
						case protos.Networking.Requests.RequestType.SFIDA_REGISTRATION:
							parsed_requests.push(request.request_message);
						break;
						case protos.Networking.Requests.RequestType.SFIDA_ACTION_LOG:
							try {
								parsed_request = protos.Networking.Requests.Messages.SfidaActionLogMessage.decode(request.request_message);
							} catch (e) {
								return false;
							}
							
							if(parsed_request) {
								parsed_requests.push({ request_type: request.request_type, request_message: parsed_request });
							} else {
								return false;
							}
						break;
						case protos.Networking.Requests.RequestType.SFIDA_CERTIFICATION:
						case protos.Networking.Requests.RequestType.SFIDA_UPDATE:
						case protos.Networking.Requests.RequestType.SFIDA_ACTION:
						case protos.Networking.Requests.RequestType.SFIDA_DOWSER:
						case protos.Networking.Requests.RequestType.SFIDA_CAPTURE:
							parsed_requests.push(request.request_message);
						break;
						default:
							return false;
						break;
					}
				} else {
					return false;
				}
			}
		}
		return parsed_requests;
	},
	processor: function (request_player, request, callback, extras) {
		if(request && request.request_type && request.request_message) {
			var handled_request = null;
			switch(parseInt(request.request_type)) {
				case protos.Networking.Requests.RequestType.PLAYER_UPDATE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_PLAYER:
					handled_request = new protos.Networking.Responses.GetPlayerResponse(
						{
							"success": true,
							"player_data": new protos.Data.PlayerData(request_player.get()),
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_INVENTORY:
					handled_request = new protos.Networking.Responses.GetInventoryResponse(
						{
							"success": true,
							"inventory_delta": new protos.Inventory.InventoryDelta(
								{
									"original_timestamp_ms": 0,
									"new_timestamp_ms": 0,
									"inventory_items": request_player.inventory.get(),
								}
							), 
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.DOWNLOAD_SETTINGS:
					handled_request = new protos.Networking.Responses.DownloadSettingsResponse(
						{
							"error": "",
							"hash": "45c75273223afaccd4ffa75c887aa7cacdcc8319",
							"settings": new protos.Settings.GlobalSettings(
								{
									"fort_settings": new protos.Settings.FortSettings(
										{
											"interaction_range_meters": 40,
											"max_total_deployed_pokemon": 10,
											"max_player_deployed_pokemon": 1,
											"deploy_stamina_multiplier": 2,
											"deploy_attack_multiplier": 0,
											"far_interaction_range_meters": 1000,
										}
									),
									"map_settings": new protos.Settings.MapSettings(
										{
											"pokemon_visible_range": 70,
											"poke_nav_range_meters": 750,
											"encounter_range_meters": 50,
											"get_map_objects_min_refresh_seconds": 10,
											"get_map_objects_max_refresh_seconds": 30,
											"get_map_objects_min_distance_meters": 10,
											"google_maps_api_key": "AIzaSyDF9rkP8lhcddBtvH9gVFzjnNo13WtmJIM",
										}
									),
									"level_settings": null,
									"inventory_settings": new protos.Settings.InventorySettings(
										{
											"max_pokemon": 9999,
											"max_bag_items": 9999,
											"base_pokemon": 250,
											"base_bag_items": 350,
											"base_eggs": 9,
										}
									),
									"minimum_client_version": "0.35.0",
									"gps_settings": null,
								}
							),
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.DOWNLOAD_ITEM_TEMPLATES:
					var content = fs.readFileSync(__dirname + '/../assets/game_master');
					
					handled_request = protos.Networking.Responses.DownloadItemTemplatesResponse.decode(content);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.DOWNLOAD_REMOTE_CONFIG_VERSION:
					handled_request = new protos.Networking.Responses.DownloadRemoteConfigVersionResponse(
						{
							"result": protos.Networking.Responses.DownloadRemoteConfigVersionResponse.Result.SUCCESS,
							"item_templates_timestamp_ms": 1473530092106,
							"asset_digest_timestamp_ms": 1467338276561000,
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.FORT_SEARCH:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.ENCOUNTER:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.CATCH_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.FORT_DETAILS:
					var current_fort = get_fort_by_id(request.request_message.fort_id);
					if(current_fort) {
						handled_request = new protos.Networking.Responses.FortDetailsResponse(current_fort.get_details());
					}
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.ITEM_USE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_MAP_OBJECTS:
					var request_cell = s2.keyToId(s2.latLngToKey(request.request_message.latitude, request.request_message.longitude, 15));
					var valid_request = false;
					console.log("MAP_REQUEST_CELL: " + request_cell + " - LAT/LNG: " + request.request_message.latitude.toFixed(6) + "/" + request.request_message.longitude.toFixed(6)) //DEBUG
					for(var c = 0; c < request.request_message.cell_id.length; c++) {
						if(request.request_message.cell_id[c].toString() == request_cell.toString()) {
							valid_request = true;
							break;
						}
					}
					if(valid_request) {
						var map_cells = [];
						
						function load_cells() {
							var current_cell_id = request.request_message.cell_id[0];
							var current_cell = get_cell_by_id(current_cell_id);
							var last_cell = (request.request_message.cell_id.length === 1);
							
							if(current_cell) {
								current_cell.last_request_timestamp_ms = now();
								map_cells.push(new protos.Map.MapCell(current_cell.get()));
								request.request_message.cell_id.splice(0, 1);
								
								if(last_cell) {
									handled_request = new protos.Networking.Responses.GetMapObjectsResponse(
										{
											"status": protos.Map.MapObjectsStatus.SUCCESS,
											"map_cells": map_cells,
										}
									);
									
									return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
								} else {
									return load_cells();
								}
							} else {
								current_cell = new cell();
								current_cell.id = current_cell_id;
								current_cell.last_request_timestamp_ms = now();
								current_cell.sync(
									function (e, synced, data) {
										if(e) {
											output("ERROR: Failed to sync map cell! Message: '" + e + "'", 1);
										} else if(synced) {
											output("MAP: Cell #" + data[0].id + " synced!", 7);
											map_cells.push(new protos.Map.MapCell(data[0].get()));
											request.request_message.cell_id.splice(0, 1);
										}
										
										if(data[1]) {
											handled_request = new protos.Networking.Responses.GetMapObjectsResponse(
												{
													"status": protos.Map.MapObjectsStatus.SUCCESS,
													"map_cells": map_cells,
												}
											);
											
											return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
										} else {
											return load_cells();
										}
									},
									[current_cell, last_cell]
								);
								loaded_cells.push(current_cell);
							}
						}
						
						load_cells();
					} else {
						handled_request = new protos.Networking.Responses.GetMapObjectsResponse(
							{
								"status": protos.Map.MapObjectsStatus.LOCATION_UNSET,
								"map_cells": [],
							}
						);
						
						return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
					}
				break;
				case protos.Networking.Requests.RequestType.FORT_DEPLOY_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.FORT_RECALL_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.RELEASE_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.USE_ITEM_POTION:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.USE_ITEM_CAPTURE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.USE_ITEM_FLEE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.USE_ITEM_REVIVE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.TRADE_SEARCH:
				case protos.Networking.Requests.RequestType.TRADE_OFFER:
				case protos.Networking.Requests.RequestType.TRADE_RESPONSE:
				case protos.Networking.Requests.RequestType.TRADE_RESULT:
					handled_request = null;
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_PLAYER_PROFILE:
					handled_request = new protos.Networking.Responses.GetPlayerProfileResponse(
						{
							"result": protos.Networking.Responses.GetPlayerProfileResponse.Result.SUCCESS,
							"start_time": request_player.creation_timestamp_ms,
							"badges": request_player.get_badges(),
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_ITEM_PACK:
				case protos.Networking.Requests.RequestType.BUY_ITEM_PACK:
				case protos.Networking.Requests.RequestType.BUY_GEM_PACK:
					handled_request = null;
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.EVOLVE_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_HATCHED_EGGS:
					handled_request = new protos.Networking.Responses.GetHatchedEggsResponse(
						{
							"success": true,
							"pokemon_id": [],
							"experience_awarded": [],
							"candy_awarded": [],
							"stardust_awarded": [],
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.ENCOUNTER_TUTORIAL_COMPLETE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.LEVEL_UP_REWARDS:
					handled_request = new protos.Networking.Responses.LevelUpRewardsResponse(
						{
							"result": protos.Networking.Responses.LevelUpRewardsResponse.Result.ALREADY_AWARDED,
							"items_awarded": [],
							"items_unlocked": [],
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.CHECK_AWARDED_BADGES:
					handled_request = new protos.Networking.Responses.CheckAwardedBadgesResponse(
						{
							"success": true,
							"awarded_badges": [],
							"awarded_badge_levels": [],
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.USE_ITEM_GYM:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_GYM_DETAILS:
					var current_fort = get_fort_by_id(request.request_message.fort_id);
					if(current_fort) {
						//handled_request = new protos.Networking.Responses.GetGymDetailsResponse(current_fort.get_details());
					}
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.START_GYM_BATTLE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.ATTACK_GYM:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.RECYCLE_INVENTORY_ITEM:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.COLLECT_DAILY_BONUS:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.USE_ITEM_XP_BOOST:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.USE_ITEM_EGG_INCUBATOR:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.USE_INCENSE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_INCENSE_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.INCENSE_ENCOUNTER:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.ADD_FORT_MODIFIER:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.DISK_ENCOUNTER:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.COLLECT_DAILY_DEFENDER_BONUS:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.UPGRADE_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.SET_FAVORITE_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.NICKNAME_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.EQUIP_BADGE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.SET_CONTACT_SETTINGS:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.SET_BUDDY_POKEMON:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_BUDDY_WALKED:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_ASSET_DIGEST:
					var content = null;
					
					request_player.platform = parseInt(request.request_message.platform);
					
					switch(parseInt(request.request_message.platform)) {
						case protos.Enums.Platform.ANDROID:
							content = fs.readFileSync(__dirname + '/../assets/android/asset_digest');
						break;
						case protos.Enums.Platform.IOS:
							content = fs.readFileSync(__dirname + '/../assets/ios/asset_digest');
						break;
					}
					
					handled_request = protos.Networking.Responses.GetAssetDigestResponse.decode(content);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_DOWNLOAD_URLS:
					var content = null;
					var platform = "";
					var assets = null;
					var request_assets = request.request_message.asset_id;
					var download_urls = [];
					
					switch(parseInt(request_player.platform)) {
						case protos.Enums.Platform.ANDROID:
							platform = "android";
							content = fs.readFileSync(__dirname + '/../assets/android/asset_digest');
						break;
						case protos.Enums.Platform.IOS:
							platform = "ios";
							content = fs.readFileSync(__dirname + '/../assets/ios/asset_digest');
						break;
					}
					
					assets = protos.Networking.Responses.GetAssetDigestResponse.decode(content);
					
					for(var i = 0; i < request_asset.length; i++) {
						var request_asset = request_assets[i];
						for(var j = 0; j < assets.digest.length; j++) {
							var asset = assets.digest[j];
							if(asset.asset_id == request_asset.asset_id) {
								download_urls.push(
									new protos.Data.DownloadUrlEntry(
										{
											"asset_id": asset.asset_id,
											"url": "https://10.65.177.3:8080/assets/" + platform + "/" + asset.bundle_name,
											"size": asset.size,
											"checksum": asset.checksum,
										}
									)
								);
							}
						}
					}
					
					handled_request = new protos.Networking.Responses.GetDownloadUrlsResponse(
						{
							"download_urls": download_urls,
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.GET_SUGGESTED_CODENAMES:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.CHECK_CODENAME_AVAILABLE:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.CLAIM_CODENAME:
					
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.SET_AVATAR:
					handled_request = new protos.Networking.Responses.SetAvatarResponse(
						{
							"status": request_player.set_avatar(request.request_message.player_avatar),
							"player_data": new protos.Data.PlayerData(request_player.get()),
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.SET_PLAYER_TEAM:
					handled_request = new protos.Networking.Responses.SetPlayerTeamResponse(
						{
							"status": request_player.set_team(request.request_message.team),
							"player_data": new protos.Data.PlayerData(request_player.get()),
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.MARK_TUTORIAL_COMPLETE:
					for(var i = 0; i < request.request_message.tutorials_completed.length; i++) {
						request_player.complete_tutorial(request.request_message.tutorials_completed[i]);
					}
					
					handled_request = new protos.Networking.Responses.MarkTutorialCompleteResponse(
						{
							"success": true,
							"player_data": new protos.Data.PlayerData(request_player.get()),
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.LOAD_SPAWN_POINTS:
					handled_request = null;
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.CHECK_CHALLENGE:
					handled_request = new protos.Networking.Responses.CheckChallengeResponse(
						{
							"show_challenge": false,
							"challenge_url": "",
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.VERIFY_CHALLENGE:
					handled_request = new protos.Networking.Responses.VerifyChallengeResponse(
						{
							"success": true,
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.ECHO:
					handled_request = new protos.Networking.Responses.EchoResponse(
						{
							"context": "Pokemon GO Custom Server",
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.DEBUG_UPDATE_INVENTORY:
				case protos.Networking.Requests.RequestType.DEBUG_DELETE_PLAYER:
					handled_request = null;
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.SFIDA_REGISTRATION:
					handled_request = null;
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.SFIDA_ACTION_LOG:
					handled_request = new protos.Networking.Responses.SfidaActionLogResponse(
						{
							"result": protos.Networking.Responses.SfidaActionLogResponse.Result.SUCCESS,
							"log_entries": [], //TBD
						}
					);
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				case protos.Networking.Requests.RequestType.SFIDA_CERTIFICATION:
				case protos.Networking.Requests.RequestType.SFIDA_UPDATE:
				case protos.Networking.Requests.RequestType.SFIDA_ACTION:
				case protos.Networking.Requests.RequestType.SFIDA_DOWSER:
				case protos.Networking.Requests.RequestType.SFIDA_CAPTURE:
					handled_request = null;
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
				default:
					handled_request = null;
					
					return callback(null, handled_request === null ? new Buffer("") : handled_request.encode().toBuffer(), extras);
				break;
			}
		} else {
			return callback(null, false, extras);
		}
	},
}

setInterval(clear_loaded_cells, 60000);