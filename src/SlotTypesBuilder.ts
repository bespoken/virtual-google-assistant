import * as fs from "fs";
import * as path from "path";
import {ISlotValue, ISlotValueName, SlotType, SlotTypes} from "virtual-core";
import {getEntitiesFolderFiles, validateProjectFolder, INTENT_FOLDER, ENTITIES_FOLDER} from "./ProjectFolderUtils";

export class SlotTypesBuilder {

    public static fromFolder(folder: string): SlotTypes {
        validateProjectFolder(folder);
        const { entities, entitiesEntries } = getEntitiesFolderFiles(folder);
        const slotTypeArray: SlotType[] = entities.map((entity) => {
            const entityName = entity.replace(".json", "");
            return SlotTypesBuilder.getSlotFromJsonFile(folder, entityName, entitiesEntries);
        });
        return new SlotTypes(slotTypeArray);
    }

    private static getSlotFromJsonFile(folder: string, entity: string, entitiesEntries: string[]): SlotType {
        const entriesForEntity = entitiesEntries.filter((entry) => entry.includes(entity));
        const slotValuesForEntity = entriesForEntity.reduce((slotValues, entry) => {
            const fileData = fs.readFileSync(path.join(folder, ENTITIES_FOLDER, entry));
            const slotValueNames:ISlotValueName[] = JSON.parse(fileData.toString());
            const slotValuesFromEntry: ISlotValue[] = slotValueNames.map((slotValueName) => {
                return {
                    name: slotValueName,
                };
            });

            return slotValues.concat(slotValuesFromEntry);
        }, []);

        return new SlotType(entity, slotValuesForEntity);
    }
}
