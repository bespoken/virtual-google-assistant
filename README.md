<p align="center">
  <a href="https://bespoken.io/">
    <img alt="Bespoken" src="https://bespoken.io/wp-content/uploads/Bespoken-Logo-RGB-e1500333659572.png" width="546">
  </a>
</p>

<p align="center">
  Virtual Google Assistant<br>
  Interact with actions intuitively and programmatically.
</p>

<p align="center">
    <a href="https://travis-ci.org/bespoken/virtual-google-assistant">
        <img alt="Build Status" class="badge" src="https://travis-ci.org/bespoken/virtual-google-assistant.svg?branch=master">
    </a>
    <a href="https://codecov.io/gh/bespoken/virtual-google-assistant">
      <img src="https://codecov.io/gh/bespoken/virtual-google-assistant/branch/master/graph/badge.svg" alt="Codecov" />
    </a>
    <a href="https://www.npmjs.com/package/virtual-google-assistant">
        <img alt="NPM Version" class="badge" src="https://img.shields.io/npm/v/virtual-google-assistant.svg">
    </a>
    <a href="https://gitter.im/bespoken/bst?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">
        <img alt="Read The Docs" class="badge" src="https://badges.gitter.im/bespoken/bst.svg">
    </a>
</p>


# Virtual Google Assistant
Virtual Google Assistant allows for interacting with Actions on Google programmatically.

The core Virtual Google Assistant API provides several routines - the three most essential ones:

    * launch: Generates JSON for a launch request
    * utter: Generates JSON as if the user said the given phrase
    * intend: Generates JSON as if the given intent was uttered

## Why Do I Need This?
This library allows for easy testing of actions on google.

You can use it for:

1) Unit-testing - ensuring individual routines work correctly
2) Regression testing - ensuring the code as a whole works properly

## How Do I Get It?
```
npm install virtual-google-assistant --save-dev
```

## How Do I Use It?
Easy! Just add a line of code like so:
```
const vga = require("virtual-google-assistant");
const assistant = vga.VirtualGoogleAssistant.Builder()
    .handler("index.handler") // Google Cloud Function file and name
    .directory("./dialogFlowFolder") // Path to the Dialog Flow exported model
    .create();

assistant.utter("play").then((payload) => {
    console.log("OutputSpeech: " + result.speech);
    // Prints out returned SSML, e.g., "<speak> Welcome to my Action </speak>"
});
```

## Initializing the Virtual Google Assistant

Currently we have three ways of setting up the virtual google assistant in order to work with your code.

# Against an started server

Just set the complete url and we will send the Requests payloads to it.

```
const vga = require("virtual-google-assistant");
const assistant = vga.VirtualGoogleAssistant.Builder()
    .actionUrl("http://myServer:3000/") // Example of a running server
    .directory("./dialogFlowFolder") // Path to the Dialog Flow exported model
    .create();
```

# Against a Google Cloud Function file.

Set the path to the Action on Google code.

```
const vga = require("virtual-google-assistant");
const assistant = vga.VirtualGoogleAssistant.Builder()
    .handler("index.handler") // Google Cloud Function file and name
    .directory("./dialogFlowFolder") // Path to the Dialog Flow exported model
    .create();
 ```


# Against an express server

Set the path to the file were your server is, along the port that you use.

```
const vga = require("virtual-google-assistant");
const assistant = vga.VirtualGoogleAssistant.Builder()
    .expressModule("index", 3000) // Express server file and port
    .directory("./dialogFlowFolder") // Path to the Dialog Flow exported model
    .create();
 ```

For this to work correctly, we need the generated server to be exported, for example:
```
var server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = server;
```


## Using The Request Filter
The filter is a powerful tool for manipulating the request payloads that are made to your Action on Google.
```
assistant.addFilter((requestJSON) => {
  // Do something with the request
  request.result.resolvedQuery = "actions_intent_PERMISSION"; // Arbitrary example of changing the request payload
});
```

## Removing the Filters
If the filters are no longer useful, you can remove all filters from the instance by using this method
```
assistant.resetFilters();
```


## Context and Removing the Context
The virtual google assistant instance will keep your context from request to request automatically so that you can test multiturn actions too.
If you need to force the context removal, you can use the following method
```
assistant.removeContext();
```



## How Do I Talk To You?
Easy, you can open [an issue here](https://github.com/bespoken/virtual-google-assistant/issues), or find us on [our Gitter](https://gitter.im/bespoken/virtual-alexa).

We are also on the [Alexa Slack channel](http://amazonalexa.slack.com) - @jpkbst, @jperata and @ankraiza.

We look forward to hearing from you!
