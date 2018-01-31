import { InteractionModel } from "./InteractionModel";
import { SkillInteractor } from "./SkillInteractor";
export declare class LocalSkillInteractor extends SkillInteractor {
    private handler;
    protected model: InteractionModel;
    constructor(handler: string | ((...args: any[]) => void), model: InteractionModel, locale: string, applicationID?: string);
    protected invoke(requestJSON: any): Promise<any>;
}
