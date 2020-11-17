-- Server version	10.3.25-MariaDB-0+deb10u1


--- ky 계정 생성
create user if not exists ky@localhost identified by '1234';
--- v1 데이터베이스 생성
create database if not exists v1;
--- 권한 부여
grant insert, select, update on v1.* to ky@localhost;
flush privileges;
--- 테이블 생성
CREATE TABLE if not exists `v1.billing` (
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
CREATE TABLE if not exists `v1.billingTypes` (
  `billingPayment` tinyint(1) unsigned DEFAULT NULL,
  `billingGroup` tinyint(1) unsigned DEFAULT NULL,
  `billingPrice` int(10) unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE if not exists `v1.checking` (
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
CREATE TABLE if not exists `v1.lesson` (
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
CREATE TABLE if not exists `v1.quarter` (
  `quarterID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `teacherID` int(10) unsigned DEFAULT NULL,
  `quarterName` varchar(255) DEFAULT '반 이름을 지정하세요',
  `unused` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`quarterID`),
  KEY `teacherID` (`teacherID`),
  CONSTRAINT `quarter_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`teacherID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
CREATE TABLE if not exists `v1.refund` (
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
CREATE TABLE if not exists `v1.refundExample` (
  `editID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `refundReason` varchar(255) NOT NULL DEFAULT '새 환불 사유',
  PRIMARY KEY (`editID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
CREATE TABLE if not exists `v1.salary` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Price` int(10) unsigned DEFAULT NULL,
  `Tag` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
CREATE TABLE if not exists `v1.studentID` (
  `studentID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `studentCreated` timestamp NOT NULL DEFAULT current_timestamp(),
  `unused` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`studentID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
CREATE TABLE if not exists `v1.studentInfo` (
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
CREATE TABLE if not exists `v1.study` (
  `quarterID` int(10) unsigned DEFAULT NULL,
  `lessonMonth` date DEFAULT NULL,
  `lessonDate` date DEFAULT NULL,
  `studyWeek` int(10) unsigned DEFAULT NULL,
  KEY `quarterID` (`quarterID`),
  CONSTRAINT `study_ibfk_1` FOREIGN KEY (`quarterID`) REFERENCES `quarter` (`quarterID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE if not exists `v1.teacher` (
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
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


--- 아래 쿼리는 수정중
insert into teacher(
  teacherName,
  teacherAccount,
  teacherPassword,
  teacherOp
) values (
  '관리자',
  'admin',
  '$2b$10$jH8iAs4oqMZqQ14/S/anX.dPW7QodtUiLq2HcX9bBrjZtPjtEY6Fa',
  1
)
