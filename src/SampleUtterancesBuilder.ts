import * as fs from "fs";
import * as path from "path";
import {SampleUtterances} from "virtual-core";

const INTENT_FOLDER = "intents";
const AGENT_JSON = "agent.json";

export class SampleUtterancesBuilder {
    public static fromFolder(folder: string): SampleUtterances {
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

        const sampleUtterances = new SampleUtterances();
        const jsonUtterancesList = utterancesFiles.forEach(( fileName) => {
            const intentName = fileName.split("_usersays_")[0];
            const utterances = SampleUtterancesBuilder.extractUtterancesFromFile(folder, fileName);
            utterances.forEach((utterance) => {
                sampleUtterances.addSample(fileName, utterance);
            });
        });

        return sampleUtterances;
    }

    private static extractUtterancesFromFile(folder: string, fileName: string): string []{
        const fileData = fs.readFileSync(path.join(folder, INTENT_FOLDER, fileName));
        const jsonData: IDialogFlowUtterance[] = JSON.parse(fileData.toString());
        if (!jsonData || !jsonData.length) {
            return [];
        }

        const utteranceList = jsonData.map((userSpeechDescription: IDialogFlowUtterance) => {
            return userSpeechDescription.data.reduce((utterance: string, speech: ISpeechDescription) => {
                if (speech.userDefined) {
                    return `${utterance}{${speech.alias}}`;
                } else {
                    return `${utterance}${speech.text}`;
                }
            }, "");
        });

    }
}


interface IDialogFlowUtterance {
    id: string,
    data: ISpeechDescription[],
}

interface ISpeechDescription {
    text: string,
    userDefined: boolean,
    alias?: string,
    meta?: string,
}