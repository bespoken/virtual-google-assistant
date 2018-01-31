import { IIntentSchema, Intent } from "virtual-core";
export declare class IntentSchema implements IIntentSchema {
    schemaJSON: any;
    static fromFile(file: string): IntentSchema;
    static fromJSON(schemaJSON: any): IntentSchema;
    constructor(schemaJSON: any);
    intents(): Intent[];
    intent(intentString: string): Intent;
    hasIntent(intentString: string): boolean;
}
