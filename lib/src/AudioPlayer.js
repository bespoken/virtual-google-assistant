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
const AudioItem_1 = require("./AudioItem");
const SkillRequest_1 = require("./SkillRequest");
var AudioPlayerActivity;
(function (AudioPlayerActivity) {
    AudioPlayerActivity[AudioPlayerActivity["BUFFER_UNDERRUN"] = 0] = "BUFFER_UNDERRUN";
    AudioPlayerActivity[AudioPlayerActivity["FINISHED"] = 1] = "FINISHED";
    AudioPlayerActivity[AudioPlayerActivity["IDLE"] = 2] = "IDLE";
    AudioPlayerActivity[AudioPlayerActivity["PLAYING"] = 3] = "PLAYING";
    AudioPlayerActivity[AudioPlayerActivity["PAUSED"] = 4] = "PAUSED";
    AudioPlayerActivity[AudioPlayerActivity["STOPPED"] = 5] = "STOPPED";
})(AudioPlayerActivity = exports.AudioPlayerActivity || (exports.AudioPlayerActivity = {}));
class AudioPlayer {
    constructor(_interactor) {
        this._playing = null;
        this._queue = [];
        this._activity = null;
        this._suspended = false;
        this._activity = AudioPlayerActivity.IDLE;
        this._interactor = _interactor;
    }
    isPlaying() {
        return (this._activity === AudioPlayerActivity.PLAYING);
    }
    playbackOffset(offset) {
        if (this.isPlaying()) {
            this.playing().stream.offsetInMilliseconds = offset;
        }
    }
    playbackNearlyFinished() {
        return this.audioPlayerRequest(SkillRequest_1.RequestType.AUDIO_PLAYER_PLAYBACK_NEARLY_FINISHED);
    }
    playbackFinished() {
        this._activity = AudioPlayerActivity.FINISHED;
        const promise = this.audioPlayerRequest(SkillRequest_1.RequestType.AUDIO_PLAYER_PLAYBACK_FINISHED);
        this.playNext();
        return promise;
    }
    playbackStarted() {
        this._activity = AudioPlayerActivity.PLAYING;
        return this.audioPlayerRequest(SkillRequest_1.RequestType.AUDIO_PLAYER_PLAYBACK_STARTED);
    }
    playbackStopped() {
        this._activity = AudioPlayerActivity.STOPPED;
        return this.audioPlayerRequest(SkillRequest_1.RequestType.AUDIO_PLAYER_PLAYBACK_STOPPED);
    }
    playerActivity() {
        return this._activity;
    }
    playing() {
        return this._playing;
    }
    resume() {
        this._suspended = false;
        if (!this.isPlaying()) {
            this.playbackStarted();
        }
    }
    suspend() {
        this._suspended = true;
        this.playbackStopped();
    }
    suspended() {
        return this._suspended;
    }
    directivesReceived(directives) {
        for (const directive of directives) {
            this.handleDirective(directive);
        }
    }
    audioPlayerRequest(requestType) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowPlaying = this.playing();
            const serviceRequest = new SkillRequest_1.SkillRequest(this._interactor.context());
            serviceRequest.audioPlayerRequest(requestType, nowPlaying.stream.token, nowPlaying.stream.offsetInMilliseconds);
            return this._interactor.callSkill(serviceRequest);
        });
    }
    enqueue(audioItem, playBehavior) {
        if (playBehavior === AudioPlayer.PLAY_BEHAVIOR_ENQUEUE) {
            this._queue.push(audioItem);
        }
        else if (playBehavior === AudioPlayer.PLAY_BEHAVIOR_REPLACE_ALL) {
            if (this.isPlaying()) {
                this.playbackStopped();
            }
            this._queue = [];
            this._queue.push(audioItem);
        }
        else if (playBehavior === AudioPlayer.PLAY_BEHAVIOR_REPLACE_ENQUEUED) {
            this._queue = [];
            this._queue.push(audioItem);
        }
        if (!this.isPlaying()) {
            this.playNext();
        }
    }
    handleDirective(directive) {
        if (directive.type === AudioPlayer.DIRECTIVE_PLAY) {
            const audioItem = new AudioItem_1.AudioItem(directive.audioItem);
            const playBehavior = directive.playBehavior;
            this.enqueue(audioItem, playBehavior);
        }
        else if (directive.type === AudioPlayer.DIRECTIVE_STOP) {
            if (this.suspended()) {
                this._suspended = false;
            }
            else if (this.playing()) {
                this.playbackStopped();
            }
        }
    }
    dequeue() {
        const audioItem = this._queue[0];
        this._queue = this._queue.slice(1);
        return audioItem;
    }
    playNext() {
        if (this._queue.length === 0) {
            return;
        }
        this._playing = this.dequeue();
        if (this._playing.stream.url.startsWith("http:")) {
            this._interactor.sessionEnded(SkillRequest_1.SessionEndedReason.ERROR, {
                message: "The URL specified in the Play directive must be HTTPS",
                type: "INVALID_RESPONSE",
            });
        }
        else {
            this.playbackStarted();
        }
    }
}
AudioPlayer.DIRECTIVE_PLAY = "AudioPlayer.Play";
AudioPlayer.DIRECTIVE_STOP = "AudioPlayer.Stop";
AudioPlayer.DIRECTIVE_CLEAR_QUEUE = "AudioPlayer.ClearQueue";
AudioPlayer.PLAY_BEHAVIOR_REPLACE_ALL = "REPLACE_ALL";
AudioPlayer.PLAY_BEHAVIOR_ENQUEUE = "ENQUEUE";
AudioPlayer.PLAY_BEHAVIOR_REPLACE_ENQUEUED = "REPLACE_ENQUEUED";
exports.AudioPlayer = AudioPlayer;
//# sourceMappingURL=AudioPlayer.js.map