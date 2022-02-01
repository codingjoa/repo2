const express = require('express');
const path = require('path');
const app = express();

//ssl
const fs = require('fs');
const httpsKey = process.env.SSL_KEY_FILE;
const httpsCrt = process.env.SSL_CRT_FILE;
const options = {
  key: httpsKey && fs.readFileSync(httpsKey),
  cert: httpsCrt && fs.readFileSync(httpsCrt)
};


// Backend Server Proxy
const proxy = require('http-proxy-middleware');
app.use(proxy('/api', {
  target: 'http://localhost:3307',
  changeOrigin: true
}));


// SPA Setting
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// SPA Server
const isHTTPS = (process.env?.HTTPS ?? false) === 'true';
const port = process.env.PORT ?? 3000;
const server = (isHTTPS) ? (require('https').createServer(options, app)) : (require('http').createServer({}, app));
server.listen(port);

/* Linux Signal */
const toStop = () => {
  server.close(() => console.log('server closed.'));
};
process.on('SIGINT', toStop);
process.on('SIGHUP', toStop);
