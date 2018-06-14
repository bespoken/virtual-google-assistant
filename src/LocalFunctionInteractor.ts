import {ActionInteractor} from "./ActionInteractor";
import {InteractionModel} from "./InteractionModel";
import {ModuleInvoker} from "./ModuleInvoker";

export class LocalFunctionInteractor extends ActionInteractor {
    public constructor(private handler: string | ((...args: any[]) => void),
                       protected model: InteractionModel,
                       locale: string) {
        super(model, locale);
    }

    protected invoke(requestJSON: any): Promise<any> {
        // If this is a string, means we need to parse it to find the filename and function name
        // Otherwise, we assume it is a function, and just invoke the function directly
        if (typeof this.handler === "string") {
            return ModuleInvoker.invokeHandler(this.handler, requestJSON);
        } else {
            return ModuleInvoker.invokeFunction(this.handler, requestJSON);
        }
    }
}
