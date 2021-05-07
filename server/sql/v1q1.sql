alter table v1.billing add billingRefundReason varchar(255) default null;
alter table v1.billing add billingRefundPrice int unsigned default null;
alter table v1.billing add billingMiddleRegCode int unsigned default 0;
alter table v1.billing add billingUnpaidCode int unsigned default 0;
alter table v1.billing add billingRefundAt date default null;
alter table v1.billing add billingRefundMiddleCode int unsigned default null;
update
  v1.billing,
  v1.refund
set
  billing.billingRefundPrice=billing.billingPrice * 0.01 * refund.refundPercent,
  billing.billingRefundReason=refund.refundReason
where
  billing.studentID=refund.studentID and
  billing.quarterID=refund.quarterID and
  billing.lessonMonth=refund.lessonMonth;
drop table v1.refund;
alter table v1.studentInfo add quarterID int unsigned default null;
alter table v1.studentInfo add foreign key (quarterID) references quarter(quarterID) on update cascade on delete set null;
alter table v1.quarter add teacherID int unsigned default null;
alter table v1.quarter add foreign key (teacherID) REFERENCES teacher(teacherID) on update cascade on delete set null;
