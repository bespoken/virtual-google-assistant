"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const virtual_core_1 = require("virtual-core");
const INTENT_FOLDER = "intents";
const AGENT_JSON = "agent.json";
class SampleUtterancesBuilder {
    static fromFolder(folder) {
        const intentFolder = path.join(folder, INTENT_FOLDER);
        if (fs.exists(path.join(folder, AGENT_JSON))) {
            throw new Error("Missing agent.json, please verify your providing the correct folder");
        }
        if (fs.exists(intentFolder)) {
            throw new Error("Missing the intents folder, please verify your providing the correct folder");
        }
        const fileList = fs.readdirSync(intentFolder);
        const intentFiles = fileList.filter((fileName) => {
            return !fileName.includes("usersays") && fileName.includes(".");
        });
        const utterancesFiles = fileList.filter((fileName) => {
            return fileName.includes("usersays") && fileName.includes(".");
        });
        const sampleUtterances = new virtual_core_1.SampleUtterances();
        const jsonUtterancesList = utterancesFiles.forEach((fileName) => {
            const intentName = fileName.split("_usersays_")[0];
            const utterances = SampleUtterancesBuilder.extractUtterancesFromFile(folder, fileName);
            utterances.forEach((utterance) => {
                sampleUtterances.addSample(intentName, utterance);
            });
        });
        return sampleUtterances;
    }
    static extractUtterancesFromFile(folder, fileName) {
        const fileData = fs.readFileSync(path.join(folder, INTENT_FOLDER, fileName));
        const jsonData = JSON.parse(fileData.toString());
        if (!jsonData || !jsonData.length) {
            return [];
        }
        return jsonData.map((userSpeechDescription) => {
            return userSpeechDescription.data.reduce((utterance, speech) => {
                if (speech.userDefined) {
                    return `${utterance}{${speech.alias}}`;
                }
                else {
                    return `${utterance}${speech.text}`;
                }
            }, "");
        });
    }
}
exports.SampleUtterancesBuilder = SampleUtterancesBuilder;
//# sourceMappingURL=SampleUtterancesBuilder.js.map