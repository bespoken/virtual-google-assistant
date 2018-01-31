"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const VirtualAlexa_1 = require("../src/VirtualAlexa");
describe("VirtualAlexa Tests Using Files", function () {
    it("Parses the files and does a simple utterance", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .sampleUtterancesFile("./test/resources/SampleUtterances.txt")
            .intentSchemaFile("./test/resources/IntentSchema.json")
            .create();
        let requestToCheck;
        chai_1.assert(virtualAlexa.filter((request) => {
            requestToCheck = request;
        }));
        const response = yield virtualAlexa.utter("play now");
        chai_1.assert.isDefined(response);
        chai_1.assert.isTrue(response.success);
        chai_1.assert.equal(virtualAlexa.context().locale(), "en-US");
        chai_1.assert.equal(requestToCheck.request.locale, "en-US");
    }));
    it("Parses the files and does a simple utterance", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .sampleUtterancesFile("./test/resources/SampleUtterances.txt")
            .intentSchemaFile("./test/resources/IntentSchema.json")
            .locale("de-DE")
            .create();
        let requestToCheck;
        chai_1.assert(virtualAlexa.filter((request) => {
            requestToCheck = request;
        }));
        const response = yield virtualAlexa.utter("play now");
        chai_1.assert.isDefined(response);
        chai_1.assert.isTrue(response.success);
        chai_1.assert.equal(virtualAlexa.context().locale(), "de-DE");
        chai_1.assert.equal(requestToCheck.request.locale, "de-DE");
    }));
    it("Parses the SMAPI format interaction model and does a simple utterance", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .interactionModelFile("./test/resources/InteractionModelSMAPI.json")
            .create();
        yield virtualAlexa.filter((request) => {
            chai_1.assert.equal(request.request.intent.name, "TellMeMoreIntent");
        }).utter("contact info");
    }));
    it("Parses the Interaction Model format V2 and does a simple utterance", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .interactionModelFile("./test/resources/LanguageModel.json")
            .create();
        yield virtualAlexa.filter((request) => {
            chai_1.assert.equal(request.request.intent.name, "TellMeMoreIntent");
        }).utter("contact info");
    }));
    it("Parses the Interaction Model from a locale and does a simple utterance", () => __awaiter(this, void 0, void 0, function* () {
        process.chdir("test/resources");
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("index.handler")
            .locale("de-DE")
            .create();
        const response = yield virtualAlexa.utter("contact info");
        chai_1.assert.equal(response.intent, "TellMeMoreIntent");
        process.chdir("../..");
    }));
    it("Parses the Interaction Model from the default locale and does a simple utterance", () => __awaiter(this, void 0, void 0, function* () {
        process.chdir("test/resources");
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("index.handler")
            .create();
        const response = yield virtualAlexa.utter("contact info");
        chai_1.assert.equal(response.intent, "TellMeMoreIntent");
        process.chdir("../..");
    }));
    it("Throws error when locale file is not present", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
                .handler("index.handler")
                .create();
            chai_1.assert(false, "This should not be reached");
        }
        catch (e) {
            chai_1.assert.isDefined(e);
        }
    }));
    it("Has a bad filename", () => {
        try {
            VirtualAlexa_1.VirtualAlexa.Builder()
                .handler("test.resources.index.handler")
                .sampleUtterancesFile("./test/resources/SampleUtterancesWrong.txt")
                .intentSchemaFile("./test/resources/IntentSchema.json")
                .create();
            chai_1.assert(false, "This should not be reached");
        }
        catch (e) {
            chai_1.assert.isDefined(e);
        }
    });
});
describe("VirtualAlexa Tests Using URL", function () {
    this.timeout(5000);
    it("Calls a remote mock service via HTTPS", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .intentSchemaFile("./test/resources/IntentSchema.json")
            .sampleUtterancesFile("./test/resources/SampleUtterances.txt")
            .skillURL("https://httpbin.org/post")
            .create();
        const response = yield virtualAlexa.utter("play now");
        chai_1.assert.isDefined(response.data);
        chai_1.assert.equal(response.url, "https://httpbin.org/post");
    }));
    it("Calls a remote mock service via HTTP", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .intentSchemaFile("./test/resources/IntentSchema.json")
            .sampleUtterancesFile("./test/resources/SampleUtterances.txt")
            .skillURL("http://httpbin.org/post")
            .create();
        const response = yield virtualAlexa.utter("play now");
        chai_1.assert.isDefined(response.data);
        chai_1.assert.equal(response.url, "http://httpbin.org/post");
    }));
});
describe("VirtualAlexa Tests Using Unified Interaction Model", function () {
    const interactionModel = {
        intents: [
            {
                name: "Play",
                samples: ["play", "play next", "play now"],
            },
            {
                name: "SlottedIntent",
                samples: ["slot {SlotName}"],
                slots: [
                    { name: "SlotName", type: "SLOT_TYPE" },
                ],
            },
            {
                name: "SlottedIntentEmptySynonymArray",
                samples: ["slotEmptySynonymArray {SlotEmptySynonymArray}"],
                slots: [
                    { name: "SlotEmptySynonymArray", type: "SLOT_EMPTY_SYNONYM_ARRAY_TYPE" },
                ],
            },
            {
                name: "MultipleSlots",
                samples: ["multiple {SlotA} and {SlotB}", "reversed {SlotB} then {SlotA}"],
                slots: [
                    { name: "SlotA", type: "SLOT_TYPE" },
                    { name: "SlotB", type: "SLOT_TYPE" },
                ],
            },
            {
                name: "CustomSlot",
                samples: ["custom {customSlot}"],
                slots: [
                    { name: "customSlot", type: "COUNTRY_CODE" },
                ],
            },
        ],
        types: [
            {
                name: "SLOT_EMPTY_SYNONYM_ARRAY_TYPE",
                values: [
                    {
                        id: "null",
                        name: {
                            synonyms: [],
                            value: "VALUE1",
                        },
                    },
                ],
            },
            {
                name: "COUNTRY_CODE",
                values: [
                    {
                        id: "US",
                        name: {
                            synonyms: ["USA", "America", "US"],
                            value: "US",
                        },
                    },
                    {
                        id: "DE",
                        name: {
                            synonyms: ["Germany", "DE"],
                            value: "DE",
                        },
                    },
                    {
                        id: "UK",
                        name: {
                            synonyms: ["United Kingdom", "England"],
                            value: "UK",
                        },
                    },
                ],
            }
        ],
    };
    it("Parses the JSON and does a simple utterance", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .interactionModel(interactionModel)
            .create();
        const response = yield virtualAlexa.utter("play now");
        chai_1.assert.isDefined(response);
        chai_1.assert.isTrue(response.success);
    }));
    it("Parses the file and does a simple utterance", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .interactionModelFile("./test/resources/InteractionModel.json")
            .create();
        const response = yield virtualAlexa.intend("AMAZON.CancelIntent");
        chai_1.assert.isDefined(response);
        chai_1.assert.isTrue(response.success);
    }));
    it("Utters builtin intent with custom phrase", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .interactionModel(interactionModel)
            .create();
        yield virtualAlexa.filter((request) => {
            chai_1.assert.equal(request.request.intent.name, "CustomSlot");
        }).utter("custom DE");
    }));
    it("Utters slotted phrase with empty synonym array", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .interactionModel(interactionModel)
            .create();
        yield virtualAlexa.filter((request) => {
            chai_1.assert.equal(request.request.intent.name, "SlottedIntentEmptySynonymArray");
            chai_1.assert.equal(request.request.intent.slots.SlotEmptySynonymArray.value, "VALUE1");
        }).utter("slotEmptySynonymArray value1");
    }));
    it("Utters slotted phrase with different synonym array", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .interactionModel(interactionModel)
            .create();
        yield virtualAlexa.filter((request) => {
            chai_1.assert.equal(request.request.intent.name, "CustomSlot");
            chai_1.assert.equal(request.request.intent.slots.customSlot.value, "UK");
        }).utter("custom UK");
    }));
});
describe("VirtualAlexa Tests Using JSON", function () {
    const intentSchema = {
        intents: [
            {
                intent: "AFirstIntent",
            },
            {
                intent: "AMAZON.CancelIntent",
            },
            {
                intent: "AMAZON.StopIntent",
            },
            {
                intent: "Play",
            },
            {
                intent: "SlottedIntent",
                slots: [
                    { name: "SlotName", type: "SLOT_TYPE" },
                ],
            },
            {
                intent: "MultipleSlots",
                slots: [
                    { name: "SlotA", type: "SLOT_TYPE" },
                    { name: "SlotB", type: "SLOT_TYPE" },
                ],
            },
        ],
    };
    const sampleUtterances = {
        "AFirstIntent": ["default"],
        "AMAZON.CancelIntent": ["cancel it now"],
        "MultipleSlots": ["multiple {SlotA} and {SlotB}", "reversed {SlotB} then {SlotA}"],
        "Play": ["play", "play next", "play now", "PLAY case"],
        "SlottedIntent": ["slot {SlotName}"],
    };
    describe("#utter", () => {
        let virtualAlexa;
        beforeEach(() => {
            virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
                .handler("test.resources.index.handler")
                .sampleUtterances(sampleUtterances)
                .intentSchema(intentSchema)
                .create();
        });
        afterEach(() => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.resetFilter().endSession();
        }));
        it("Utters simple phrase", () => __awaiter(this, void 0, void 0, function* () {
            const response = yield virtualAlexa.filter((request) => {
                chai_1.assert.isUndefined(request.context.System.device.deviceId);
                chai_1.assert.isUndefined(request.context.System.apiEndpoint, "https://api.amazonalexa.com/");
                chai_1.assert.isDefined(request.context.System.device.supportedInterfaces.AudioPlayer);
                chai_1.assert.isDefined(request.context.System.user.userId);
                chai_1.assert.isUndefined(request.context.System.user.permissions);
                chai_1.assert.equal(request.request.intent.name, "Play");
            }).utter("play now");
            chai_1.assert.equal(response.prompt(), "SSML");
            chai_1.assert.equal(response.reprompt(), "TEXT");
            chai_1.assert.equal(response.card().content, "content");
            chai_1.assert.equal(response.cardImage().smallImageUrl, "smallImageUrl");
            chai_1.assert.equal(response.cardContent(), "content");
            chai_1.assert.equal(response.cardTitle(), "title");
            chai_1.assert.equal(response.cardLargeImage(), "largeImageUrl");
            chai_1.assert.equal(response.cardSmallImage(), "smallImageUrl");
            chai_1.assert.equal(response.attr("counter"), "0");
            chai_1.assert.equal(response.attrs("counter", "key1").counter, "0");
            chai_1.assert.isUndefined(response.attrs("counter", "key1").key1);
        }));
        it("Utters simple phrase with different case", () => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.filter((request) => {
                chai_1.assert.equal(request.request.intent.name, "Play");
            }).utter("play NOW");
        }));
        it("Utters simple phrase with different case where sample is upper case", () => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.filter((request) => {
                chai_1.assert.equal(request.request.intent.name, "Play");
            }).utter("play case");
        }));
        it("Utters slotted phrase", () => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.filter((request) => {
                chai_1.assert.equal(request.request.intent.slots.SlotName.value, "my slot");
            }).utter("Slot my slot");
        }));
        it("Utters slotted phrase with no space", () => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.filter((request) => {
                chai_1.assert.equal(request.request.intent.name, "AFirstIntent");
            }).utter("Slotmy slot");
        }));
        it("Utters builtin intent", () => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.filter((request) => {
                chai_1.assert.equal(request.request.intent.name, "AMAZON.CancelIntent");
            }).utter("cancel");
        }));
        it("Utters builtin intent with custom phrase", () => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.filter((request) => {
                chai_1.assert.equal(request.request.intent.name, "AMAZON.CancelIntent");
            }).utter("cancel it now");
        }));
        it("Utters builtin intent not in schema", () => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.filter((request) => {
                chai_1.assert.equal(request.request.intent.name, "AFirstIntent");
            }).utter("page up");
        }));
        it("Defaults to first phrase", () => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.filter((request) => {
                chai_1.assert.equal(request.request.intent.name, "AFirstIntent");
            }).utter("nonexistent phrase");
        }));
        it("Utters phrases and maintains session", () => __awaiter(this, void 0, void 0, function* () {
            let response = yield virtualAlexa.utter("play now");
            chai_1.assert.equal(response.sessionAttributes.counter, 0);
            response = yield virtualAlexa.utter("play now");
            chai_1.assert.equal(response.sessionAttributes.counter, 1);
        }));
    });
    describe("#utterWithDeviceInfo", () => {
        it("Utters simple phrase with device info", () => __awaiter(this, void 0, void 0, function* () {
            const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
                .handler("test.resources.index.handler")
                .sampleUtterances(sampleUtterances)
                .intentSchema(intentSchema)
                .create();
            virtualAlexa.context().device().setID("testID");
            yield virtualAlexa.filter((request) => {
                chai_1.assert.isDefined(request.context.System.device.deviceId);
                chai_1.assert.equal(request.context.System.apiEndpoint, "https://api.amazonalexa.com/");
                chai_1.assert.isDefined(request.context.System.device.supportedInterfaces.AudioPlayer);
                chai_1.assert.isDefined(request.context.System.user.userId);
                chai_1.assert.isDefined(request.context.System.user.permissions);
                chai_1.assert.isDefined(request.context.System.user.permissions.consentToken);
                chai_1.assert.equal(request.request.intent.name, "Play");
            }).utter("play now");
        }));
    });
    describe("#intend", () => {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.index.handler")
            .sampleUtterances(sampleUtterances)
            .intentSchema(intentSchema)
            .create();
        afterEach(() => __awaiter(this, void 0, void 0, function* () {
            yield virtualAlexa.endSession();
        }));
        it("Intends simply", () => __awaiter(this, void 0, void 0, function* () {
            const response = yield virtualAlexa.intend("Play");
            chai_1.assert.isDefined(response);
            chai_1.assert.isTrue(response.success);
        }));
        it("Intends with filter", () => __awaiter(this, void 0, void 0, function* () {
            const reply = yield virtualAlexa.filter((request) => {
                request.session.sessionId = "Filtered";
            }).intend("Play");
            chai_1.assert.equal(reply.sessionAttributes.sessionId, "Filtered");
        }));
        it("Intends with slot", () => __awaiter(this, void 0, void 0, function* () {
            const response = yield virtualAlexa.intend("SlottedIntent", { SlotName: "Value" });
            chai_1.assert.isDefined(response);
            chai_1.assert.isTrue(response.success);
            chai_1.assert.equal(response.slot.name, "SlotName");
            chai_1.assert.equal(response.slot.value, "Value");
        }));
        it("Intends with slot value but no slots on intent", () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield virtualAlexa.intend("Play", { SlotName: "Value" });
            }
            catch (e) {
                chai_1.assert.equal(e.message, "Trying to add slot to intent that does not have any slots defined");
            }
        }));
        it("Intends with slot value but slot does not exist", () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield virtualAlexa.intend("SlottedIntent", { SlotWrongName: "Value" });
            }
            catch (error) {
                chai_1.assert.equal(error.message, "Trying to add undefined slot to intent: SlotWrongName");
            }
        }));
    });
    describe("#endSession", () => {
        it("Starts and Ends Session", (done) => {
            const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
                .handler("test.resources.index.handler")
                .sampleUtterances(sampleUtterances)
                .intentSchema(intentSchema)
                .create();
            virtualAlexa.launch().then(() => {
                virtualAlexa.endSession().then(() => {
                    done();
                });
            });
        });
        it("Starts and Is Asked To Stop", (done) => {
            const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
                .handler("test.resources.index.handler")
                .sampleUtterances(sampleUtterances)
                .intentSchema(intentSchema)
                .create();
            virtualAlexa.launch().then(() => {
                virtualAlexa.utter("stop").then(() => {
                    chai_1.assert.isUndefined(virtualAlexa.context().session());
                    done();
                });
            });
        });
    });
    describe("#launch", () => {
        it("Launches with filter", () => __awaiter(this, void 0, void 0, function* () {
            const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
                .handler("test.resources.index.handler")
                .sampleUtterances(sampleUtterances)
                .intentSchema(intentSchema)
                .create();
            const reply = yield virtualAlexa.filter((request) => {
                request.session.sessionId = "Filtered";
            }).launch();
            chai_1.assert.equal(reply.sessionAttributes.sessionId, "Filtered");
        }));
    });
});
describe("VirtualAlexa Tests Using Custom Function", function () {
    it("Calls the custom function correctly", () => __awaiter(this, void 0, void 0, function* () {
        const myFunction = function (event, context) {
            context.done(null, { custom: true });
        };
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler(myFunction)
            .sampleUtterancesFile("./test/resources/SampleUtterances.txt")
            .intentSchemaFile("./test/resources/IntentSchema.json")
            .create();
        const reply = yield virtualAlexa.filter((request) => {
            request.session.sessionId = "Filtered";
        }).launch();
        chai_1.assert.isTrue(reply.custom);
    }));
});
//# sourceMappingURL=VirtualAlexaTest.js.map