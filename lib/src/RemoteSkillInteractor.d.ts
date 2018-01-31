import { InteractionModel } from "./InteractionModel";
import { SkillInteractor } from "./SkillInteractor";
export declare class RemoteSkillInteractor extends SkillInteractor {
    private urlString;
    protected model: InteractionModel;
    constructor(urlString: string, model: InteractionModel, locale: string, applicationID?: string);
    protected invoke(requestJSON: any): Promise<any>;
}
