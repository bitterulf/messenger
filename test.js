'use strict';

var Primus = require('primus');

var Socket = Primus.createSocket({});

var client = new Socket('http://localhost:8080?token=acdc');
client.on('open', function (server) {
    client.on('data', function(data) {
        console.log(data);
    });
    client.write({ foo: 'bar' });
});
