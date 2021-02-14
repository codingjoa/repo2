create table if not exists v1.teacherLeaving (
  teacherID int unsigned not null,
  teacherJoined timestamp null,
  teacherLeaved timestamp null,
  foreign key (teacherID) references teacher(teacherID) on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

create table if not exists v1.deductionsMonth (
  lessonMonth date not null,
  createdAt timestamp not null default current_timestamp,
  modifiedAt timestamp null on update current_timestamp,
  
   int unsigned not null default 0,
  unique (lessonMonth)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

create table if not exists deductionsPrice (
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
  foreign key (teacherID) references teacher(teacherID) on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
