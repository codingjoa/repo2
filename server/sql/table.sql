-- MySQL dump 10.17  Distrib 10.3.25-MariaDB, for debian-linux-gnueabihf (armv7l)
--
-- Host: localhost    Database: ky
-- ------------------------------------------------------
-- Server version	10.3.25-MariaDB-0+deb10u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `billing`
--

DROP TABLE IF EXISTS `billing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `billing` (
  `studentID` int(10) unsigned DEFAULT NULL,
  `quarterID` int(10) unsigned DEFAULT NULL,
  `lessonMonth` date DEFAULT NULL,
  `billingPayment` tinyint(1) unsigned DEFAULT NULL,
  `billingGroup` tinyint(1) unsigned DEFAULT NULL,
  `billingPrice` int(10) unsigned DEFAULT NULL,
  `billingRetractable` tinyint(1) NOT NULL DEFAULT 1,
  KEY `studentID` (`studentID`),
  KEY `quarterID` (`quarterID`),
  CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `studentID` (`studentID`) ON UPDATE CASCADE,
  CONSTRAINT `billing_ibfk_2` FOREIGN KEY (`quarterID`) REFERENCES `quarter` (`quarterID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `billingTypes`
--

DROP TABLE IF EXISTS `billingTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `billingTypes` (
  `billingPayment` tinyint(1) unsigned DEFAULT NULL,
  `billingGroup` tinyint(1) unsigned DEFAULT NULL,
  `billingPrice` int(10) unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `checking`
--

DROP TABLE IF EXISTS `checking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checking` (
  `checkingID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quarterID` int(10) unsigned DEFAULT NULL,
  `lessonMonth` date DEFAULT NULL,
  `studyWeek` int(10) unsigned DEFAULT NULL,
  `studentID` int(10) unsigned DEFAULT NULL,
  `checkOk` tinyint(1) NOT NULL DEFAULT 0,
  `checkModified` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`checkingID`),
  KEY `quarterID` (`quarterID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `checking_ibfk_1` FOREIGN KEY (`quarterID`) REFERENCES `quarter` (`quarterID`) ON UPDATE CASCADE,
  CONSTRAINT `checking_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `studentID` (`studentID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lesson` (
  `quarterID` int(10) unsigned DEFAULT NULL,
  `lessonMonth` date DEFAULT NULL,
  `lessonEnded` tinyint(1) NOT NULL DEFAULT 0,
  `teacherID` int(10) unsigned DEFAULT NULL,
  `lessonCreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `lessonEndedAt` timestamp NULL DEFAULT NULL,
  KEY `quarterID` (`quarterID`),
  KEY `teacherID` (`teacherID`),
  CONSTRAINT `lesson_ibfk_1` FOREIGN KEY (`quarterID`) REFERENCES `quarter` (`quarterID`) ON UPDATE CASCADE,
  CONSTRAINT `lesson_ibfk_2` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`teacherID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quarter`
--

DROP TABLE IF EXISTS `quarter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quarter` (
  `quarterID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `teacherID` int(10) unsigned DEFAULT NULL,
  `quarterName` varchar(255) DEFAULT '반 이름을 지정하세요',
  `unused` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`quarterID`),
  KEY `teacherID` (`teacherID`),
  CONSTRAINT `quarter_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`teacherID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `refund`
--

DROP TABLE IF EXISTS `refund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refund` (
  `studentID` int(10) unsigned DEFAULT NULL,
  `quarterID` int(10) unsigned DEFAULT NULL,
  `lessonMonth` date DEFAULT NULL,
  `refundReason` varchar(255) DEFAULT NULL,
  `refundPercent` int(10) unsigned NOT NULL DEFAULT 100,
  KEY `studentID` (`studentID`),
  KEY `quarterID` (`quarterID`),
  CONSTRAINT `refund_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `studentID` (`studentID`) ON UPDATE CASCADE,
  CONSTRAINT `refund_ibfk_2` FOREIGN KEY (`quarterID`) REFERENCES `quarter` (`quarterID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `refundExample`
--

DROP TABLE IF EXISTS `refundExample`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refundExample` (
  `editID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `refundReason` varchar(255) NOT NULL DEFAULT '새 환불 사유',
  PRIMARY KEY (`editID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `salary`
--

DROP TABLE IF EXISTS `salary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `salary` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Price` int(10) unsigned DEFAULT NULL,
  `Tag` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `studentID`
--

DROP TABLE IF EXISTS `studentID`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studentID` (
  `studentID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `studentCreated` timestamp NOT NULL DEFAULT current_timestamp(),
  `unused` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`studentID`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `studentInfo`
--

DROP TABLE IF EXISTS `studentInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studentInfo` (
  `studentID` int(10) unsigned DEFAULT NULL,
  `studentName` varchar(255) DEFAULT '이름없는 학생',
  `studentBirthday` date DEFAULT NULL,
  `studentGender` tinyint(1) DEFAULT NULL,
  `studentPhone` varchar(20) DEFAULT NULL,
  `studentEmail` varchar(255) DEFAULT NULL,
  `studentAddress` varchar(255) DEFAULT NULL,
  `studentUniqueness` mediumtext DEFAULT NULL,
  `studentModifiedInfo` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  KEY `studentID` (`studentID`),
  CONSTRAINT `studentInfo_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `studentID` (`studentID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `study`
--

DROP TABLE IF EXISTS `study`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study` (
  `quarterID` int(10) unsigned DEFAULT NULL,
  `lessonMonth` date DEFAULT NULL,
  `lessonDate` date DEFAULT NULL,
  `studyWeek` int(10) unsigned DEFAULT NULL,
  KEY `quarterID` (`quarterID`),
  CONSTRAINT `study_ibfk_1` FOREIGN KEY (`quarterID`) REFERENCES `quarter` (`quarterID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teacher` (
  `teacherID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `teacherName` varchar(255) NOT NULL DEFAULT '교사',
  `teacherAccount` varchar(255) NOT NULL,
  `teacherPassword` varchar(255) NOT NULL,
  `teacherOp` tinyint(1) NOT NULL DEFAULT 0,
  `teacherCreated` timestamp NOT NULL DEFAULT current_timestamp(),
  `teacherModified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `teacherModifiedPassword` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `unused` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`teacherID`),
  UNIQUE KEY `teacherAccount` (`teacherAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=1232 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-31 17:29:40
