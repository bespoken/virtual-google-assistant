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
                }).to.throw("ENOENT");
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
});
