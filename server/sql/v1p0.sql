
create user if not exists ky@localhost identified by '1234';
create database if not exists v1;
grant all privileges on v1.* to ky@localhost;
flush privileges;

create table if not exists v1.studentID (
  studentID int unsigned not null AUTO_INCREMENT,
  studentCreated timestamp not null default current_timestamp,
  unused boolean not null default 0,
  primary key (studentID)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

create table if not exists v1.studentInfo (
  studentID int unsigned default null,
  studentName varchar(255) not null default '이름없는 학생',
  studentBirthday date not null default '1970-01-01',
  studentGender boolean not null default 0,
  studentPhone varchar(20) not null default '',
  studentEmail varchar(255) not null default '',
  studentAddress varchar(255) not null default '',
  studentUniqueness mediumtext not null default '',
  studentModifiedInfo timestamp not null default current_timestamp on update current_timestamp,
  studentUniformNumber int unsigned default null,
  foreign key (studentID) references studentID(studentID) on delete cascade on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists v1.teacher (
  teacherID int unsigned not null AUTO_INCREMENT,
  teacherName varchar(255) not null default '교사',
  teacherAccount varchar(255) not null,
  teacherPassword varchar(255) not null,
  teacherOp boolean not null default 0,
  teacherCreated timestamp not null default current_timestamp,
  teacherModified timestamp not null default current_timestamp on update current_timestamp,
  teacherModifiedPassword timestamp,
  unused boolean not null default 0,
  isForeigner int unsigned not null default 0,
  permission int unsigned not null default 0,
  primary key (teacherID),
  UNIQUE (teacherAccount)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

create table if not exists v1.quarter (
  quarterID int unsigned not null AUTO_INCREMENT,
  quarterName varchar(255) not null default '반 이름을 지정하세요',
  unused boolean not null default 0,
  primary key (quarterID)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists v1.lesson (
  quarterID int unsigned DEFAULT NULL,
  lessonMonth date DEFAULT NULL,
  lessonEnded boolean not null default 0,
  teacherID int unsigned DEFAULT NULL,
  lessonCreatedAt timestamp NOT NULL DEFAULT current_timestamp(),
  lessonEndedAt timestamp NULL DEFAULT NULL,
  foreign key (quarterID) REFERENCES quarter(quarterID) on update cascade,
  foreign key (teacherID) REFERENCES teacher(teacherID) on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists v1.study (
  quarterID int unsigned DEFAULT NULL,
  lessonMonth date DEFAULT NULL,
  lessonDate date DEFAULT NULL,
  studyWeek int unsigned DEFAULT NULL,
  FOREIGN KEY (quarterID) REFERENCES quarter (quarterID) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists v1.checking (
  checkingID int unsigned NOT NULL AUTO_INCREMENT,
  quarterID int unsigned DEFAULT NULL,
  lessonMonth date DEFAULT NULL,
  studyWeek int unsigned DEFAULT NULL,
  studentID int unsigned DEFAULT NULL,
  checkOk boolean NOT NULL DEFAULT 0,
  checkModified datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (checkingID),
  FOREIGN KEY (quarterID) REFERENCES quarter(quarterID) ON UPDATE CASCADE,
  FOREIGN KEY (studentID) REFERENCES studentID(studentID) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists v1.billing (
  studentID int unsigned DEFAULT NULL,
  quarterID int unsigned DEFAULT NULL,
  lessonMonth date DEFAULT NULL,
  billingPayment tinyint(1) unsigned DEFAULT NULL,
  billingGroup tinyint(1) unsigned DEFAULT NULL,
  billingPrice int unsigned DEFAULT NULL,
  billingRetractable boolean NOT NULL DEFAULT 1,
  billingScholarshipCode int unsigned not null default 0,
  billingTaxCode int unsigned not null default 0,
  FOREIGN KEY (studentID) REFERENCES studentID (studentID) ON UPDATE CASCADE,
  FOREIGN KEY (quarterID) REFERENCES quarter (quarterID) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists v1.refund (
  studentID int(10) unsigned DEFAULT NULL,
  quarterID int(10) unsigned DEFAULT NULL,
  lessonMonth date DEFAULT NULL,
  refundReason varchar(255) DEFAULT NULL,
  refundPercent int(10) unsigned NOT NULL DEFAULT 100,
  FOREIGN KEY (studentID) REFERENCES studentID (studentID) ON UPDATE CASCADE,
  FOREIGN KEY (quarterID) REFERENCES quarter (quarterID) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists v1.teacherLeaving (
  teacherID int unsigned not null,
  teacherJoined timestamp null,
  teacherLeaved timestamp null,
  foreign key (teacherID) references teacher(teacherID) on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists v1.deductionsMonth (
  lessonMonth date not null,
  createdAt timestamp not null default current_timestamp,
  modifiedAt timestamp null on update current_timestamp,
  version varchar(10) not null default 'undefined',
  NP int unsigned null,
  HI int unsigned null,
  LCI int unsigned null,
  EI int unsigned null,
  EIC int unsigned null,
  LIT int unsigned null,
  SAT int unsigned null,
  toPresident int unsigned null,
  unique (lessonMonth)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists v1.deductionsPrice (
  teacherID int unsigned not null,
  lessonMonth date not null,
  NP int unsigned null,
  NPC int unsigned null,
  HI int unsigned null,
  HIC int unsigned null,
  LCI int unsigned null,
  LCIC int unsigned null,
  EI int unsigned null,
  EIC int unsigned null,
  IT int unsigned null,
  LIT int unsigned null,
  SAT int unsigned null,
  deductions int unsigned null,
  basic int unsigned null,
  taxable int unsigned null,
  taxFree int unsigned null,
  proceeds int unsigned null,
  students int unsigned null,
  lesson int unsigned null,
  income int unsigned null,
  refunds int unsigned null,
  foreign key (teacherID) references teacher(teacherID) on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

insert into v1.teacher(
  teacherName,
  teacherAccount,
  teacherPassword,
  teacherOp
) values (
  '관리자',
  'admin',
  '$2b$10$jH8iAs4oqMZqQ14/S/anX.dPW7QodtUiLq2HcX9bBrjZtPjtEY6Fa',
  1
);
insert into v1.teacherLeaving select
  teacherID,
  concat(date_format(teacherCreated, '%Y-%m'), '-01') as teacherJoined,
  case
    when unused=1
    then concat(date_format(current_date, '%Y-%m'), '-01')
    else null
  end as teacherLeaved
from
  v1.teacher;
