import {ActionRequest} from "./ActionRequest";
import {InteractionModel} from "./InteractionModel";
import {Utterance} from "virtual-core";

/**
 * ActionInteractor works with an action via HTTP calls to a URL
 *
 */
export class ActionInteractor {
    public constructor(protected interactionModel: InteractionModel) {
    }

    /**
     * Calls the action with specified phrase
     * Hits the callback with the JSON payload from the response
     * @param utteranceString
     */
    public spoken(utteranceString: string) {
        // TODO: update with invoker, right now used to complete the json generation flow
        let utterance = new Utterance(this.interactionModel, utteranceString);

        // If we don't match anything, we use the default utterance - simple algorithm for this
        if (!utterance.matched()) {
            const defaultPhrase = this.interactionModel.sampleUtterances.defaultUtterance();
            utterance = new Utterance(this.interactionModel, defaultPhrase.phrase);
            console.warn("No intentName matches utterance: " + utteranceString
                + ". Using fallback utterance: " + defaultPhrase.phrase);
        }

        return this.callSkillWithIntent(utterance.intent(), utterance.toJSON());
    }

    public launched() {
        const serviceRequest = new ActionRequest(this.interactionModel);
        serviceRequest.launchRequest();
        return this.callSkill(serviceRequest);
    }

    /**
     * Passes in an intent with slots as a simple JSON map: {slot1: "value", slot2: "value2", etc.}
     * @param intentName
     * @param slots
     */
    public async intended(intentName: string, slots?: any) {
        return this.callSkillWithIntent(intentName, slots);
    }

    public async callSkill(serviceRequest: ActionRequest) {
        // TODO: update with invoker, right now used to complete the json generation flow
        const requestJSON = serviceRequest.toJSON();

        // TODO: will be uncommented when invoke is implemented
        // const result: any = await this.invoke(requestJSON);

        // TODO: returning request and will be changed to response once invoker is implemented
        return serviceRequest;
    }

    // TODO: to be implemented
    protected invoke(requestJSON: any): any {
        return null;
    }

    private async callSkillWithIntent(intentName: string, slots?: any) {
        // TODO: update with invoker, right now used to complete the json generation flow

        const serviceRequest = new ActionRequest(this.interactionModel).intentRequest(intentName);
        if (slots !== undefined && slots !== null) {
            for (const slotName of Object.keys(slots)) {
                serviceRequest.withSlot(slotName, slots[slotName]);
            }
        }

        const result = await this.callSkill(serviceRequest);

        return result;
    }
}
