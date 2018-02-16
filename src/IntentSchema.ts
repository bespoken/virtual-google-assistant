import * as fs from "fs";
import * as path from "path";
import {IIntentSchema, Intent, IntentSlot} from "virtual-core";
import {getIntentDirectoryFiles, INTENT_DIRECTORY} from "./ProjectDirectoryUtils";

export class IntentSchema implements IIntentSchema{

    public static fromDirectory(directory: string): IntentSchema {
        const { intentFiles } = getIntentDirectoryFiles(directory);
        const intentArray = intentFiles.map((intentFile) => {
            return IntentSchema.getIntentArrayFromJsonFile(directory, intentFile);
        });

        return new IntentSchema(intentArray);
    }

    public constructor(private intentArray: Intent[]){

    }

    public intents(): Intent[] {
       return this.intentArray;
    }

    public intent(intentString: string): Intent {
        let intent: Intent = null;
        for (const o of this.intents()) {
            if (o.name === intentString) {
                intent = o;
                break;
            }
        }
        return intent;
    }

    public hasIntent(intentString: string): boolean {
        return this.intent(intentString) !== null;
    }

    private static getIntentArrayFromJsonFile(directory: string, fileName: string): Intent {
        const fileData = fs.readFileSync(path.join(directory, INTENT_DIRECTORY, fileName));
        const jsonData: IDialogFlowIntent = JSON.parse(fileData.toString());
        const intentName = fileName.replace(".json", "");

        // Even for intents with multiple languages tests have shown only one response in the JSON.
        // So we are always taking the first one
        const parameters = jsonData.responses[0].parameters;
        const intent = new Intent(intentName);
        parameters.forEach((parameter) => {
            const slot = new IntentSlot(parameter.name, parameter.dataType.replace("@", ""));
            intent.addSlot(slot);
        });

        return intent;
    }
}

interface IDialogFlowIntent {
    responses: IDialogFlowResponse[],
}

interface IDialogFlowResponse {
    parameters: IDialogFlowParameter[],
}
interface IDialogFlowParameter {
    dataType: string,
    name: string,
}