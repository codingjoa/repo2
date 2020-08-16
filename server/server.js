const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3307;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', async (req, res)=> res.json(await db.fetchUser()));

app.listen(port, ()=>{
    console.log('server opened.');
})
