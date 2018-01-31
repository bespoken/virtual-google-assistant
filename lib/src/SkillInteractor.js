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
const virtual_core_1 = require("virtual-core");
const AudioPlayer_1 = require("./AudioPlayer");
const SkillContext_1 = require("./SkillContext");
const SkillRequest_1 = require("./SkillRequest");
const SkillResponse_1 = require("./SkillResponse");
class SkillInteractor {
    constructor(model, locale, applicationID) {
        this.model = model;
        this.requestFilter = null;
        this.skillContext = null;
        const audioPlayer = new AudioPlayer_1.AudioPlayer(this);
        this.skillContext = new SkillContext_1.SkillContext(this.model, audioPlayer, locale, applicationID);
        this.skillContext.newSession();
    }
    context() {
        return this.skillContext;
    }
    spoken(utteranceString) {
        let utterance = new virtual_core_1.Utterance(this.interactionModel(), utteranceString);
        if (!utterance.matched()) {
            const defaultPhrase = this.interactionModel().sampleUtterances.defaultUtterance();
            utterance = new virtual_core_1.Utterance(this.interactionModel(), defaultPhrase.phrase);
            console.warn("No intentName matches utterance: " + utteranceString
                + ". Using fallback utterance: " + defaultPhrase.phrase);
        }
        return this.callSkillWithIntent(utterance.intent(), utterance.toJSON());
    }
    launched() {
        const serviceRequest = new SkillRequest_1.SkillRequest(this.skillContext);
        serviceRequest.launchRequest();
        return this.callSkill(serviceRequest);
    }
    sessionEnded(sessionEndedReason, errorData) {
        if (sessionEndedReason === SkillRequest_1.SessionEndedReason.ERROR) {
            console.error("SessionEndedRequest:\n" + JSON.stringify(errorData, null, 2));
        }
        const serviceRequest = new SkillRequest_1.SkillRequest(this.skillContext);
        serviceRequest.sessionEndedRequest(sessionEndedReason, errorData);
        return this.callSkill(serviceRequest).then(() => {
            this.context().endSession();
        });
    }
    intended(intentName, slots) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callSkillWithIntent(intentName, slots);
        });
    }
    filter(requestFilter) {
        this.requestFilter = requestFilter;
    }
    callSkill(serviceRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (serviceRequest.requiresSession() && !this.context().activeSession()) {
                this.context().newSession();
            }
            const requestJSON = serviceRequest.toJSON();
            if (this.requestFilter) {
                this.requestFilter(requestJSON);
            }
            const result = yield this.invoke(requestJSON);
            if (this.context().activeSession()) {
                this.context().session().used();
                if (result && result.response && result.response.shouldEndSession) {
                    this.context().endSession();
                }
                else {
                    this.context().session().updateAttributes(result.sessionAttributes);
                }
            }
            if (result.response !== undefined && result.response.directives !== undefined) {
                this.context().audioPlayer().directivesReceived(result.response.directives);
            }
            return new SkillResponse_1.SkillResponse(result);
        });
    }
    callSkillWithIntent(intentName, slots) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.skillContext.audioPlayerEnabled() && this.skillContext.audioPlayer().isPlaying()) {
                this.skillContext.audioPlayer().suspend();
            }
            const serviceRequest = new SkillRequest_1.SkillRequest(this.skillContext).intentRequest(intentName);
            if (slots !== undefined && slots !== null) {
                for (const slotName of Object.keys(slots)) {
                    serviceRequest.withSlot(slotName, slots[slotName]);
                }
            }
            const result = yield this.callSkill(serviceRequest);
            if (this.skillContext.audioPlayerEnabled() && this.skillContext.audioPlayer().suspended()) {
                this.skillContext.audioPlayer().resume();
            }
            return result;
        });
    }
    interactionModel() {
        return this.context().interactionModel();
    }
}
exports.SkillInteractor = SkillInteractor;
//# sourceMappingURL=SkillInteractor.js.map