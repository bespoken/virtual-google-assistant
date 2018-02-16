import * as fs from "fs";
import * as path from "path";
import {ISlotValue, ISlotValueName, SlotType, SlotTypes} from "virtual-core";
import {getEntitiesDirectoryFiles, validateProjectDirectory, INTENT_DIRECTORY, ENTITIES_DIRECTORY} from "./ProjectDirectoryUtils";

export class SlotTypesBuilder {

    public static fromDirectory(directory: string): SlotTypes {
        validateProjectDirectory(directory);
        const { entities, entitiesEntries } = getEntitiesDirectoryFiles(directory);
        const slotTypeArray: SlotType[] = entities.map((entity) => {
            const entityName = entity.replace(".json", "");
            return SlotTypesBuilder.getSlotFromJsonFile(directory, entityName, entitiesEntries);
        });
        return new SlotTypes(slotTypeArray);
    }

    private static getSlotFromJsonFile(directory: string, entity: string, entitiesEntries: string[]): SlotType {
        const entriesForEntity = entitiesEntries.filter((entry) => entry.includes(entity));
        const slotValuesForEntity = entriesForEntity.reduce((slotValues, entry) => {
            const fileData = fs.readFileSync(path.join(directory, ENTITIES_DIRECTORY, entry));
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
