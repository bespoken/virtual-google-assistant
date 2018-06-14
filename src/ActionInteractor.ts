import {ActionRequest, ActionRequestV1, ActionRequestV2} from "./ActionRequest";
import {InteractionModel} from "./InteractionModel";
import {Utterance} from "virtual-core";

/**
 * ActionInteractor works with an action via HTTP calls to a URL
 *
 */
export abstract class ActionInteractor {
    protected requestFilters: RequestFilter[] = [];

    public constructor(protected interactionModel: InteractionModel, private locale: string) {
    }

    /**
     * Calls the action with specified phrase
     * Hits the callback with the JSON payload from the response
     * @param utteranceString
     */
    public spoken(utteranceString: string): Promise<any> {
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

    public launched(): Promise<any> {
        const ActionRequestVersion = this.interactionModel.dialogFlowApiVersion === "v1"? ActionRequestV1 : ActionRequestV2;
        const serviceRequest = new ActionRequestVersion(this.interactionModel, this.locale);
        serviceRequest.launchRequest();
        return this.callSkill(serviceRequest);
    }

    /**
     * Passes in an intent with slots as a simple JSON map: {slot1: "value", slot2: "value2", etc.}
     * @param intentName
     * @param slots
     */
    public async intended(intentName: string, slots?: any): Promise<any> {
        return this.callSkillWithIntent(intentName, slots);
    }

    public addFilter(requestFilter: RequestFilter): void {
        this.requestFilters.push(requestFilter);
    }

    public resetFilters(): void {
        this.requestFilters = [];
    }

    public async callSkill(serviceRequest: ActionRequest): Promise<any>  {
        const requestJSON = serviceRequest.toJSON();
        if (this.requestFilters.length) {
            this.requestFilters.forEach((requestFilter: RequestFilter) => {
                requestFilter(requestJSON);
            });
        }

        return this.invoke(requestJSON);
    }

    protected abstract invoke(requestJSON: any): Promise<any>;

    private async callSkillWithIntent(intentName: string, slots?: any): Promise<any> {
        const ActionRequestVersion = this.interactionModel.dialogFlowApiVersion === "v1"? ActionRequestV1 : ActionRequestV2;
        const serviceRequest = new ActionRequestVersion(this.interactionModel, this.locale).intentRequest(intentName);
        if (slots !== undefined && slots !== null) {
            for (const slotName of Object.keys(slots)) {
                serviceRequest.withSlot(slotName, slots[slotName]);
            }
        }

        return this.callSkill(serviceRequest);
    }
}

export type RequestFilter = (request: any) => void;
