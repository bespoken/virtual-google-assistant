"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const virtual_core_1 = require("virtual-core");
class SampleUtterancesBuilder {
    static fromFile(file) {
        const data = fs.readFileSync(file);
        const utterances = new virtual_core_1.SampleUtterances();
        SampleUtterancesBuilder.parseFlatFile(utterances, data.toString());
        return utterances;
    }
    static fromJSON(sampleUtterancesJSON) {
        const sampleUtterances = new virtual_core_1.SampleUtterances();
        for (const intent of Object.keys(sampleUtterancesJSON)) {
            for (const sample of sampleUtterancesJSON[intent]) {
                sampleUtterances.addSample(intent, sample);
            }
        }
        return sampleUtterances;
    }
    static parseFlatFile(utterances, fileData) {
        const lines = fileData.split("\n");
        for (const line of lines) {
            if (line.trim().length === 0) {
                continue;
            }
            const index = line.indexOf(" ");
            if (index === -1) {
                throw Error("Invalid sample utterance: " + line);
            }
            const intent = line.substr(0, index);
            const sample = line.substr(index).trim();
            utterances.addSample(intent, sample);
        }
    }
}
exports.SampleUtterancesBuilder = SampleUtterancesBuilder;
//# sourceMappingURL=SampleUtterancesBuilder.js.map