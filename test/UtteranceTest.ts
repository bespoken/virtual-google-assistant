import {IIntentSchema, IModel, SampleUtterances, Utterance} from "virtual-core";
import {assert} from "chai";
import {SampleUtterancesBuilder} from "../src/SampleUtterancesBuilder";
import {IntentSchema} from "../src/IntentSchema";
import {InteractionModel} from "../src/InteractionModel";

describe("UtteranceTest", function() {
    this.timeout(10000);

    const model: IModel = InteractionModel.fromFolder("./test/resources/sampleIntents");

    describe("Build from folder", () => {
       it ("Builds from folder", () => {
           const sampleUtterances: SampleUtterances = SampleUtterancesBuilder.fromFolder("./test/resources/sampleIntents");
           assert.equal(sampleUtterances.samplesForIntent("Hello").length, 4);
           assert.equal(sampleUtterances.samplesForIntent("MultipleSlots").length, 3);

           const intentSchema: IIntentSchema = IntentSchema.fromFolder("./test/resources/sampleIntents");
           assert.equal(intentSchema.intents().length, 7);

       })
    });

    describe("#matchIntent", () => {
        it("Matches a simple phrase", () => {
            const utterance = new Utterance(model, "play");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "Play");
        });

        it("Matches a simple phrase, ignores case", () => {
            const utterance = new Utterance(model, "Play");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "Play");
        });

        it("Matches a simple phrase, ignores special characters", () => {
            const utterance = new Utterance(model, "play?");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "Play");
        });

        it("Matches a slotted phrase", () => {
            const utterance = new Utterance(model, "slot value");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "SlottedIntent");
            assert.equal(utterance.slot(0), "value");
            assert.equal(utterance.slotByName("SlotName"), "value");
        });

        it("Matches a slotted phrase, no slot value", () => {
            const utterance = new Utterance(model, "slot");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "SlottedIntent");
        });

        it("Matches a phrase with multiple slots", () => {
            const utterance = new Utterance(model, "multiple a and b");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "MultipleSlots");
            assert.equal(utterance.slot(0), "a");
            assert.equal(utterance.slot(1), "b");
            assert.equal(utterance.slotByName("SlotA"), "a");
            assert.equal(utterance.slotByName("SlotB"), "b");
        });

        it("Matches a phrase with multiple slots reversed", () => {
            const utterance = new Utterance(model, "reversed a then b");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "MultipleSlots");
            assert.equal(utterance.slot(0), "a");
            assert.equal(utterance.slot(1), "b");
            assert.equal(utterance.slotByName("SlotA"), "b");
            assert.equal(utterance.slotByName("SlotB"), "a");
        });

        it("Matches a phrase with slot with enumerated values", () => {
            const utterance = new Utterance(model, "US");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "CustomSlot");
            assert.equal(utterance.slot(0), "US");
            assert.equal(utterance.slotByName("country"), "US");
        });

        it("Does not match a phrase with slot with enumerated values", () => {
            const utterance = new Utterance(model, "hi");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "Hello");
        });

        it("Matches a phrase with slot with number value", () => {
            const utterance = new Utterance(model, "19801");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "NumberSlot");
            assert.equal(utterance.slot(0), "19801");
            assert.equal(utterance.slotByName("number"), "19801");
        });

        it("Matches a phrase with slot with long-form number value", () => {
            let utterance = new Utterance(model, "one");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "NumberSlot");
            assert.equal(utterance.slot(0), "1");
            assert.equal(utterance.slotByName("number"), "1");

            utterance = new Utterance(model, "Thirteen");
            assert.equal(utterance.slotByName("number"), "13");

            utterance = new Utterance(model, " ten ");
            assert.equal(utterance.slotByName("number"), "10");
        });

        it("Does not match a phrase with to a slot of number type", () => {
            const utterance = new Utterance(model, "19801a test");
            assert.equal(utterance.intent(), "MultipleSlots");
        });

        it("Matches a more specific phrase", () => {
            const utterance = new Utterance(model, "1900 test");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "NumberSlot");
        });

        it("Matches with symbols in the phrase", () => {
            const utterance = new Utterance(model, "good? #%.morning");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "Hello");
        });

        it("Matches with punctuation in the phrase", () => {
            const utterance = new Utterance(model, "good, -morning:");
            assert.isTrue(utterance.matched());
            assert.equal(utterance.intent(), "Hello");
        });
    });
});
