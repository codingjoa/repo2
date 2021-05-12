-- billing이 없는 checking null화
update
  checking left join
  billing on
    checking.quarterID=billing.quarterID and
    checking.lessonMonth=billing.lessonMonth and
    checking.studentID=billing.studentID
set
  checking.quarterID=null
where
  billing.studentID is null;
-- lesson이 없는 checking null화
update
  checking left join
  lesson on
    checking.quarterID=lesson.quarterID and
    checking.lessonMonth=lesson.lessonMonth
set
  checking.quarterID=null
where
  lesson.quarterID is null;
-- 중복된 checking null화
update
  (select
    distinct *
  from
    checking
  where
    checking.quarterID
  group by
    quarterID, lessonMonth, studyWeek, studentID
  having
    count(*) > 1
  ) C2 left join
  checking on
    C2.checkingID=checking.checkingID
set
  checking.quarterID=null;
-- null화 된 checking 한번에 삭제
delete from
  checking
where
  checking.quarterID is null;



-- lesson이 없는 study null화
update
  study left join
  lesson on
    study.quarterID=lesson.quarterID and
    study.lessonMonth=lesson.lessonMonth
set
  study.quarterID=null
where
  lesson.quarterID is null;
-- 중복된 study null화
DROP PROCEDURE IF EXISTS loopQuery;
DELIMITER $$
CREATE PROCEDURE loopQuery()
BEGIN
  DECLARE k INT DEFAULT 1;
  WHILE(k > 0) DO
    update
      (select
        study.*
      from
        study
      where
        study.quarterID is not null
      group by
        study.quarterID, study.lessonMonth, study.studyWeek
      having
        count(*)>1
      order by study.quarterID asc, study.lessonMonth asc, study.studyWeek asc
      limit
        1
      ) as A left join
      study on
        study.quarterID=A.quarterID and
        study.lessonMonth=A.lessonMonth and
        study.studyWeek=A.studyWeek
    set
      study.quarterID=null
    limit 1;
    SET k = ROW_COUNT();
  END WHILE;
END $$
DELIMITER ;
call loopQuery();
DROP PROCEDURE IF EXISTS loopQuery;
-- null화 된 study 한번에 삭제
delete from
  study
where
  study.quarterID is null;
