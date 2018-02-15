import * as fs from "fs";
import * as path from "path";

export const INTENT_FOLDER = "intents";
export const AGENT_JSON = "agent.json";
export const ENTITIES_FOLDER = "entities";

export interface IIntentFolderFiles {
    intentFiles: string[],
    utterancesFiles: string[],
}

export function validateProjectFolder(folder: string): boolean {
    const intentFolder = path.join(folder, INTENT_FOLDER);
    if (!fs.existsSync(path.join(folder, AGENT_JSON))) {
        throw new Error("Missing agent.json, please verify you are providing the correct folder");
    }

    if (!fs.existsSync(intentFolder)) {
        throw new Error("Missing the intents folder, please verify you are providing the correct folder");
    }

    return true;
}

export function getIntentFolderFiles(folder: string): IIntentFolderFiles {
    const intentFolder = path.join(folder, INTENT_FOLDER);
    const fileList = fs.readdirSync(intentFolder);

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

}

export interface IEntitiesFolderFiles {
    entities: string[],
    entitiesEntries: string[],
}

export function getEntitiesFolderFiles(folder: string): IEntitiesFolderFiles {
    const entitiesFolder = path.join(folder, ENTITIES_FOLDER);

    if (!fs.exists(entitiesFolder)) {
        return {
            entities: [],
            entitiesEntries: [],
        };
    }

    const fileList = fs.readdirSync(entitiesFolder);

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