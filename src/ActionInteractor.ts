import * as http from "http";
import * as https from "https";
import * as URL from "url";
import {ActionRequest} from "./ActionRequest";
import {InteractionModel} from "./InteractionModel";
import {Utterance} from "virtual-core";

/**
 * ActionInteractor works with an action via HTTP calls to a URL
 *
 */
export class ActionInteractor {
    protected requestFilters: RequestFilter[] = [];

    public constructor(protected interactionModel: InteractionModel, private urlString: string) {
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
        const serviceRequest = new ActionRequest(this.interactionModel);
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

    protected invoke(requestJSON: any): Promise<any> {
        const httpModule: any = this.urlString.startsWith("https") ? https : http;
        const url = URL.parse(this.urlString);
        const requestString = JSON.stringify(requestJSON);

        const requestOptions = {
            headers: {
                "Content-Length": Buffer.byteLength(requestString),
                "Content-Type": "application/json",
            },
            hostname: url.hostname,
            method: "POST",
            path: url.path,
            port: url.port ? parseInt(url.port, 10) : undefined,
        };

        return new Promise((resolve, reject) => {
            const req = httpModule.request(requestOptions, (response: any) => {
                if (response.statusCode !== 200) {
                    reject("Invalid response: " + response.statusCode + " Message: " + response.statusMessage);
                    return;
                }

                let responseString = "";
                response.setEncoding("utf8");
                response.on("data", (chunk: string) => {
                    responseString = responseString + chunk;
                });

                response.on("end", () => {
                    try {
                        const responseJSON = JSON.parse(responseString);
                        resolve(responseJSON);
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on("error", (e: Error) => {
                console.error(`problem with request: ${e.message}`);
                reject(e);
            });

            req.write(requestString);
            req.end();
        });
    }

    private async callSkillWithIntent(intentName: string, slots?: any): Promise<any> {

        const serviceRequest = new ActionRequest(this.interactionModel).intentRequest(intentName);
        if (slots !== undefined && slots !== null) {
            for (const slotName of Object.keys(slots)) {
                serviceRequest.withSlot(slotName, slots[slotName]);
            }
        }

        return this.callSkill(serviceRequest);
    }
}

export type RequestFilter = (request: any) => void;
