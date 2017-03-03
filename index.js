'use strict';

const Primus = require('primus');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');

// need to be cleaned up
const loggedInUsers = {
};

const primus = Primus.createServer(function connection(spark) {
    spark.on('data', function(data) {
        if (data.token) {
            // check if existing and still valid
            // otherwise we should end the connection here
            spark.user = loggedInUsers[data.token];
        }
        if (data.action == 'doStuff') {
            console.log(data.action, spark.user);
            spark.write({action: 'hello '+data.action});
        }
    });
    console.log('client connected');
}, { port: 8080, transformer: 'websockets' });

primus.authorize(function (req, done) {
    unirest.get('http://accreditor.spielstand.net/publicKey')
        .end(function (response, foo) {
            try {
                const validatedPayload = jwt.verify(req.query.token, response.body);
                if (!validatedPayload.userId) {
                    return done({statusCode: 403, message: 'unauthorized'});
                }
                console.log(validatedPayload.userId, 'connected');
                loggedInUsers[req.query.token] = validatedPayload;
                done();
            } catch(err) {
                console.log(err);
                done({statusCode: 403, message: 'unauthorized'});
            }
        });
});
