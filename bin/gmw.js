#!/usr/bin/env node

var fs = require('fs');
var http = require('http');
var jet = require('jet');
var path = require('path');

var gmwPort = parseInt(process.argv[3]) || 8080;
var webDir = process.argv[2] || '../web/';

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

http.createServer(function (req, res) {
    if (req.url === '/') {
        req.url = '/gmw.html';
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
}).listen(gmwPort);
