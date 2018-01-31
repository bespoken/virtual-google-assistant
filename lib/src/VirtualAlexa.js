"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IntentSchema_1 = require("./IntentSchema");
const InteractionModel_1 = require("./InteractionModel");
const LocalSkillInteractor_1 = require("./LocalSkillInteractor");
const RemoteSkillInteractor_1 = require("./RemoteSkillInteractor");
const SampleUtterancesBuilder_1 = require("./SampleUtterancesBuilder");
const SkillRequest_1 = require("./SkillRequest");
class VirtualAlexa {
    static Builder() {
        return new VirtualAlexaBuilder();
    }
    constructor(interactor) {
        this.interactor = interactor;
    }
    audioPlayer() {
        return this.interactor.context().audioPlayer();
    }
    context() {
        return this.interactor.context();
    }
    endSession() {
        return this.interactor.sessionEnded(SkillRequest_1.SessionEndedReason.USER_INITIATED, undefined);
    }
    filter(requestFilter) {
        this.interactor.filter(requestFilter);
        return this;
    }
    intend(intentName, slots) {
        return this.interactor.intended(intentName, slots);
    }
    launch() {
        return this.interactor.launched();
    }
    resetFilter() {
        this.interactor.filter(undefined);
        return this;
    }
    utter(utterance) {
        return this.interactor.spoken(utterance);
    }
}
exports.VirtualAlexa = VirtualAlexa;
class VirtualAlexaBuilder {
    applicationID(id) {
        this._applicationID = id;
        return this;
    }
    handler(handlerName) {
        this._handler = handlerName;
        return this;
    }
    intentSchema(json) {
        this._intentSchema = json;
        return this;
    }
    intentSchemaFile(filePath) {
        this._intentSchemaFile = filePath;
        return this;
    }
    interactionModel(json) {
        this._interactionModel = json;
        return this;
    }
    interactionModelFile(filePath) {
        this._interactionModelFile = filePath;
        return this;
    }
    sampleUtterances(utterances) {
        this._sampleUtterances = utterances;
        return this;
    }
    sampleUtterancesFile(filePath) {
        this._sampleUtterancesFile = filePath;
        return this;
    }
    skillURL(url) {
        this._skillURL = url;
        return this;
    }
    locale(locale) {
        this._locale = locale;
        return this;
    }
    create() {
        let model;
        const locale = this._locale ? this._locale : "en-US";
        if (this._interactionModel) {
            model = InteractionModel_1.InteractionModel.fromJSON(this._interactionModel);
        }
        else if (this._interactionModelFile) {
            model = InteractionModel_1.InteractionModel.fromFile(this._interactionModelFile);
        }
        else if (this._intentSchema && this._sampleUtterances) {
            const schema = IntentSchema_1.IntentSchema.fromJSON(this._intentSchema);
            const utterances = SampleUtterancesBuilder_1.SampleUtterancesBuilder.fromJSON(this._sampleUtterances);
            model = new InteractionModel_1.InteractionModel(schema, utterances);
        }
        else if (this._intentSchemaFile && this._sampleUtterancesFile) {
            const schema = IntentSchema_1.IntentSchema.fromFile(this._intentSchemaFile);
            const utterances = SampleUtterancesBuilder_1.SampleUtterancesBuilder.fromFile(this._sampleUtterancesFile);
            model = new InteractionModel_1.InteractionModel(schema, utterances);
        }
        else {
            model = InteractionModel_1.InteractionModel.fromLocale(locale);
            if (!model) {
                throw new Error("Either an interaction model or intent schema and sample utterances must be provided.\n" +
                    "Alternatively, if you specify a locale, Virtual Alexa will automatically check for the " +
                    "interaction model under the directory \"./models\" - e.g., \"./models/en-US.json\"");
            }
        }
        let interactor;
        if (this._handler) {
            interactor = new LocalSkillInteractor_1.LocalSkillInteractor(this._handler, model, locale, this._applicationID);
        }
        else if (this._skillURL) {
            interactor = new RemoteSkillInteractor_1.RemoteSkillInteractor(this._skillURL, model, locale, this._applicationID);
        }
        else {
            throw new Error("Either a handler or skillURL must be provided.");
        }
        return new VirtualAlexa(interactor);
    }
}
exports.VirtualAlexaBuilder = VirtualAlexaBuilder;
//# sourceMappingURL=VirtualAlexa.js.map