import * as uuid from "uuid";
import {InteractionModel} from "./InteractionModel";
import {IntentSlot} from "virtual-core";
import {GoogleIntent} from "./IntentSchema";

export class RequestType {
    public static INTENT_REQUEST = "IntentRequest";
    public static LAUNCH_REQUEST = "LaunchRequest";
}

export interface ActionRequest {
    intentRequest: (intentName: string) => ActionRequest;
    toJSON: () => any;
    launchRequest: () => ActionRequest;
    withSlot: (slotName: string, slotValue: string) => ActionRequest;
}

/**
 * Creates a the JSON for a Service Request programmatically
 */
export class ActionRequestV1 implements ActionRequest {
    /**
     * The timestamp is a normal JS timestamp without the milliseconds
     */
    protected static timestamp() {
        const timestamp = new Date().toISOString();
        return timestamp.substring(0, 19) + "Z";
    }

    protected requestJSON: any = null;
    protected requestType: string;
    public constructor(private interactionModel: InteractionModel, private locale: string) {}

    protected generateSlotField(slot: IntentSlot) {
        return {
                dataType: "@" + slot.type,
                name: slot.name,
                value: "$" + slot.name,
                // No current support for lists
                isList: false
            };
    }

    /**
     * Generates an intentName request with the specified IntentName
     * @param intentName
     * @returns {ActionRequest}
     */
    public intentRequest(intentName: string): ActionRequest {
        const isBuiltin = intentName.startsWith("sys.");
        if (!isBuiltin) {
            if (!this.interactionModel.hasIntent(intentName)) {
                throw new Error("Interaction model has no intentName named: " + intentName);
            }
        }

        this.requestJSON = this.baseRequest(RequestType.INTENT_REQUEST);
        this.requestJSON.result.metadata.intentName = intentName;

        const intent = this.interactionModel.intentSchema.intent(intentName) as GoogleIntent;

        if (intent.action) {
            this.requestJSON.result.action = intent.action;
        }

        const slots = intent.slots;

        if (!slots) {
            return this;
        }

        this.requestJSON.result.metadata.matchedParameters = [];

        slots.forEach((slot) => {
            this.requestJSON.result.metadata.matchedParameters.push(this.generateSlotField(slot));
        });

        return this;
    }

    public launchRequest(): ActionRequest {
        this.requestType = RequestType.LAUNCH_REQUEST;
        return this.intentRequest("Default Welcome Intent");
    }

    /**
     * Adds a slot to the intentName request (it must be an intentName request)
     * @param slotName
     * @param slotValue
     * @returns {ActionRequest}
     */
    public withSlot(slotName: string, slotValue: string): ActionRequest {
        if (this.requestType !== "IntentRequest") {
            throw Error("Trying to add slot to non-intent request");
        }

        this.requestJSON.result.parameters[slotName] = slotValue;
        return this;
    }

    public toJSON() {
        return this.requestJSON;
    }

    protected baseRequest(requestType: string): any {
        this.requestType = requestType;
        const timestamp = ActionRequestV1.timestamp();

        // First create the header part of the request
        return {
                originalRequest: {
                    "source": "google",
                    "version": "2",
                    "data": {
                        "user": {}
                    },
                },
                id: uuid.v4(),
                timestamp: timestamp,
                lang: this.locale,
                result: {
                    source: "agent",
                    resolvedQuery: "GOOGLE_ASSISTANT_WELCOME",
                    speech: "",
                    actionIncomplete: false,
                    parameters: {},
                    contexts: [
                    ],
                    metadata: {
                        intentId: uuid.v4(),
                        webhookUsed: "true",
                        webhookForSlotFillingUsed: "false",
                        nluResponseTime: 1,
                    },
                    fulfillment: {
                        speech: "",
                        messages: [
                        ]
                    },
                    score: 1
                },
                status: {
                    "code": 200,
                    "errorType": "success",
                    "webhookTimedOut": false
                },
                "sessionId": "1518537462114"
            }
        ;
    }
}

export class ActionRequestV2 implements ActionRequest {

    protected static timestamp() {
        const timestamp = new Date().toISOString();
        return timestamp.substring(0, 19) + "Z";
    }

    protected requestJSON: any = null;
    protected requestType: string;
    public constructor(private interactionModel: InteractionModel, private locale: string) {}

    protected baseRequest(requestType: string): any {
        this.requestType = requestType;

        // First create the header part of the request
        return {
                originalDetectIntentRequest: {
                    "source": "google",
                    "version": "2",
                    "payload": {
                        "user": {}
                    },
                },
                responseId: uuid.v4(),
                queryResult: {
                    queryText: "GOOGLE_ASSISTANT_WELCOME",
                    allRequiredParamsCollected: true,
                    parameters: {},
                    outputContexts: [
                    ],
                    intent: {
                        name: uuid.v4(),
                        webhookState: "true",
                        displayName: "",
                    },
                    diagnosticInfo: {
                        webhookLatencySeconds: 1,
                    },
                    fulfillmentText: "",
                    fulfillmentMessages: [
                        {
                            text: {
                                text: [],
                            },
                        },
                    ],
                    intentDetectionConfidence: 1,
                    languageCode: this.locale,
                },
                "session": "1518537462114"
            }
        ;
    }

    protected generateSlotField(slot: IntentSlot) {
        return {
                dataType: "@" + slot.type,
                name: slot.name,
                value: "$" + slot.name,
                // No current support for lists
                isList: false
            };
    }

    /**
     * Generates an intentName request with the specified IntentName
     * @param intentName
     * @returns {ActionRequest}
     */
    public intentRequest(intentName: string): ActionRequest {
        const isBuiltin = intentName.startsWith("sys.");
        if (!isBuiltin) {
            if (!this.interactionModel.hasIntent(intentName)) {
                throw new Error("Interaction model has no intentName named: " + intentName);
            }
        }

        this.requestJSON = this.baseRequest(RequestType.INTENT_REQUEST);
        this.requestJSON.queryResult.intent.displayName = intentName;

        const intent = this.interactionModel.intentSchema.intent(intentName) as GoogleIntent;

        if (intent.action) {
            this.requestJSON.queryResult.action = intent.action;
        }

        const slots = intent.slots;

        if (!slots) {
            return this;
        }

        this.requestJSON.queryResult.intent.matchedParameters = [];

        slots.forEach((slot) => {
            this.requestJSON.queryResult.intent.matchedParameters.push(this.generateSlotField(slot));
        });

        return this;
    }

    public toJSON() {
        return this.requestJSON;
    }

    public launchRequest(): ActionRequest {
        this.requestType = RequestType.LAUNCH_REQUEST;
        return this.intentRequest("Default Welcome Intent");
    }

    /**
     * Adds a slot to the intentName request (it must be an intentName request)
     * @param slotName
     * @param slotValue
     * @returns {ActionRequest}
     */
    public withSlot(slotName: string, slotValue: string): ActionRequest {
        if (this.requestType !== RequestType.INTENT_REQUEST) {
            throw Error("Trying to add slot to non-intent request");
        }

        this.requestJSON.queryResult.parameters[slotName] = slotValue;
        return this;
    }
}