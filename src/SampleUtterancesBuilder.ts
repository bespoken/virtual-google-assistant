import * as fs from "fs";
import * as path from "path";
import {SampleUtterances} from "virtual-core";
import {INTENT_FOLDER, AGENT_JSON, validateProjectFolder, getIntentFolderFiles} from "./ProjectFolderUtils";

export class SampleUtterancesBuilder {
    public static fromFolder(folder: string): SampleUtterances {
        const intentFolder = path.join(folder, INTENT_FOLDER);

        // This will throw an exception on any issue
        validateProjectFolder(folder);

        const { utterancesFiles } = getIntentFolderFiles(folder);
        const sampleUtterances = new SampleUtterances();
        const jsonUtterancesList = utterancesFiles.forEach(( fileName) => {
            const intentName = fileName.split("_usersays_")[0];
            const utterances = SampleUtterancesBuilder.extractUtterancesFromFile(folder, fileName);
            utterances.forEach((utterance) => {
                sampleUtterances.addSample(intentName, utterance);
                console.log("sampleUtterances", sampleUtterances);
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

        return jsonData.map((userSpeechDescription: IDialogFlowUtterance) => {
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