import * as fs from "fs";
import {assert, expect} from "chai";
import {InteractionModel} from "../src/InteractionModel";
import {ActionRequest, ActionRequestV1, ActionRequestV2} from "../src/ActionRequest";
import {ActionInteractor} from "../src/ActionInteractor";
import {VirtualGoogleAssistant} from "../src/VirtualGoogleAssistant";

describe("ActionRequestTest", function() {
    this.timeout(10000);

    describe("Generates correct intent", () => {

        describe("DialogFlow v1", () => {
            const model: InteractionModel = InteractionModel.fromDirectory("./test/resources/sampleProject");
            const requestGenerator: ActionRequest = new ActionRequestV1(model, "en-us");

            it("For a missing agent", () => {
                expect(function(){
                    const modelWithAction: InteractionModel = InteractionModel.fromDirectory("./test/resources/missingAgent");
                }).to.throw("The interaction model for your Google Action could not be");
            });

            it("For a intent with action", () => {
                const modelWithAction: InteractionModel = InteractionModel.fromDirectory("./test/resources/multipleLanguagesProject");
                const requestGenerator: ActionRequest = new ActionRequestV1(modelWithAction, "en-us");
                const request = requestGenerator.intentRequest("Give me a random number");
    
                assert.equal(request.toJSON().result.action, "RandomNumber");
                assert.equal(request.toJSON().result.metadata.intentName, "Give me a random number");
            });
    
            it("For a intent with slots", () => {
                const request = requestGenerator.intentRequest("PokedexIntent").withSlot("number", "22");
                assert.equal(request.toJSON().result.parameters.number, 22);
                assert.deepEqual(request.toJSON().result.metadata.matchedParameters[0],         {
                    "dataType": "@sys.number",
                    "name": "number",
                    "value": "$number",
                    "isList": false
                });
                assert.deepEqual(request.toJSON().status, {
                    "code": 200,
                    "errorType": "success",
                    "webhookTimedOut": false
                });
                assert.equal(request.toJSON().result.metadata.intentName, "PokedexIntent");
    
            });
    
            it("For a intent with no slots", () => {
                const request = requestGenerator.intentRequest("YesIntent");
    
                assert.deepEqual(request.toJSON().result.parameters, {});
                assert.equal(request.toJSON().result.metadata.intentName, "YesIntent");
            });
    
            it("For a welcome intent", () => {
                const request = requestGenerator.launchRequest();
                assert.deepEqual(request.toJSON().result.parameters, {});
                assert.equal(request.toJSON().result.metadata.intentName, "Default Welcome Intent");
            });
    
            it("For a utterance", async () => {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .actionUrl( "https://httpbin.org/post" )
                    .directory("./test/resources/sampleProject")
                    .create();
    
                const httpBinResponse = await virtualGoogle.utter("what is the pokemon at 25");
    
                const originalRequestSent = httpBinResponse.json;
                assert.equal(originalRequestSent.result.metadata.intentName, "PokedexIntent");
    
                assert.deepEqual(originalRequestSent.result.metadata.matchedParameters[0],         {
                    "dataType": "@sys.number",
                    "name": "number",
                    "value": "$number",
                    "isList": false
                });
    
                assert.equal(originalRequestSent.result.parameters.number, "25");
            });
    
            it("Modify the request before sending it to the action", async () => {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .actionUrl( "https://httpbin.org/post" )
                    .directory("./test/resources/sampleProject")
                    .create();
    
                virtualGoogle.addFilter((request) => {
                    request.result.resolvedQuery = "actions_intent_PERMISSION";
                });
    
                virtualGoogle.addFilter((request) => {
                    request.lang = "en-UK";
                });
    
                const httpBinResponse = await virtualGoogle.utter("what is the pokemon at 25");
    
                const originalRequestSent = httpBinResponse.json;
    
                assert.equal(originalRequestSent.result.resolvedQuery, "actions_intent_PERMISSION");
                assert.equal(originalRequestSent.lang, "en-UK");
    
            });
    
            it("Reset the filters action", async () => {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .actionUrl( "https://httpbin.org/post" )
                    .directory("./test/resources/sampleProject")
                    .create();
    
                virtualGoogle.addFilter((request) => {
                    request.lang = "en-UK";
                });
    
                virtualGoogle.resetFilters();
    
                const httpBinResponse = await virtualGoogle.utter("what is the pokemon at 25");
    
                const originalRequestSent = httpBinResponse.json;
    
                assert.equal(originalRequestSent.lang, "en-us");
            });
    
            it("Sent the request in other locale", async () => {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .actionUrl( "https://httpbin.org/post" )
                    .directory("./test/resources/sampleProject")
                    .locale("en-UK")
                    .create();
    
                const httpBinResponse = await virtualGoogle.utter("what is the pokemon at 25");
    
                const originalRequestSent = httpBinResponse.json;
    
                assert.equal(originalRequestSent.lang, "en-UK");
            });
        });

        describe("DialogFlow v2", () => {
            const model: InteractionModel = InteractionModel.fromDirectory("./test/resources/sampleProjectv2");
            const requestGenerator: ActionRequest = new ActionRequestV2(model, "en-us");

            it("For a intent with slots", () => {
                const request = requestGenerator.intentRequest("PokedexIntent").withSlot("number", "22");
                assert.equal(request.toJSON().queryResult.parameters.number, 22);
                assert.deepEqual(request.toJSON().queryResult.intent.matchedParameters[0], {
                    "dataType": "@sys.number",
                    "name": "number",
                    "value": "$number",
                    "isList": false
                });
                assert.equal(request.toJSON().queryResult.intent.displayName, "PokedexIntent");
    
            });
    
            it("For a intent with no slots", () => {
                const request = requestGenerator.intentRequest("YesIntent");
    
                assert.deepEqual(request.toJSON().queryResult.parameters, {});
                assert.equal(request.toJSON().queryResult.intent.displayName, "YesIntent");
            });
    
            it("For a welcome intent", () => {
                const request = requestGenerator.launchRequest();
                assert.deepEqual(request.toJSON().queryResult.parameters, {});
                assert.equal(request.toJSON().queryResult.intent.displayName, "Default Welcome Intent");
            });
    
            it("For a utterance", async () => {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .actionUrl( "https://httpbin.org/post" )
                    .directory("./test/resources/sampleProjectv2")
                    .create();
    
                const httpBinResponse = await virtualGoogle.utter("what is the pokemon at 25");
    
                const originalRequestSent = httpBinResponse.json;
                assert.equal(originalRequestSent.queryResult.intent.displayName, "PokedexIntent");
    
                assert.deepEqual(originalRequestSent.queryResult.intent.matchedParameters[0],         {
                    "dataType": "@sys.number",
                    "name": "number",
                    "value": "$number",
                    "isList": false
                });
    
                assert.equal(originalRequestSent.queryResult.parameters.number, "25");
            });
    
            it("Modify the request before sending it to the action", async () => {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .actionUrl( "https://httpbin.org/post" )
                    .directory("./test/resources/sampleProject")
                    .create();
    
                virtualGoogle.addFilter((request) => {
                    request.result.resolvedQuery = "actions_intent_PERMISSION";
                });
    
                virtualGoogle.addFilter((request) => {
                    request.lang = "en-UK";
                });
    
                const httpBinResponse = await virtualGoogle.utter("what is the pokemon at 25");
    
                const originalRequestSent = httpBinResponse.json;
    
                assert.equal(originalRequestSent.result.resolvedQuery, "actions_intent_PERMISSION");
                assert.equal(originalRequestSent.lang, "en-UK");
    
            });
    
            it("Reset the filters action", async () => {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .actionUrl( "https://httpbin.org/post" )
                    .directory("./test/resources/sampleProject")
                    .create();
    
                virtualGoogle.addFilter((request) => {
                    request.lang = "en-UK";
                });
    
                virtualGoogle.resetFilters();
    
                const httpBinResponse = await virtualGoogle.utter("what is the pokemon at 25");
    
                const originalRequestSent = httpBinResponse.json;
    
                assert.equal(originalRequestSent.lang, "en-us");
            });
    
            it("Sent the request in other locale", async () => {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .actionUrl( "https://httpbin.org/post" )
                    .directory("./test/resources/sampleProject")
                    .locale("en-UK")
                    .create();
    
                const httpBinResponse = await virtualGoogle.utter("what is the pokemon at 25");
    
                const originalRequestSent = httpBinResponse.json;
    
                assert.equal(originalRequestSent.lang, "en-UK");
            });
        });
    });

    describe("VirtualGoogleAssistant Tests Using Express", function() {
        it("Calls the custom express with invalid parameters", async () => {
            try {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .expressModule("test.resources.expressProject.index", 3000)
                    .handler("test.resources.expressProject.index")
                    .directory("./test/resources/sampleProject")
                    .create();
            } catch (error) {
                assert.equal(error.message, "Use only handler or expressModule.");

            }
        });

        it("Throws error if server never start", async () => {
            let errorTriggered = false;
            try {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .expressModule("test/resources/expressNonStartingProject/index", 3000)
                    .directory("./test/resources/sampleProject")
                    .create();
                await virtualGoogle.startExpressServer();
            } catch (error) {
                assert.equal(error.message, "Server took to long to start listening.");
                errorTriggered = true;
            }

            assert.equal(errorTriggered, true);
        });

        it("Throws error if server never stop", async () => {
            let errorTriggered = false;
            try {
                const virtualGoogle = VirtualGoogleAssistant.Builder()
                    .expressModule("test/resources/expressNonStoppingProject/index", 3000)
                    .directory("./test/resources/sampleProject")
                    .create();
                await virtualGoogle.startExpressServer();
                await virtualGoogle.stopExpressServer();
            } catch (error) {
                assert.equal(error.message, "Server took to long to stop.");
                errorTriggered = true;
            }

            assert.equal(errorTriggered, true);

            // We need to give some milliseconds for the server to actually close, since we are just manually delaying
            await new Promise((resolve) => {
                setTimeout(resolve, 300);
            });
        });

        it("Calls the custom express from a file", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .expressModule("test/resources/expressProject/index", 3000)
                .directory("./test/resources/sampleProject")
                .create();

            await virtualGoogle.startExpressServer();
            const reply = await virtualGoogle.launch();

            assert.equal(reply.speech, "Hello World");
            assert.equal(reply.displayText, "Hello World Displayed");

            await virtualGoogle.stopExpressServer();
        });

        it("Calls the custom express from a file twice with no port conflict", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .expressModule("test/resources/expressProject/index", 3000)
                .directory("./test/resources/sampleProject")
                .create();

            await virtualGoogle.startExpressServer();

            const reply1 = await virtualGoogle.launch();
            const reply2 = await virtualGoogle.launch();

            assert.equal(reply1.speech, "Hello World");
            assert.equal(reply2.displayText, "Hello World Displayed");

            await virtualGoogle.stopExpressServer();
        });


        it("Calls the custom express from a file twice with no port conflict, stopping the server in between", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .expressModule("test/resources/expressProject/index", 3000)
                .directory("./test/resources/sampleProject")
                .create();

            await virtualGoogle.startExpressServer();

            const reply1 = await virtualGoogle.launch();

            await virtualGoogle.stopExpressServer();
            await virtualGoogle.startExpressServer();

            const reply2 = await virtualGoogle.launch();

            assert.equal(reply1.speech, "Hello World");
            assert.equal(reply2.displayText, "Hello World Displayed");

            await virtualGoogle.stopExpressServer();
        });

        // With current implementation this case fails, since the port is occupied,
        it.skip("Calls the custom express from a file twice with two instances in parallel", async () => {
            const virtualGoogle1 = VirtualGoogleAssistant.Builder()
                .expressModule("test/resources/expressProject/index", 3000)
                .directory("./test/resources/sampleProject")
                .create();

            const virtualGoogle2 = VirtualGoogleAssistant.Builder()
                .expressModule("test/resources/expressProject/index", 3000)
                .directory("./test/resources/sampleProject")
                .create();

            const launch1 = virtualGoogle1.launch();
            const launch2 = virtualGoogle2.launch();

            const [reply1, reply2]: any[] = await Promise.all([launch1, launch2]);
            assert.equal(reply1.speech, "Hello World");
            assert.equal(reply2.displayText, "Hello World Displayed");
        });

        it("Throws error when the express server has not started yet.", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .expressModule("test/resources/expressProject/index", 3000)
                .directory("./test/resources/sampleProject")
                .create();

            let errorReturned = false;
            try {
                await virtualGoogle.launch();
            } catch (error) {
                errorReturned = true;
                assert.equal(error.message, "Express server is not started yet");
            }

            assert.equal(errorReturned, true);
        });
    });

    describe("VirtualGoogleAssistant Tests Using Custom Function", function() {
        it("Calls the custom function from a file", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .handler("test/resources/sampleFirebaseFunction/index.helloWorld")
                .directory("./test/resources/sampleProject")
                .create();

            const reply = await virtualGoogle.launch();

            assert.equal(reply.speech, "Hello World");
            assert.equal(reply.displayText, "Hello World Displayed");
        });

        it("Calls the custom function correctly", async () => {
            const myFunction = function(request: any, response: any) {
                response.status(200).send({"speech": "Hello World","displayText": "Hello World Displayed"});
            };

            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .handler(myFunction)
                .directory("./test/resources/sampleProject")
                .create();

            const reply = await virtualGoogle.launch();

            assert.equal(reply.speech, "Hello World");
            assert.equal(reply.displayText, "Hello World Displayed");

        });

        it("Calls the custom function with actions-on-google library from a file", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .handler("test/resources/sampleNewVersionFirebaseFunction/index.handler")
                .directory("./test/resources/sampleProject")
                .create();

            const reply = await virtualGoogle.intend("PokedexIntent");

            assert.equal(reply.data.google.richResponse.items[0].simpleResponse.textToSpeech, "Hello World!");
        });

        it("Throws error correctly", async () => {
            const myFunction = function(request: any, response: any) {
                throw Error("I am an error");
            };

            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .handler(myFunction)
                .directory("./test/resources/sampleProject")
                .create();

            try {
               await virtualGoogle.launch();
            } catch (error) {
                assert.equal(error.message, "I am an error");
            }
        });

        it("Calls the custom function with actions-on-google and firebase-functions library from a file", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .handler("test/resources/firebaseFunctionHttpOnRequest/index.myFunction")
                .directory("./test/resources/sampleProject")
                .create();

            const reply = await virtualGoogle.launch();
            assert.equal(reply.data.google.richResponse.items[0].simpleResponse.textToSpeech, "This is the sample welcome! What would you like?");
        });
    });
    describe("VirtualGoogleAssistant mantains context", function() {

        it("Mantains context and then reset context on launch", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .handler("test/resources/sampleContextFunction/index.helloWorld")
                .directory("./test/resources/sampleProject")
                .create();

            const reply = await virtualGoogle.launch();
            assert.equal(reply.speech, "Hello World");
            assert.equal(reply.displayText, "Hello World Displayed");

            const replyUsingContext = await virtualGoogle.utter("What is the pokemon at 7");
            assert.equal(replyUsingContext.speech, "Simple Context");

            const cleanedReply =  await virtualGoogle.launch();
            assert.equal(cleanedReply.speech, "Hello World");
        });

        it("Mantains context and then reset context on launch using express", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .expressModule("test/resources/sampleContextFunction/expressIndex", 3000)
                .directory("./test/resources/sampleProject")
                .create();
            await virtualGoogle.startExpressServer();

            const reply = await virtualGoogle.launch();
            assert.equal(reply.speech, "Hello World");
            assert.equal(reply.displayText, "Hello World Displayed");

            const replyUsingContext = await virtualGoogle.utter("What is the pokemon at 7");
            assert.equal(replyUsingContext.speech, "Simple Context");

            const cleanedReply =  await virtualGoogle.launch();
            assert.equal(cleanedReply.speech, "Hello World");

            await virtualGoogle.stopExpressServer();
        });

        it("Mantains context and then reset context on resetContext", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .handler("test/resources/sampleContextFunction/index.helloWorld")
                .directory("./test/resources/sampleProject")
                .create();

            const reply = await virtualGoogle.launch();
            assert.equal(reply.speech, "Hello World");
            assert.equal(reply.displayText, "Hello World Displayed");

            virtualGoogle.resetContext();

            const replyUsingContext = await virtualGoogle.utter("What is the pokemon at 7");
            assert.equal(replyUsingContext.speech, "Hello World");
        });


        it("mantains context with dialog v2 format", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .handler("test/resources/sampleContextFunction/index.helloWorld")
                .directory("./test/resources/sampleProjectv2")
                .create();

            const reply = await virtualGoogle.launch();
            assert.equal(reply.speech, "Hello World");
            assert.equal(reply.displayText, "Hello World Displayed");

            const replyUsingContext = await virtualGoogle.utter("What is the pokemon at 7");
            assert.equal(replyUsingContext.speech, "Simple Context");

            const cleanedReply =  await virtualGoogle.launch();
            assert.equal(cleanedReply.speech, "Hello World");
        });

    });

    describe("VirtualGoogleAssistant Tests Using Lmabda", function() {
        it("Calls lambda from a file", async () => {
            const virtualGoogle = VirtualGoogleAssistant.Builder()
                .handler("test/resources/lambda/index.handler")
                .directory("./test/resources/sampleProject")
                .create();

            const reply = await virtualGoogle.launch();
            assert.equal(reply.fulfillmentMessages[0].card.title, "card title");
        });
    });
});
