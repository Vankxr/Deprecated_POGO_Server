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
-- Table structure for table `player_data`
--

DROP TABLE IF EXISTS `player_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player_data` (
  `uid` bigint(20) unsigned NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT '{ "skin": 0, "hair": 0, "shirt": 0, "pants": 0, "hat": 0, "shoes": 0, "gender": 0, "eyes": 0, "backpack": 0 }',
  `buddy_pokemon` bigint(20) NOT NULL DEFAULT '0',
  `equipped_badge` varchar(255) NOT NULL DEFAULT '{ "badge_type": 0, "level": 0, "next_equip_change_allowed_timestamp_ms": 0 }',
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_data`
--

LOCK TABLES `player_data` WRITE;
/*!40000 ALTER TABLE `player_data` DISABLE KEYS */;
INSERT INTO `player_data` VALUES (1,'{\"skin\":2,\"hair\":3,\"shirt\":1,\"pants\":1,\"hat\":2,\"shoes\":0,\"gender\":0,\"eyes\":0,\"backpack\":1}',0,'{\"badge_type\":0,\"level\":0,\"next_equip_change_allowed_timestamp_ms\":0}'),(2,'{\"skin\":0,\"hair\":0,\"shirt\":3,\"pants\":2,\"hat\":0,\"shoes\":0,\"gender\":0,\"eyes\":0,\"backpack\":0}',0,'{\"badge_type\":0,\"level\":0,\"next_equip_change_allowed_timestamp_ms\":0}'),(3,'{\"skin\":0,\"hair\":0,\"shirt\":0,\"pants\":0,\"hat\":0,\"shoes\":0,\"gender\":0,\"eyes\":0,\"backpack\":0}',0,'{\"badge_type\":0,\"level\":0,\"next_equip_change_allowed_timestamp_ms\":0}'),(5,'{\"skin\":3,\"hair\":0,\"shirt\":2,\"pants\":0,\"hat\":0,\"shoes\":0,\"gender\":0,\"eyes\":0,\"backpack\":0}',0,'{\"badge_type\":0,\"level\":0,\"next_equip_change_allowed_timestamp_ms\":0}');
/*!40000 ALTER TABLE `player_data` ENABLE KEYS */;
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
