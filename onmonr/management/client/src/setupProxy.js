const fs = require('fs');
const proxy = require("http-proxy-middleware");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

module.exports = function(app) {
  app.use(proxy("/api/costomers", { target: "http://localhost:5000" }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));

  const data = fs.readFileSync('../database.json');
  const conf = JSON.parse(data);
  const mysql = require('mysql');


  const connection = mysql.createConnection({
      host: conf.host,
      user: conf.user,
      password:conf.password,
      port:conf.port,
      database:conf.database
  });

  connection.connect();
  app.get('/api/customers',(req,res)=>{
    connection.query(
      "select * from student WHERE isDeleted = 0",
      (err,rows,fields)=>{
        res.send(rows);
      }
    )
});
app.get('/api/studentcheck',(req,res)=>{
  connection.query(
    "select * from student_check WHERE isDeleted = 0",
    (err,rows,fields)=>{
      res.send(rows);
    }
  )
});
//이미지는 넣지 않지만.. multer 형식의 데이터 전송 ? post처리라 올려둡니다..
    const multer = require('multer');
    const upload = multer({dest:'upload'});
    app.use('/image', express.static('upload'));
   app.post('/api/customers',upload.single('image'),(req, res)=>{
        let sql = 'INSERT INTO student VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), 0)';
        let qid = req.body.qid;
        let name = req.body.name;
        let age = req.body.age;
        let birthday = req.body.birthday;
        let gender = req.body.gender;
        let phone = req.body.phone;
        let email = req.body.email;
        let address = req.body.address;
        let uniqueness = req.body.uniqueness;
        let params = [qid, name, age, birthday, gender, phone, email, address, uniqueness];
        connection.query(sql, params,
            (err, rows, fields) => {
                res.send(rows);
            }
        );
   });
   app.post('/api/student_check',upload.single('image'),(req, res)=>{
        let sql = 'insert into student_check (sid, qid, name, isDeleted) select sid, qid, name, isDeleted from student where sid = ?';
        let params = [req.params.sid];
        connection.query(sql, params,
            (err, rows, fields) => {
                res.send(rows);
            }
        );
   });

   //출석 체크 쿼리
   app.get('/api/customer',(req,res)=>{
     connection.query(
       "select * from customer_check WHERE isDeleted = 0",
       (err,rows,fields)=>{
         res.send(rows);
       }
     )
   });

   //출석 체크 쿼리
   app.post('/api/customer',(req, res)=>{
    let sql = 'INSERT INTO customer_check (id, NAME, birthday, isDeleted) SELECT id, NAME, birthday, isDeleted FROM management WHERE isDeleted = 0';
    let name = req.body.name;
    let birthday = req.body.birthday;
    let params = [name, birthday];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
  });


   app.delete('/api/customers/:id',(req, res) => {
        let sql = 'UPDATE student SET isDeleted = 1 WHERE id = ?';
        let params = [req.params.id];
        connection.query(sql, params,
            (err, rows, fields) => {
                res.send(rows);
            })
   });

   app.listen(port, ()=> console.log(`Listening on port ${port}`));
}
