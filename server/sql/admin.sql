select
  *
from
  (select
    newTeacher.*,
    (select
      teacherAccount
    from
      teacher
    where
      teacherAccount='ky'
    ) as isCanBe
  from
    teacher right join (
    select
      '관리자' as teacherName,
      'admin' as teacherAccount,
      '$2b$10$jH8iAs4oqMZqQ14/S/anX.dPW7QodtUiLq2HcX9bBrjZtPjtEY6Fa' as teacherPassword,
      1 as teacherOp
    ) as newTeacher
    on
      teacher.teacherAccount=newTeacher.teacherAccount
  ) as t
where
  t.isCanBe=1;
