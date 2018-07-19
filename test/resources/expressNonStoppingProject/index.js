const express = require('express');
const app = express();

app.post('/', function (req, res) {
    res.status(200).send({"speech": "Hello World","displayText": "Hello World Displayed"});
});

var server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

var slowToStopServer = {
    close: function(callback) {
        setTimeout(function () {
            server.close(callback);
        }, 2100);
    },
    on: function(event, callback) {
        server.on(event, callback);
    }
};

module.exports = slowToStopServer;