"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const Device_1 = require("./Device");
const SkillSession_1 = require("./SkillSession");
const User_1 = require("./User");
class SkillContext {
    constructor(interactionModel, audioPlayer, _locale, _applicationID) {
        this._locale = _locale;
        this._applicationID = _applicationID;
        this._accessToken = null;
        this._audioPlayer = audioPlayer;
        this._interactionModel = interactionModel;
        this._device = new Device_1.Device();
        this._user = new User_1.User();
    }
    applicationID() {
        if (this._applicationID === undefined || this._applicationID === null) {
            this._applicationID = "amzn1.echo-sdk-ams.app." + uuid.v4();
        }
        return this._applicationID;
    }
    device() {
        return this._device;
    }
    interactionModel() {
        return this._interactionModel;
    }
    user() {
        return this._user;
    }
    accessToken() {
        return this._accessToken;
    }
    setAccessToken(token) {
        this._accessToken = token;
    }
    locale() {
        return this._locale ? this._locale : "en-US";
    }
    audioPlayer() {
        return this._audioPlayer;
    }
    audioPlayerEnabled() {
        return this._audioPlayer !== null;
    }
    newSession() {
        this._session = new SkillSession_1.SkillSession();
    }
    session() {
        return this._session;
    }
    endSession() {
        this._session = undefined;
    }
    activeSession() {
        return this._session !== undefined;
    }
}
exports.SkillContext = SkillContext;
//# sourceMappingURL=SkillContext.js.map