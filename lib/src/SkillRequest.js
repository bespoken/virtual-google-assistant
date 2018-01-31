"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const AudioPlayer_1 = require("./AudioPlayer");
class RequestType {
}
RequestType.INTENT_REQUEST = "IntentRequest";
RequestType.LAUNCH_REQUEST = "LaunchRequest";
RequestType.SESSION_ENDED_REQUEST = "SessionEndedRequest";
RequestType.AUDIO_PLAYER_PLAYBACK_FINISHED = "AudioPlayer.PlaybackFinished";
RequestType.AUDIO_PLAYER_PLAYBACK_NEARLY_FINISHED = "AudioPlayer.PlaybackNearlyFinished";
RequestType.AUDIO_PLAYER_PLAYBACK_STARTED = "AudioPlayer.PlaybackStarted";
RequestType.AUDIO_PLAYER_PLAYBACK_STOPPED = "AudioPlayer.PlaybackStopped";
exports.RequestType = RequestType;
var SessionEndedReason;
(function (SessionEndedReason) {
    SessionEndedReason[SessionEndedReason["ERROR"] = 0] = "ERROR";
    SessionEndedReason[SessionEndedReason["EXCEEDED_MAX_REPROMPTS"] = 1] = "EXCEEDED_MAX_REPROMPTS";
    SessionEndedReason[SessionEndedReason["USER_INITIATED"] = 2] = "USER_INITIATED";
})(SessionEndedReason = exports.SessionEndedReason || (exports.SessionEndedReason = {}));
class SkillRequest {
    constructor(context) {
        this.context = context;
        this.requestJSON = null;
    }
    static timestamp() {
        const timestamp = new Date().toISOString();
        return timestamp.substring(0, 19) + "Z";
    }
    static requestID() {
        return "amzn1.echo-api.request." + uuid.v4();
    }
    intentRequest(intentName) {
        const isBuiltin = intentName.startsWith("AMAZON");
        if (!isBuiltin) {
            if (!this.context.interactionModel().hasIntent(intentName)) {
                throw new Error("Interaction model has no intentName named: " + intentName);
            }
        }
        this.requestJSON = this.baseRequest(RequestType.INTENT_REQUEST);
        this.requestJSON.request.intent = {
            name: intentName,
        };
        if (!isBuiltin) {
            const intent = this.context.interactionModel().intentSchema.intent(intentName);
            if (intent.slots !== null && intent.slots.length > 0) {
                this.requestJSON.request.intent.slots = {};
                for (const slot of intent.slots) {
                    this.requestJSON.request.intent.slots[slot.name] = {
                        name: slot.name,
                    };
                }
            }
        }
        return this;
    }
    audioPlayerRequest(requestType, token, offsetInMilliseconds) {
        this.requestJSON = this.baseRequest(requestType);
        this.requestJSON.request.token = token;
        this.requestJSON.request.offsetInMilliseconds = offsetInMilliseconds;
        return this;
    }
    launchRequest() {
        this.requestJSON = this.baseRequest(RequestType.LAUNCH_REQUEST);
        return this;
    }
    sessionEndedRequest(reason, errorData) {
        this.requestJSON = this.baseRequest(RequestType.SESSION_ENDED_REQUEST);
        this.requestJSON.request.reason = SessionEndedReason[reason];
        if (errorData !== undefined && errorData !== null) {
            this.requestJSON.request.error = errorData;
        }
        return this;
    }
    withSlot(slotName, slotValue) {
        if (this.requestJSON.request.type !== "IntentRequest") {
            throw Error("Trying to add slot to non-intent request");
        }
        if (!this.requestJSON.request.intent.slots) {
            throw Error("Trying to add slot to intent that does not have any slots defined");
        }
        if (!(slotName in this.requestJSON.request.intent.slots)) {
            throw Error("Trying to add undefined slot to intent: " + slotName);
        }
        this.requestJSON.request.intent.slots[slotName] = { name: slotName, value: slotValue };
        return this;
    }
    requiresSession() {
        return (this.requestType === RequestType.LAUNCH_REQUEST
            || this.requestType === RequestType.INTENT_REQUEST
            || this.requestType === RequestType.SESSION_ENDED_REQUEST);
    }
    toJSON() {
        const applicationID = this.context.applicationID();
        if (this.requiresSession() && this.context.activeSession()) {
            const session = this.context.session();
            const newSession = session.isNew();
            const sessionID = session.id();
            const attributes = session.attributes();
            this.requestJSON.session = {
                application: {
                    applicationId: applicationID,
                },
                new: newSession,
                sessionId: sessionID,
                user: this.userObject(this.context),
            };
            if (this.requestType !== RequestType.LAUNCH_REQUEST) {
                this.requestJSON.session.attributes = attributes;
            }
            if (this.context.accessToken() !== null) {
                this.requestJSON.session.user.accessToken = this.context.accessToken();
            }
        }
        if (this.requiresSession()) {
            if (this.context.audioPlayerEnabled()) {
                const activity = AudioPlayer_1.AudioPlayerActivity[this.context.audioPlayer().playerActivity()];
                this.requestJSON.context.AudioPlayer = {
                    playerActivity: activity,
                };
                if (this.context.audioPlayer().playerActivity() !== AudioPlayer_1.AudioPlayerActivity.IDLE) {
                    const playing = this.context.audioPlayer().playing();
                    this.requestJSON.context.AudioPlayer.token = playing.stream.token;
                    this.requestJSON.context.AudioPlayer.offsetInMilliseconds = playing.stream.offsetInMilliseconds;
                }
            }
        }
        return this.requestJSON;
    }
    baseRequest(requestType) {
        this.requestType = requestType;
        const applicationID = this.context.applicationID();
        const requestID = SkillRequest.requestID();
        const timestamp = SkillRequest.timestamp();
        const baseRequest = {
            context: {
                System: {
                    application: {
                        applicationId: applicationID,
                    },
                    device: {
                        supportedInterfaces: this.context.device().supportedInterfaces(),
                    },
                    user: this.userObject(this.context),
                },
            },
            request: {
                locale: this.context.locale(),
                requestId: requestID,
                timestamp,
                type: requestType,
            },
            version: "1.0",
        };
        if (this.context.device().id()) {
            baseRequest.context.System.apiEndpoint = "https://api.amazonalexa.com/";
            baseRequest.context.System.device.deviceId = this.context.device().id();
        }
        if (this.context.accessToken() !== null) {
            baseRequest.context.System.user.accessToken = this.context.accessToken();
        }
        return baseRequest;
    }
    userObject(context) {
        const o = {
            userId: context.user().id(),
        };
        if (context.device().id()) {
            o.permissions = {
                consentToken: uuid.v4(),
            };
        }
        return o;
    }
}
exports.SkillRequest = SkillRequest;
//# sourceMappingURL=SkillRequest.js.map