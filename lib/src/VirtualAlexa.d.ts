import { AudioPlayer } from "./AudioPlayer";
import { SkillContext } from "./SkillContext";
import { SkillResponse } from "./SkillResponse";
export declare class VirtualAlexa {
    static Builder(): VirtualAlexaBuilder;
    audioPlayer(): AudioPlayer;
    context(): SkillContext;
    endSession(): Promise<any>;
    filter(requestFilter: RequestFilter): VirtualAlexa;
    intend(intentName: string, slots?: {
        [id: string]: string;
    }): Promise<SkillResponse>;
    launch(): Promise<SkillResponse>;
    resetFilter(): VirtualAlexa;
    utter(utterance: string): Promise<SkillResponse>;
}
export declare type RequestFilter = (request: any) => void;
export declare class VirtualAlexaBuilder {
    applicationID(id: string): VirtualAlexaBuilder;
    handler(handlerName: string | ((...args: any[]) => void)): VirtualAlexaBuilder;
    intentSchema(json: any): VirtualAlexaBuilder;
    intentSchemaFile(filePath: any): VirtualAlexaBuilder;
    interactionModel(json: any): VirtualAlexaBuilder;
    interactionModelFile(filePath: string): VirtualAlexaBuilder;
    sampleUtterances(utterances: any): VirtualAlexaBuilder;
    sampleUtterancesFile(filePath: string): VirtualAlexaBuilder;
    skillURL(url: string): VirtualAlexaBuilder;
    locale(locale: string): VirtualAlexaBuilder;
    create(): VirtualAlexa;
}
