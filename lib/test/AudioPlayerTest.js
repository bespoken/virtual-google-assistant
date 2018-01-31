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
const interactionModel = {
    intents: [
        {
            name: "Ignore",
            samples: ["ignore"],
        },
        {
            name: "Play",
            samples: ["play", "play next", "play now"],
        },
        {
            name: "AMAZON.NextIntent",
        },
        {
            name: "AMAZON.PauseIntent",
        },
        {
            name: "AMAZON.PreviousIntent",
        },
        {
            name: "AMAZON.ResumeIntent",
        },
    ],
    types: [],
};
describe("AudioPlayer launches and plays a track", function () {
    it("Plays a track", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.SimpleAudioPlayer.handler")
            .interactionModel(interactionModel)
            .create();
        try {
            const requests = [];
            virtualAlexa.filter((json) => {
                requests.push(json.request);
            });
            yield virtualAlexa.launch();
            const reply = yield virtualAlexa.utter("play");
            chai_1.assert.include(reply.response.directives[0].audioItem.stream.url, "episode-013");
            chai_1.assert.isTrue(virtualAlexa.audioPlayer().isPlaying());
        }
        catch (e) {
            console.log(e);
        }
    }));
    it("Plays a track, next then previous", () => __awaiter(this, void 0, void 0, function* () {
        const virtualAlexa = VirtualAlexa_1.VirtualAlexa.Builder()
            .handler("test.resources.SimpleAudioPlayer.handler")
            .interactionModel(interactionModel)
            .create();
        try {
            const requests = [];
            virtualAlexa.filter((json) => {
                requests.push(json.request);
            });
            let result = yield virtualAlexa.launch();
            chai_1.assert.include(result.response.outputSpeech.ssml, "Welcome to the Simple Audio Player");
            result = yield virtualAlexa.utter("play");
            chai_1.assert.include(result.response.directives[0].audioItem.stream.url, "episode-013");
            result = yield virtualAlexa.utter("next");
            chai_1.assert.include(result.response.directives[0].audioItem.stream.url, "episode-012");
            result = yield virtualAlexa.utter("previous");
            chai_1.assert.include(result.response.directives[0].audioItem.stream.url, "episode-013");
            result = yield virtualAlexa.utter("ignore");
            chai_1.assert.equal(requests[0].type, "LaunchRequest");
            chai_1.assert.equal(requests[1].type, "IntentRequest");
            chai_1.assert.equal(requests[2].type, "AudioPlayer.PlaybackStarted");
            chai_1.assert.equal(requests[3].type, "AudioPlayer.PlaybackStopped");
            chai_1.assert.equal(requests[4].type, "IntentRequest");
            chai_1.assert.equal(requests[5].type, "AudioPlayer.PlaybackStarted");
            chai_1.assert.equal(requests[6].type, "AudioPlayer.PlaybackStopped");
            chai_1.assert.equal(requests[7].type, "IntentRequest");
            chai_1.assert.equal(requests[8].type, "AudioPlayer.PlaybackStarted");
        }
        catch (e) {
            chai_1.assert.fail(e);
        }
    }));
});
//# sourceMappingURL=AudioPlayerTest.js.map