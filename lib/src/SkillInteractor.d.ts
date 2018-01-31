import { InteractionModel } from "./InteractionModel";
import { SkillContext } from "./SkillContext";
import { SessionEndedReason, SkillRequest } from "./SkillRequest";
import { SkillResponse } from "./SkillResponse";
import { RequestFilter } from "./VirtualAlexa";
export declare abstract class SkillInteractor {
    protected model: InteractionModel;
    protected requestFilter: RequestFilter;
    protected skillContext: SkillContext;
    constructor(model: InteractionModel, locale: string, applicationID?: string);
    context(): SkillContext;
    spoken(utteranceString: string): Promise<SkillResponse>;
    launched(): Promise<any>;
    sessionEnded(sessionEndedReason: SessionEndedReason, errorData?: any): Promise<any>;
    intended(intentName: string, slots?: any): Promise<SkillResponse>;
    filter(requestFilter: RequestFilter): void;
    callSkill(serviceRequest: SkillRequest): Promise<SkillResponse>;
    protected abstract invoke(requestJSON: any): Promise<any>;
    private callSkillWithIntent(intentName, slots?);
    private interactionModel();
}
