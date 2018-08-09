const dialogflow = require('actions-on-google').dialogflow;

const app = dialogflow();

function sampleFunction(assistant) {
    assistant.close("Hello World!");
}

app.intent("PokedexIntent", sampleFunction);

exports.handler = app;
