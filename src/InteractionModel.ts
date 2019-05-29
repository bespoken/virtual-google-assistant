import {IModel, SampleUtterances, SlotTypes} from "virtual-core";
import {BuiltinSlotTypes} from "./BuiltinSlotTypes";
import {BuiltinUtterances} from "./BuiltinUtterances";
import {IntentSchema} from "./IntentSchema";
import {SampleUtterancesBuilder} from "./SampleUtterancesBuilder";
import {SlotTypesBuilder} from "./SlotTypesBuilder";
import {getDialogFlowApiVersion} from "./ProjectDirectoryUtils";

/**
 * Parses and interprets an interaction model
 * Takes in the intents and utterances from the project directory
 * Then can take a phrase and create an intentName request based on it
 */
export class InteractionModel implements IModel {

    // Parse the project containing everything for the InteractionModel to work
    public static fromDirectory(directory: string): InteractionModel {
        const schema = IntentSchema.fromDirectory(directory);
        const samples = SampleUtterancesBuilder.fromDirectory(directory);
        const entities = SlotTypesBuilder.fromDirectory(directory);
        const dialogFlowApiVersion = getDialogFlowApiVersion(directory);
        return new InteractionModel(schema, samples, entities, dialogFlowApiVersion);
    }

    public constructor(public intentSchema: IntentSchema,
                       public sampleUtterances: SampleUtterances,
                       public slotTypes?: SlotTypes,
                       public dialogFlowApiVersion = "v2"
                    ) {
        if (!this.slotTypes) {
            this.slotTypes = new SlotTypes([]);
        }

        this.sampleUtterances.setInteractionModel(this);

        const builtinValues = BuiltinUtterances.values();
        // We add each phrase one-by-one
        // It is possible the built-ins have additional samples defined
        for (const key of Object.keys(builtinValues)) {
            if (this.hasIntent(key)) {
                for (const phrase of builtinValues[key]) {
                    this.sampleUtterances.addSample(key, phrase);
                }
            }
        }

        this.slotTypes.addTypes(BuiltinSlotTypes.values());
    }

    public hasIntent(intent: string): boolean {
        return this.intentSchema.hasIntent(intent);
    }
}
