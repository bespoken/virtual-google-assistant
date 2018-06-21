import {InteractionModel} from "./InteractionModel";
import {ActionInteractor} from "./ActionInteractor";
import {Invoker} from "./Invoker";

/**
 * ActionInteractor works with an action via HTTP calls to a URL
 *
 */
export class RemoteInteractor extends ActionInteractor{
    public constructor(private urlString: string, protected interactionModel: InteractionModel, locale: string) {
        super(interactionModel, locale)
    }

    protected invoke(requestJSON: any): Promise<any> {
        return Invoker.invokeWithURLString(this.urlString, requestJSON);
    }
}

