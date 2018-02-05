"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const virtual_core_1 = require("virtual-core");
const chai_1 = require("chai");
const SampleUtterancesBuilder_1 = require("../src/SampleUtterancesBuilder");
describe("UtteranceTest", function () {
    this.timeout(10000);
    const model = null;
    describe.only("Build from folder", () => {
        it("Builds from folder", () => {
            const sampleUtterances = SampleUtterancesBuilder_1.SampleUtterancesBuilder.fromFolder("./test/resources/sampleIntents");
            chai_1.assert.equal(sampleUtterances.samplesForIntent("Hello").length, 4);
            chai_1.assert.equal(sampleUtterances.samplesForIntent("MultipleSlots").length, 3);
        });
    });
    describe("#matchIntent", () => {
        it("Matches a simple phrase", () => {
            const utterance = new virtual_core_1.Utterance(model, "play");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "Play");
        });
        it("Matches a simple phrase, ignores case", () => {
            const utterance = new virtual_core_1.Utterance(model, "Play");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "Play");
        });
        it("Matches a simple phrase, ignores special characters", () => {
            const utterance = new virtual_core_1.Utterance(model, "play?");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "Play");
        });
        it("Matches help", () => {
            const utterance = new virtual_core_1.Utterance(model, "help");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "AMAZON.HelpIntent");
        });
        it("Matches a slotted phrase", () => {
            const utterance = new virtual_core_1.Utterance(model, "slot value");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "SlottedIntent");
            chai_1.assert.equal(utterance.slot(0), "value");
            chai_1.assert.equal(utterance.slotByName("SlotName"), "value");
        });
        it("Matches a slotted phrase, no slot value", () => {
            const utterance = new virtual_core_1.Utterance(model, "slot");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "SlottedIntent");
        });
        it("Matches a phrase with multiple slots", () => {
            const utterance = new virtual_core_1.Utterance(model, "multiple a and b");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "MultipleSlots");
            chai_1.assert.equal(utterance.slot(0), "a");
            chai_1.assert.equal(utterance.slot(1), "b");
            chai_1.assert.equal(utterance.slotByName("SlotA"), "a");
            chai_1.assert.equal(utterance.slotByName("SlotB"), "b");
        });
        it("Matches a phrase with multiple slots reversed", () => {
            const utterance = new virtual_core_1.Utterance(model, "reversed a then b");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "MultipleSlots");
            chai_1.assert.equal(utterance.slot(0), "a");
            chai_1.assert.equal(utterance.slot(1), "b");
            chai_1.assert.equal(utterance.slotByName("SlotA"), "b");
            chai_1.assert.equal(utterance.slotByName("SlotB"), "a");
        });
        it("Matches a phrase with slot with enumerated values", () => {
            const utterance = new virtual_core_1.Utterance(model, "US");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "CustomSlot");
            chai_1.assert.equal(utterance.slot(0), "US");
            chai_1.assert.equal(utterance.slotByName("country"), "US");
        });
        it("Does not match a phrase with slot with enumerated values", () => {
            const utterance = new virtual_core_1.Utterance(model, "hi");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "Hello");
        });
        it("Matches a phrase with slot with number value", () => {
            const utterance = new virtual_core_1.Utterance(model, "19801");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "NumberSlot");
            chai_1.assert.equal(utterance.slot(0), "19801");
            chai_1.assert.equal(utterance.slotByName("number"), "19801");
        });
        it("Matches a phrase with slot with long-form number value", () => {
            let utterance = new virtual_core_1.Utterance(model, "one");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "NumberSlot");
            chai_1.assert.equal(utterance.slot(0), "1");
            chai_1.assert.equal(utterance.slotByName("number"), "1");
            utterance = new virtual_core_1.Utterance(model, "Thirteen");
            chai_1.assert.equal(utterance.slotByName("number"), "13");
            utterance = new virtual_core_1.Utterance(model, " ten ");
            chai_1.assert.equal(utterance.slotByName("number"), "10");
        });
        it("Does not match a phrase with to a slot of number type", () => {
            const utterance = new virtual_core_1.Utterance(model, "19801a test");
            chai_1.assert.equal(utterance.intent(), "MultipleSlots");
        });
        it("Matches a more specific phrase", () => {
            const utterance = new virtual_core_1.Utterance(model, "1900 test");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "NumberSlot");
        });
        it("Matches with symbols in the phrase", () => {
            const utterance = new virtual_core_1.Utterance(model, "good? #%.morning");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "Hello");
        });
        it("Matches with punctuation in the phrase", () => {
            const utterance = new virtual_core_1.Utterance(model, "good, -morning:");
            chai_1.assert.isTrue(utterance.matched());
            chai_1.assert.equal(utterance.intent(), "Hello");
        });
    });
});
//# sourceMappingURL=UtteranceTest.js.map