'use strict';

var Primus = require('primus');

var Socket = Primus.createSocket({});

const connect = function(token) {
    var client = new Socket('http://localhost:8080?token='+token);

    client.on('error', function (err) {
        // try to handle auth failed
        // console.log(err);
    });

    client.on('open', function (server) {
        client.write({token: token});
        client.on('data', function(data) {
            console.log(data.action);
        });
        client.write({action: 'doStuff'});
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
