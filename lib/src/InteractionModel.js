"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const virtual_core_1 = require("virtual-core");
const BuiltinSlotTypes_1 = require("./BuiltinSlotTypes");
const BuiltinUtterances_1 = require("./BuiltinUtterances");
const IntentSchema_1 = require("./IntentSchema");
const SampleUtterancesBuilder_1 = require("./SampleUtterancesBuilder");
class InteractionModel {
    constructor(intentSchema, sampleUtterances, slotTypes) {
        this.intentSchema = intentSchema;
        this.sampleUtterances = sampleUtterances;
        this.slotTypes = slotTypes;
        if (!this.slotTypes) {
            this.slotTypes = new virtual_core_1.SlotTypes([]);
        }
        this.sampleUtterances.setInteractionModel(this);
        const builtinValues = BuiltinUtterances_1.BuiltinUtterances.values();
        for (const key of Object.keys(builtinValues)) {
            if (this.hasIntent(key)) {
                for (const phrase of builtinValues[key]) {
                    this.sampleUtterances.addSample(key, phrase);
                }
            }
        }
        this.slotTypes.addTypes(BuiltinSlotTypes_1.BuiltinSlotTypes.values());
    }
    static fromFile(interactionModelFile) {
        const data = fs.readFileSync(interactionModelFile);
        const json = JSON.parse(data.toString());
        return InteractionModel.fromJSON(json);
    }
    static fromJSON(interactionModel) {
        const schemaJSON = {
            intents: [],
        };
        const sampleJSON = {};
        let languageModel = interactionModel;
        if ("interactionModel" in interactionModel) {
            languageModel = interactionModel.interactionModel.languageModel;
        }
        if ("languageModel" in interactionModel) {
            languageModel = interactionModel.languageModel;
        }
        const intents = languageModel.intents;
        for (const intent of intents) {
            intent.intent = intent.name;
            schemaJSON.intents.push(intent);
            if (intent.samples) {
                sampleJSON[intent.intent] = intent.samples;
            }
        }
        let slotTypes;
        if (languageModel.types) {
            slotTypes = new virtual_core_1.SlotTypes(languageModel.types);
        }
        const schema = new IntentSchema_1.IntentSchema(schemaJSON);
        const samples = SampleUtterancesBuilder_1.SampleUtterancesBuilder.fromJSON(sampleJSON);
        return new InteractionModel(schema, samples, slotTypes);
    }
    static fromLocale(locale) {
        const modelPath = "./models/" + locale + ".json";
        if (!fs.existsSync(modelPath)) {
            return undefined;
        }
        return InteractionModel.fromFile(modelPath);
    }
    hasIntent(intent) {
        return this.intentSchema.hasIntent(intent);
    }
}
exports.InteractionModel = InteractionModel;
//# sourceMappingURL=InteractionModel.js.map