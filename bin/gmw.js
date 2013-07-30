#!/usr/bin/env node

var fs = require('fs');
var http = require('http');
var jet = require('node-jet');
var path = require('path');
var url = require('url');

var gmwPort = parseInt(process.argv[3]) || 8080;
var webDir = process.argv[2] || './web/';

var mime = {
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
}

var daemon = new jet.Daemon();

daemon.listen({
    tcpPort: 11122,
    wsPort: 11123
});

var image = fs.readFileSync('/home/pi/image.jpg')

fs.watch('/home/pi/image.jpg',function(a,b) {
    console.log('watch')
    fs.readFile('/home/pi/image.jpg',function(err,result) {
        if (result.length > 0) {
            image = result;
        }
    });
});

var server = http.createServer(function (req, res) {
    var urlParts = url.parse(req.url);
    if (req.url === '/') {
        req.url = '/gmw.html';
    }
    else if (urlParts.pathname === '/image') {        

        req.socket.setNoDelay();
        var i2 = image;
 //       console.log('http',i2.length);
   //     console.log(req);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length',i2.length);
        res.writeHead(200);
        res.end(i2);
        return;
    }
    fs.readFile(webDir + req.url, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.setHeader('Content-Type', mime[path.extname(req.url)]);
        res.writeHead(200);
        res.end(data);
    });
});

server.on('connection', function(socket) {
    console.log("BLA");
    socket.setNoDelay();
});

server.listen(gmwPort);

