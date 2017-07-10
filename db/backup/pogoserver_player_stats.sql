-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pogoserver
-- ------------------------------------------------------
-- Server version	5.7.13-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `player_stats`
--

DROP TABLE IF EXISTS `player_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player_stats` (
  `uid` bigint(20) unsigned NOT NULL,
  `experience` int(10) unsigned NOT NULL DEFAULT '0',
  `level` int(3) NOT NULL DEFAULT '1',
  `team` tinyint(1) NOT NULL DEFAULT '0',
  `km_walked` float NOT NULL DEFAULT '0',
  `pokemons_encountered` int(10) unsigned NOT NULL DEFAULT '0',
  `evolutions` int(10) unsigned NOT NULL DEFAULT '0',
  `poke_stop_visits` int(10) unsigned DEFAULT '0',
  `pokeballs_thrown` int(10) unsigned NOT NULL DEFAULT '0',
  `eggs_hatched` int(10) unsigned NOT NULL DEFAULT '0',
  `big_magikarp_caught` int(10) unsigned NOT NULL DEFAULT '0',
  `battle_attack_won` int(10) unsigned NOT NULL DEFAULT '0',
  `battle_attack_total` int(10) unsigned NOT NULL DEFAULT '0',
  `battle_defended_won` int(10) unsigned NOT NULL DEFAULT '0',
  `battle_training_won` int(10) unsigned NOT NULL DEFAULT '0',
  `battle_training_total` int(10) unsigned NOT NULL DEFAULT '0',
  `prestige_raised_total` bigint(20) unsigned NOT NULL DEFAULT '0',
  `prestige_dropped_total` bigint(20) unsigned NOT NULL DEFAULT '0',
  `pokemon_deployed` int(10) unsigned NOT NULL DEFAULT '0',
  `pokemon_caught_by_type` text NOT NULL,
  `small_rattata_caught` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_stats`
--

LOCK TABLES `player_stats` WRITE;
/*!40000 ALTER TABLE `player_stats` DISABLE KEYS */;
INSERT INTO `player_stats` VALUES (1,48042060,40,1,2.32,0,0,75,0,0,0,0,0,0,0,0,0,0,0,'[]',0),(2,4680,3,0,0.252,0,0,13,0,0,0,0,0,0,0,0,0,0,0,'[]',0),(3,20030869,40,3,5.183,0,0,69,0,0,0,0,0,0,0,0,0,0,0,'[]',0),(5,0,1,0,0.01,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'[]',0);
/*!40000 ALTER TABLE `player_stats` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-12 13:07:18
