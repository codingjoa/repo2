const express = require('express');
const path = require('path');
const app = express();

//ssl
const fs = require('fs');
const options = {
  key: fs.readFileSync(__dirname + '/ssl/cert.key'),
  cert: fs.readFileSync(__dirname + '/ssl/cert.crt')
};

// Proxy
const proxy = require('http-proxy-middleware');
app.use(proxy('/api', {
  target: 'http://localhost:3307',
  changeOrigin: true
}));

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// server
const https = require('https');

const port = process.env.PORT ?? 3000;
https.createServer(options, app).listen(port);
// app.listen(port);
