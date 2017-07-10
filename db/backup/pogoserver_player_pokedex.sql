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
-- Table structure for table `player_pokedex`
--

DROP TABLE IF EXISTS `player_pokedex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player_pokedex` (
  `uid` bigint(20) unsigned NOT NULL,
  `pokemon_id` int(3) NOT NULL,
  `times_encountered` int(10) unsigned NOT NULL DEFAULT '0',
  `times_captured` int(10) unsigned NOT NULL DEFAULT '0',
  `candy` int(20) unsigned NOT NULL DEFAULT '0',
  UNIQUE KEY `uid_pokemonid` (`uid`,`pokemon_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_pokedex`
--

LOCK TABLES `player_pokedex` WRITE;
/*!40000 ALTER TABLE `player_pokedex` DISABLE KEYS */;
INSERT INTO `player_pokedex` VALUES (1,144,1,1,9382),(1,145,4,3,5360),(1,146,1,1,2434),(1,151,2,2,2236),(1,150,3,3,9884),(3,144,1,1,7),(1,26,1,1,0),(1,133,2,2,9),(1,69,0,0,3),(1,140,1,1,4),(1,89,1,1,0),(1,71,2,1,0),(1,25,1,1,6),(1,77,1,1,3),(1,83,1,1,3),(1,127,1,0,0),(1,5,1,1,0),(1,129,2,2,9),(1,17,2,2,0),(1,84,1,1,6),(1,58,1,1,3),(1,33,1,1,0),(1,132,1,1,3),(1,92,1,1,6),(1,54,1,1,3),(1,130,1,1,0),(1,122,1,1,3),(1,50,1,1,3),(3,133,3,1,6),(1,20,1,0,0),(3,15,1,1,0),(3,13,1,1,7),(1,15,1,1,0),(1,13,0,0,3),(3,139,1,1,0),(3,138,0,0,4),(3,74,1,1,8),(1,82,1,1,0),(1,81,1,1,6),(3,3,1,1,0),(3,1,0,0,4),(3,55,2,2,0),(3,54,0,0,7),(3,106,1,1,4),(1,105,2,2,0),(3,105,1,1,0),(3,104,1,1,7),(1,104,2,2,12),(1,46,2,2,9),(3,46,2,2,10),(1,16,0,0,3),(3,17,1,1,0),(3,16,1,1,10),(1,47,1,1,0),(3,145,2,2,7),(2,92,1,1,3),(2,140,1,1,3),(1,85,1,1,0),(1,35,1,1,3),(1,111,1,1,3),(1,106,1,1,3),(1,135,1,1,0),(1,30,1,1,0),(1,29,0,0,3),(1,76,2,2,0),(1,74,0,0,6),(3,150,1,1,3),(3,50,1,1,4),(3,68,1,1,0),(3,66,0,0,8),(3,100,2,1,4),(3,35,1,1,3),(3,151,1,1,3),(1,41,1,1,3),(3,41,1,1,4),(3,121,2,2,0),(3,120,0,0,8),(3,37,1,1,10),(1,37,1,0,0),(3,31,1,1,0),(3,29,0,0,3),(3,67,1,1,0),(3,59,3,3,0),(3,58,0,0,11),(3,114,1,1,3),(3,44,1,1,0),(3,43,1,1,6),(3,89,2,2,0),(3,88,0,0,7),(1,96,1,1,3),(1,101,1,1,0),(1,100,0,0,3),(1,22,1,1,0),(1,21,0,0,3),(1,3,1,1,0),(1,1,0,0,3),(1,93,1,1,0),(3,123,1,1,4),(3,60,1,1,4),(3,116,2,1,11),(3,141,2,2,0),(3,140,0,0,7),(3,117,2,2,0),(3,127,1,1,3),(3,47,1,1,0),(3,65,1,1,0),(3,63,0,0,3),(3,91,1,1,0),(3,90,0,0,3),(3,86,1,1,3),(3,135,1,1,0),(3,8,1,1,0),(3,7,0,0,3),(3,76,1,1,0),(3,38,1,2,0),(3,129,1,2,6),(3,18,1,1,0),(3,33,1,1,0),(3,32,0,0,3);
/*!40000 ALTER TABLE `player_pokedex` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-12 13:07:19
