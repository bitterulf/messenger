'use strict';

var Primus = require('primus');

var primus = Primus.createServer(function connection(spark) {
    spark.on('data', function(data) {
        spark.write('thank you for the data');
    });
    console.log('client connected');
}, { port: 8080, transformer: 'websockets' });

primus.authorize(function (req, done) {
    if (req.query.token != 'acdc') {
        return done('wrong token!');
    }
    done();
});
