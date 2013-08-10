#!/usr/bin/env node

var fs = require('fs');
var http = require('http');
var jet = require('node-jet');
var path = require('path');
var url = require('url');
var Inotify = require('inotify').Inotify;
var inotify = new Inotify();
//var raspifastcamd = require('child_process').spawn('/home/pi/raspifastcamd',['-w','640','-h','480','-q','5','-o','/tmp/images/%d.jpg','-e','jpg']); 
//var raspistill = require('child_process').spawn('raspistill',['-w','320','-h','240','-q','5','-o','/tmp/images/111.jpg','-e','jpg','-t','9999999','-tl','100','-th','0:0:0','-v']); 

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

var data;
var peer;

//setInterval(function() {

//},50);

var dir = '/run/shm/';

inotify.addWatch({
    path: dir,
    callback: function(event) {
        if (event.mask & Inotify.IN_CLOSE_WRITE) {
            console.log(event.name);
            if (peer) {
                var data;
                var f = fs.createReadStream(dir + event.name);
                f.on('data',function(d) {
                    if (data) {
                        data = Buffer.concat([data,d]);
                    } else {
                        data = d;
                    }                    
                });
                f.on('end',function() {
                    if (data) {
                        console.log('send');
                        var bla = data;
                        peer.sendBytes(bla);
                    }
  //                  raspifastcamd.kill('SIGUSR1');

                   // fs.unlink(dir + event.name);
                });
                f.on('error',function() {
                    //fs.unlink(dir + event.name);
                });
            } else {
                //fs.unlink(dir + event.name);
            }
        }
    }
});


  //  raspifastcamd.kill('SIGUSR1');

var WebsocketServer = require('websocket').server;


var server = http.createServer(function (req, res) {
    var urlParts = url.parse(req.url);
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
});

var wshttp = http.createServer();

var wsServer = new WebsocketServer({
    httpServer: wshttp
});

wsServer.on('request', function (request) {
    peer = request.accept('', request.origin);
    console.log('peer');
});

wshttp.listen(12345);

server.on('connection', function(socket) {
    socket.setNoDelay();
});

server.listen(gmwPort);

