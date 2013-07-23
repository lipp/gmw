#!/usr/bin/env node

var jet = require('node-jet');

var peer = new jet.Peer();

var charm = require('charm')();
charm.pipe(process.stdout);
charm.reset();
charm.cursor(false);

var steerY = 2;
charm.position(1,steerY);
charm.write('[');
charm.position(63,steerY);
charm.write(']');

charm.position(10,steerY);
var x = 10;
var setSteer = function(s) {
    charm.position(x,steerY);
    charm.write(' ');
    x = (30 + s*30/100)+2;
    charm.position(x,steerY);
    charm.write('X');
}

setSteer(0);
   
peer.state({
    path: 'steer',
    value: 0,
    set: function (val) {
        if (val > 100 || val < -100) {
            throw "out of range";
        }
        setSteer(val);
    }
});

var speedY = 4;
charm.position(1,speedY);
charm.write('[');
charm.position(63,speedY);
charm.write(']');

charm.position(10,speedY);
var x2 = 10;
var setSpeed = function(s) {
    charm.position(x2,speedY);
    charm.write(' ');
    x2 = (30 + s*30/100)+2;
    charm.position(x2,speedY);
    charm.write('X');
}


setSpeed(0);

peer.state({
    path: 'speed',
    value: 0,
    set: function (val) {
        if (val > 100 || val < -100) {
            throw "out of range";
        }
        setSpeed(val);
    }
});



