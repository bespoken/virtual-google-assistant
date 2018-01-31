"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AudioItem {
    constructor(_json) {
        this._json = _json;
        this.stream = new AudioItemStream();
        this.stream.url = _json.stream.url;
        this.stream.token = _json.stream.token;
        this.stream.expectedPreviousToken = _json.stream.expectedPreviousToken;
        this.stream.offsetInMilliseconds = _json.stream.offsetInMilliseconds;
    }
    clone() {
        return new AudioItem(this);
    }
}
exports.AudioItem = AudioItem;
class AudioItemStream {
    constructor() {
        this.url = null;
        this.token = null;
        this.expectedPreviousToken = null;
    }
}
exports.AudioItemStream = AudioItemStream;
//# sourceMappingURL=AudioItem.js.map