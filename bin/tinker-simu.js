#!/usr/bin/env node

var jet = require('node-jet');

var peer = new jet.Peer();

var charm = require('charm')();
charm.pipe(process.stdout);
charm.reset();

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


