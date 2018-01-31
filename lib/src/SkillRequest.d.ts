import { SkillContext } from "./SkillContext";
export declare class RequestType {
    static INTENT_REQUEST: string;
    static LAUNCH_REQUEST: string;
    static SESSION_ENDED_REQUEST: string;
    static AUDIO_PLAYER_PLAYBACK_FINISHED: string;
    static AUDIO_PLAYER_PLAYBACK_NEARLY_FINISHED: string;
    static AUDIO_PLAYER_PLAYBACK_STARTED: string;
    static AUDIO_PLAYER_PLAYBACK_STOPPED: string;
}
export declare enum SessionEndedReason {
    ERROR = 0,
    EXCEEDED_MAX_REPROMPTS = 1,
    USER_INITIATED = 2,
}
export declare class SkillRequest {
    private context;
    private static timestamp();
    private static requestID();
    private requestJSON;
    private requestType;
    constructor(context: SkillContext);
    intentRequest(intentName: string): SkillRequest;
    audioPlayerRequest(requestType: string, token: string, offsetInMilliseconds: number): SkillRequest;
    launchRequest(): SkillRequest;
    sessionEndedRequest(reason: SessionEndedReason, errorData?: any): SkillRequest;
    withSlot(slotName: string, slotValue: string): SkillRequest;
    requiresSession(): boolean;
    toJSON(): any;
    private baseRequest(requestType);
    private userObject(context);
}
