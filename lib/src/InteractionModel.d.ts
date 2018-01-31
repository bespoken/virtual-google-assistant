import { IModel, SampleUtterances, SlotTypes } from "virtual-core";
import { IntentSchema } from "./IntentSchema";
export declare class InteractionModel implements IModel {
    intentSchema: IntentSchema;
    sampleUtterances: SampleUtterances;
    slotTypes: SlotTypes;
    static fromFile(interactionModelFile: any): InteractionModel;
    static fromJSON(interactionModel: any): InteractionModel;
    static fromLocale(locale: string): InteractionModel;
    constructor(intentSchema: IntentSchema, sampleUtterances: SampleUtterances, slotTypes?: SlotTypes);
    hasIntent(intent: string): boolean;
}
