"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const virtual_core_1 = require("virtual-core");
class IntentSchema {
    constructor(schemaJSON) {
        this.schemaJSON = schemaJSON;
    }
    static fromFile(file) {
        const data = fs.readFileSync(file);
        const json = JSON.parse(data.toString());
        return IntentSchema.fromJSON(json);
    }
    static fromJSON(schemaJSON) {
        return new IntentSchema(schemaJSON);
    }
    intents() {
        const intentArray = [];
        for (const intentJSON of this.schemaJSON.intents) {
            const intent = new virtual_core_1.Intent(intentJSON.intent);
            if (intentJSON.slots !== undefined && intentJSON.slots !== null) {
                for (const slotJSON of intentJSON.slots) {
                    intent.addSlot(new virtual_core_1.IntentSlot(slotJSON.name, slotJSON.type));
                }
            }
            intentArray.push(intent);
        }
        return intentArray;
    }
    intent(intentString) {
        let intent = null;
        for (const o of this.intents()) {
            if (o.name === intentString) {
                intent = o;
                break;
            }
        }
        return intent;
    }
    hasIntent(intentString) {
        return this.intent(intentString) !== null;
    }
}
exports.IntentSchema = IntentSchema;
//# sourceMappingURL=IntentSchema.js.map