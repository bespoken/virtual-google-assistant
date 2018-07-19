import {ActionInteractor} from "./ActionInteractor";
import {InteractionModel} from "./InteractionModel";
import {Invoker} from "./Invoker";
import {ExpressServerWrapper} from "./ExpressServerWrapper";

export class ExpressInteractor extends ActionInteractor {
    public constructor(private expressServerWrapper: ExpressServerWrapper,
                       private port: number,
                       protected model: InteractionModel,
                       locale: string) {
        super(model, locale);
    }

    protected invoke(requestJSON: any): Promise<any> {
        // If this is a string, means we need to parse it to find the filename and function name
        // Otherwise, we assume it is a function, and just invoke the function directly
        return Invoker.invokeExpressFile(this.expressServerWrapper, this.port, requestJSON);

    }

    public getExpressServerWrapper() {
        return this.expressServerWrapper;
    }
}
