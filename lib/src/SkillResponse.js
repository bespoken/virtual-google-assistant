"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class SkillResponse {
    constructor(rawJSON) {
        this.wrapJSON(rawJSON);
    }
    attr(key) {
        return _.get(this.sessionAttributes, key);
    }
    attrs(...keys) {
        return _.pick(this.sessionAttributes, keys);
    }
    card() {
        return _.get(this, "response.card");
    }
    cardContent() {
        return _.get(this, "response.card.content");
    }
    cardImage() {
        return _.get(this, "response.card.image");
    }
    cardSmallImage() {
        return _.get(this, "response.card.image.smallImageUrl");
    }
    cardLargeImage() {
        return _.get(this, "response.card.image.largeImageUrl");
    }
    cardTitle() {
        return _.get(this, "response.card.title");
    }
    prompt() {
        return _.has(this, "response.outputSpeech.ssml")
            ? _.get(this, "response.outputSpeech.ssml")
            : _.get(this, "response.outputSpeech.text");
    }
    reprompt() {
        return _.has(this, "response.reprompt.outputSpeech.ssml")
            ? _.get(this, "response.reprompt.outputSpeech.ssml")
            : _.get(this, "response.reprompt.outputSpeech.text");
    }
    wrapJSON(rawJSON) {
        for (const key of Object.keys(rawJSON)) {
            const value = rawJSON[key];
            this[key] = value;
        }
    }
}
exports.SkillResponse = SkillResponse;
//# sourceMappingURL=SkillResponse.js.map