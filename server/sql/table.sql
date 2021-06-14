-- MySQL dump 10.18  Distrib 10.3.27-MariaDB, for debian-linux-gnueabihf (armv8l)
--
-- Host: localhost    Database: v1
-- ------------------------------------------------------
-- Server version	10.3.27-MariaDB-0+deb10u1

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

SET FOREIGN_KEY_CHECKS = 0;

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
  `billingScholarshipCode` int(10) unsigned NOT NULL DEFAULT 0,
  `billingTaxCode` int(10) unsigned NOT NULL DEFAULT 0,
  `billingRefundReason` varchar(255) DEFAULT NULL,
  `billingRefundPrice` int(10) unsigned DEFAULT NULL,
  `billingMiddleRegCode` int(10) unsigned DEFAULT 0,
  `billingUnpaidCode` int(10) unsigned DEFAULT 0,
  `billingRefundAt` date DEFAULT NULL,
  `billingRefundMiddleCode` int(10) unsigned DEFAULT NULL,
  KEY `studentID` (`studentID`),
  KEY `quarterID` (`quarterID`),
  CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `studentID` (`studentID`) ON UPDATE CASCADE,
  CONSTRAINT `billing_ibfk_2` FOREIGN KEY (`quarterID`) REFERENCES `quarter` (`quarterID`) ON UPDATE CASCADE
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
) ENGINE=InnoDB AUTO_INCREMENT=6338 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deductionsMonth`
--

DROP TABLE IF EXISTS `deductionsMonth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deductionsMonth` (
  `lessonMonth` date NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `modifiedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `version` varchar(10) NOT NULL DEFAULT 'undefined',
  `NP` int(10) unsigned DEFAULT NULL,
  `HI` int(10) unsigned DEFAULT NULL,
  `LCI` int(10) unsigned DEFAULT NULL,
  `EI` int(10) unsigned DEFAULT NULL,
  `EIC` int(10) unsigned DEFAULT NULL,
  `LIT` int(10) unsigned DEFAULT NULL,
  `SAT` int(10) unsigned DEFAULT NULL,
  `toPresident` int(10) unsigned DEFAULT NULL,
  UNIQUE KEY `lessonMonth` (`lessonMonth`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deductionsPrice`
--

DROP TABLE IF EXISTS `deductionsPrice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deductionsPrice` (
  `teacherID` int(10) unsigned NOT NULL,
  `lessonMonth` date NOT NULL,
  `NP` int(10) unsigned DEFAULT NULL,
  `NPC` int(10) unsigned DEFAULT NULL,
  `HI` int(10) unsigned DEFAULT NULL,
  `HIC` int(10) unsigned DEFAULT NULL,
  `LCI` int(10) unsigned DEFAULT NULL,
  `LCIC` int(10) unsigned DEFAULT NULL,
  `EI` int(10) unsigned DEFAULT NULL,
  `EIC` int(10) unsigned DEFAULT NULL,
  `IT` int(10) unsigned DEFAULT NULL,
  `LIT` int(10) unsigned DEFAULT NULL,
  `SAT` int(10) unsigned DEFAULT NULL,
  `deductions` int(10) unsigned DEFAULT NULL,
  `basic` int(10) unsigned DEFAULT NULL,
  `taxable` int(10) unsigned DEFAULT NULL,
  `taxFree` int(10) unsigned DEFAULT NULL,
  `proceeds` int(10) unsigned DEFAULT NULL,
  `students` int(10) unsigned DEFAULT NULL,
  `lesson` int(10) unsigned DEFAULT NULL,
  `income` int(10) unsigned DEFAULT NULL,
  `refunds` int(10) unsigned DEFAULT NULL,
  KEY `teacherID` (`teacherID`),
  CONSTRAINT `deductionsPrice_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`teacherID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
  CONSTRAINT `lesson_ibfk_2` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`teacherID`) ON UPDATE CASCADE
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
  `quarterName` varchar(255) NOT NULL DEFAULT '반 이름을 지정하세요',
  `unused` tinyint(1) NOT NULL DEFAULT 0,
  `teacherID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`quarterID`),
  KEY `teacherID` (`teacherID`),
  CONSTRAINT `quarter_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`teacherID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4;
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
) ENGINE=InnoDB AUTO_INCREMENT=726 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `studentInfo`
--

DROP TABLE IF EXISTS `studentInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studentInfo` (
  `studentID` int(10) unsigned DEFAULT NULL,
  `studentName` varchar(255) NOT NULL DEFAULT '이름없는 학생',
  `studentBirthday` date NOT NULL DEFAULT '1970-01-01',
  `studentGender` tinyint(1) NOT NULL DEFAULT 0,
  `studentPhone` varchar(20) NOT NULL DEFAULT '',
  `studentEmail` varchar(255) NOT NULL DEFAULT '',
  `studentAddress` varchar(255) NOT NULL DEFAULT '',
  `studentUniqueness` mediumtext NOT NULL DEFAULT '',
  `studentModifiedInfo` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `studentUniformNumber` int(10) unsigned DEFAULT NULL,
  `quarterID` int(10) unsigned DEFAULT NULL,
  KEY `studentID` (`studentID`),
  KEY `quarterID` (`quarterID`),
  CONSTRAINT `studentInfo_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `studentID` (`studentID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `studentInfo_ibfk_2` FOREIGN KEY (`quarterID`) REFERENCES `quarter` (`quarterID`) ON DELETE SET NULL ON UPDATE CASCADE
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
  `isForeigner` int(10) unsigned NOT NULL DEFAULT 0,
  `permission` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`teacherID`),
  UNIQUE KEY `teacherAccount` (`teacherAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacherLeaving`
--

DROP TABLE IF EXISTS `teacherLeaving`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teacherLeaving` (
  `teacherID` int(10) unsigned NOT NULL,
  `teacherJoined` timestamp NULL DEFAULT NULL,
  `teacherLeaved` timestamp NULL DEFAULT NULL,
  KEY `teacherID` (`teacherID`),
  CONSTRAINT `teacherLeaving_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`teacherID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

SET FOREIGN_KEY_CHECKS = 1;

-- Dump completed on 2021-05-20  1:09:12
