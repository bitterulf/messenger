'use strict';

var Primus = require('primus');

var Socket = Primus.createSocket({
    plugin: {
        'substream': require('substream'),
        'emit': require('primus-emit'),
        'rooms': require('primus-rooms')
    }
});

const connect = function(token) {
    const client = new Socket('http://localhost:8080?token='+token);

    client.on('error', function (err) {
        // try to handle auth failed
        // console.log(err);
    });

    client.on('open', function (server) {
        const status = client.substream('status');

        status.on('data', function(message) {
            console.log('status message:', message);
        });

        client.write({token: token});

        client.on('data', function(data) {
            if (data.action) {
                console.log(data.action);
            }
            else {
                console.log(data);
            }
        });

        client.write({action: 'doStuff'});

        client.emit('click', 10, 20);
    });
};

const unirest = require('unirest');
const config = require('./config.json');

unirest.post('http://accreditor.spielstand.net/generate')
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    .auth({
      user: config.username,
      pass: config.password,
      sendImmediately: true
    })
    .send({ "userId": "U123" })
    .end(function (response) {
        connect(response.body);
    });
