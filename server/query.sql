


create table teacher(
  teacherID int unsigned not null AUTO_INCREMENT,
  teacherName varchar(255) not null default '교사',
  teacherAccount varchar(255) not null,
  teacherPassword varchar(255) not null,
  teacherOp boolean not null default 0,
  teacherCreated timestamp not null default CURRENT_TIMESTAMP,
  teacherModified timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  primary key (teacherID),
  unique (teacherAccount)
);
create table quarter(
  quarterID int unsigned not null AUTO_INCREMENT,
  teacherID int unsigned,
  quarterName varchar(255) default '반 이름을 지정하세요',
  primary key (quarterID),
  foreign key (teacherID) references teacher(teacherID) on delete set null on update cascade
);
create table student(
  studentID int unsigned not null AUTO_INCREMENT,
  quarterID int unsigned,
  studentName varchar(255) default '이름없는 학생',
  studentBirthday date,
  studentGender boolean,
  studentPhone varchar(20),
  studentEmail varchar(255),
  studentAddress varchar(255),
  studentUniqueness mediumtext,
  studentCreated timestamp not null default CURRENT_TIMESTAMP,
  studentModified timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  primary key (studentID),
  foreign key (quarterID) references quarter(quarterID) on delete set null on update cascade
);
create table study(
  studyID int unsigned not null AUTO_INCREMENT,
  teacherID int unsigned,
  quarterID int unsigned,
  studyDate date not null default CURRENT_DATE,
  primary key (studyID),
  foreign key (teacherID) references teacher(teacherID) on delete set null on update cascade,
  foreign key (quarterID) references quarter(quarterID) on delete set null on update cascade
);
create table checking(
  checkingID int unsigned not null AUTO_INCREMENT,
  studyID int unsigned,
  studentID int unsigned,
  checkOk boolean not null default 0,
  checkModified datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  primary key (checkingID),
  foreign key (studyID) references study(studyID) on delete set null on update cascade,
  foreign key (studentID) references student(studentID) on delete set null on update cascade
);




insert into teacher(
  teacherID,
  teacherName,
  teacherAccount,
  teacherPassword,
  teacherOp
) values (
  1000,
  '윤창균',
  'ky',
  '1234',
  1
);

비밀번호 변경
update teacher set teacherPassword=1212 where teacherID=1;
update teacher set teacherID=1212 where teacherID=1000;

select * from quarter;
delete from teacher where teacherID=1002;
select * from quarter;

insert into quarter(
  teacherID
) values (
  1000
);
insert into quarter(
  teacherID
) values (
  1212
);



insert into student(
  quarterID
) values (
  5
);

create table student(
  studentID int unsigned not null AUTO_INCREMENT,
  quarterID int unsigned,
  studentName varchar(255) default '이름없는 학생',
  studentBirthday date,
  studentGender boolean,
  studentPhone varchar(20),
  studentEmail varchar(255),
  studentAddress varchar(255),
  studentUniqueness mediumtext,
  studentCreated timestamp not null default CURRENT_TIMESTAMP,
  studentModified timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  primary key (studentID),
  foreign key (quarterID) references quarter(quarterID) on delete set null on update cascade
);

create table study(
  studyID int unsigned not null AUTO_INCREMENT,
  teacherID int unsigned,
  quarterID int unsigned,
  studyDate date not null default CURRENT_DATE,
  primary key (studyID),
  foreign key (teacherID) references teacher(teacherID) on delete set null on update cascade,
  foreign key (quarterID) references quarter(quarterID) on delete set null on update cascade
);

create table checking(
  checkingID int unsigned not null AUTO_INCREMENT,
  studyID int unsigned,
  studentID int unsigned,
  checkTime time not null default CURRENT_TIME,
  primary key (checkingID),
  foreign key (studyID) references study(studyID) on delete set null on update cascade,
  foreign key (studentID) references student(studentID) on delete set null on update cascade
);





alter table admin_members convert to character set utf8;
