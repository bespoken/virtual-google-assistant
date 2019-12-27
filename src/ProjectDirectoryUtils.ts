import * as fs from "fs";
import * as path from "path";

export const INTENT_DIRECTORY = "intents";
export const AGENT_JSON = "agent.json";
export const ENTITIES_DIRECTORY = "entities";

export interface IIntentDirectoryFiles {
    intentFiles: string[],
    utterancesFiles: string[],
}

export function validateProjectDirectory(directory: string): boolean {
    const intentDirectory = path.join(directory, INTENT_DIRECTORY);
    if (!fs.existsSync(path.join(directory, AGENT_JSON))) {
        throw new Error("Missing agent.json, please verify you are providing the correct directory");
    }

    if (!fs.existsSync(intentDirectory)) {
        throw new Error("Missing the intents directory, please verify you are providing the correct directory");
    }

    return true;
}

export function getIntentDirectoryFiles(directory: string): IIntentDirectoryFiles {
    try {
        const intentDirectory = path.join(directory, INTENT_DIRECTORY);
        const fileList = fs.readdirSync(intentDirectory);

        const intentFiles = fileList.filter((fileName) => {
            return !fileName.includes("usersays") && fileName.includes(".");
        });
        const utterancesFiles = fileList.filter((fileName) => {
            return fileName.includes("usersays") && fileName.includes(".");
        });

        return {
            intentFiles,
            utterancesFiles,
        };
    } catch (e) {
        if (e.message.includes("ENOENT")) {
            throw new Error("The interaction model for your Google Action could not be found under:\n" +
                path.join(directory, INTENT_DIRECTORY) +
                "\nPlease provide the correct location of the Dialog Flow directory.")
        }
        throw e;
    }

}

export function getDialogFlowApiVersion(directory: string): string {
    const agentFile = path.join(directory, AGENT_JSON)
    if (!fs.existsSync(agentFile)) {
        throw new Error("Missing agent.json, please verify you are providing the correct directory");
    }
    const fileData = fs.readFileSync(agentFile);
    const jsonData: any = JSON.parse(fileData.toString());
    if(!jsonData.onePlatformApiVersion) return "v1";
    return jsonData.onePlatformApiVersion;
} 

export interface IEntitiesDirectoryFiles {
    entities: string[],
    entitiesEntries: string[],
}

export function getEntitiesDirectoryFiles(directory: string): IEntitiesDirectoryFiles {
    const entitiesDirectory = path.join(directory, ENTITIES_DIRECTORY);

    if (!fs.existsSync(entitiesDirectory)) {
        return {
            entities: [],
            entitiesEntries: [],
        };
    }

    const fileList = fs.readdirSync(entitiesDirectory);

    const entities = fileList.filter((fileName) => {
        return !fileName.includes("entries");
    });
    const entitiesEntries = fileList.filter((fileName) => {
        return fileName.includes("entries");
    });

    return {
        entities,
        entitiesEntries,
    };
}