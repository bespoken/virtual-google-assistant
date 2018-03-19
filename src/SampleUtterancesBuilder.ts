import * as fs from "fs";
import * as path from "path";
import {SampleUtterances} from "virtual-core";
import {INTENT_DIRECTORY, AGENT_JSON, validateProjectDirectory, getIntentDirectoryFiles} from "./ProjectDirectoryUtils";

export class SampleUtterancesBuilder {
    public static fromDirectory(directory: string): SampleUtterances {
        const intentDirectory = path.join(directory, INTENT_DIRECTORY);

        // This will throw an exception on any issue
        validateProjectDirectory(directory);

        const { utterancesFiles } = getIntentDirectoryFiles(directory);
        const sampleUtterances = new SampleUtterances();
        const jsonUtterancesList = utterancesFiles.forEach((fileName) => {
            const intentName = fileName.split("_usersays_")[0];
            const utterances = SampleUtterancesBuilder.extractUtterancesFromFile(directory, fileName);
            utterances.forEach((utterance) => {
                sampleUtterances.addSample(intentName, utterance);
            });
        });

        return sampleUtterances;
    }

    private static extractUtterancesFromFile(directory: string, fileName: string): string []{
        const fileData = fs.readFileSync(path.join(directory, INTENT_DIRECTORY, fileName));
        const jsonData: IDialogFlowUtterance[] = JSON.parse(fileData.toString());
        if (!jsonData || !jsonData.length) {
            return [];
        }

        return jsonData.map((userSpeechDescription: IDialogFlowUtterance) => {
            return userSpeechDescription.data.reduce((utterance: string, speech: ISpeechDescription) => {
                // If a slot is userDefined but doesn't have an alias it's an @sys.ignore which is the same as text
                // for the purpose of matching the intent.
                if (speech.userDefined && speech.alias) {
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