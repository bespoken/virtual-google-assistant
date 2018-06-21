const express = require('express');
const app = express();

app.post('/', function (req, res) {
    res.status(200).send({"speech": "Hello World","displayText": "Hello World Displayed"});
});

var server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = server;