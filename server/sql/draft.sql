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
CREATE TABLE if not exists `v1.billingTypes` (
  `billingPayment` tinyint(1) unsigned DEFAULT NULL,
  `billingGroup` tinyint(1) unsigned DEFAULT NULL,
  `billingPrice` int(10) unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
