import {ActionInteractor, RequestFilter} from "./ActionInteractor";
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
     * The directory where all the DialogFlow files are exported
     * @param {string} directory
     * @returns {VirtualGoogleAssistantBuilder}
     */
    public directory(directory: string): VirtualGoogleAssistantBuilder {
        this._directory = directory;
        return this;
    }

    public create(): VirtualGoogleAssistant {
        if (!this._directory) {
            throw new Error("Please provide the DialogFlow directory");
        }

        if (!this._actionURL) {
            throw new Error("Please provide the url where the action is running");
        }
        const model = InteractionModel.fromDirectory(this._directory);

        const interactor = new ActionInteractor(model, this._actionURL);

        return new VirtualGoogleAssistant(interactor);
    }
}
