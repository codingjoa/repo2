const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port =process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', (req, res)=> res.json({username:'bryan'}));

app.listen(port, ()=>{
    console.log();
})
