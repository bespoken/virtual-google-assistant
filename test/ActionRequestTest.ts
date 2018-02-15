import * as fs from "fs";
import {assert} from "chai";
import {InteractionModel} from "../src/InteractionModel";
import {ActionRequest} from "../src/ActionRequest";
import {ActionInteractor} from "../src/ActionInteractor";

describe("ActionRequestTest", function() {
    this.timeout(10000);
    const model: InteractionModel = InteractionModel.fromFolder("./test/resources/sampleProject");
    const requestGenerator: ActionRequest = new ActionRequest(model);

    describe("Generates correct intent", () => {
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
            const interactor = new ActionInteractor(model);
            const request = await interactor.spoken("what is the pokemon at 25")
            assert.equal(request.toJSON().result.metadata.intentName, "PokedexIntent");

            assert.deepEqual(request.toJSON().result.metadata.matchedParameters[0],         {
                "dataType": "@sys.number",
                "name": "number",
                "value": "$number",
                "isList": false
            });

            assert.equal(request.toJSON().result.parameters.number, "25");

        });
    });
});
