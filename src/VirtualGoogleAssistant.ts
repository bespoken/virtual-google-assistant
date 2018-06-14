import {ActionInteractor, RequestFilter} from "./ActionInteractor";
import {RemoteInteractor} from "./RemoteInteractor";
import {LocalFunctionInteractor} from "./LocalFunctionInteractor";
import {InteractionModel} from "./InteractionModel";

export class VirtualGoogleAssistant {
    public static Builder(): VirtualGoogleAssistantBuilder {
        return new VirtualGoogleAssistantBuilder();
    }

    /** @internal */
    private interactor: ActionInteractor;

    /** @internal */
    public constructor(interactor: ActionInteractor) {
        this.interactor = interactor;
    }

    public intend(intentName: string, slots?: {[id: string]: string}): Promise<any> {
        return this.interactor.intended(intentName, slots);
    }

    public launch(): Promise<any> {
        return this.interactor.launched();
    }

    public utter(utterance: string): Promise<any> {
        return this.interactor.spoken(utterance);
    }

    /*
    * Set a filter on requests - for manipulating the payload before it is sent
    * @param {RequestFilter} requestFilter
    * @returns {VirtualGoogleAssistant}
    */
    public addFilter(requestFilter: RequestFilter): VirtualGoogleAssistant {
        this.interactor.addFilter(requestFilter);
        return this;
    }

    /*
    * Remove all added filters
    *
    * @returns {VirtualGoogleAssistant}
    */
    public resetFilters(): VirtualGoogleAssistant {
        this.interactor.resetFilters();
        return this;
    }
}

/**
 * Configuration object for VirtualGoogleAssistant.<br>
 * <br>
 * Callers must provide:<br>
 * 1) A directory for the exported DialogFlow Interaction Model Files<br>
 * 2) A url where the service is running<br>
 * The VirtualGoogleAssistant will interact with an action via HTTP<br>
 * <br>
 * Once the object is configured properly, create it by calling {@link VirtualGoogleAssistant.create}
 *
 */
export class VirtualGoogleAssistantBuilder {
    /** @internal */
    private _directory: string;
    /** @internal */
    private _actionURL: string;
    private _locale: string;
    /** @internal */
    private _handler: string | ((...args: any[]) => void);

    /**
     * The URL of the action to be tested
     * @param {string} url
     * @returns {VirtualGoogleAssistantBuilder}
     */
    public actionUrl(url: string): VirtualGoogleAssistantBuilder {
        this._actionURL = url;
        return this;
    }

    /**
     * The name of the handler, or the handler function itself, for a Firebase Function to be called<br>
     * The name should be in the format "index.handler" where:<br>
     * `index` is the name of the file - such as index.js<br>
     * `handler` is the name of the exported function to call on the file<br>
     * @param {string | Function} handlerName
     * @returns {VirtualGoogleAssistantBuilder}
     */
    public handler(handlerName: string | ((...args: any[]) => void)): VirtualGoogleAssistantBuilder {
        this._handler = handlerName;
        return this;
    }

    /**
     * The directory where all the DialogFlow files are exported
     * @param {string} directory
     * @returns {VirtualGoogleAssistantBuilder}
     */
    public directory(directory: string): VirtualGoogleAssistantBuilder {
        this._directory = directory;
        return this;
    }

    /**
     * The locale that will be sent in all requests,
     * @param {string} locale
     * @returns {VirtualGoogleAssistantBuilder}
     */
    public locale(locale: string): VirtualGoogleAssistantBuilder {
        this._locale = locale;
        return this;
    }

    private getInteractor(model: InteractionModel, locale: string): ActionInteractor {
        if (this._handler) {
            return new LocalFunctionInteractor(this._handler, model, locale);
        } else if (this._actionURL) {
            return new RemoteInteractor(this._actionURL, model, locale);
        } else {
            throw new Error("Either a handler or actionURL must be provided.");
        }
    }

    public create(): VirtualGoogleAssistant {
        if (!this._directory) {
            throw new Error("Please provide the DialogFlow directory");
        }

        const locale = this._locale ? this._locale : "en-us";

        const model = InteractionModel.fromDirectory(this._directory);

        const interactor = this.getInteractor(model, locale);

        return new VirtualGoogleAssistant(interactor);
    }
}
