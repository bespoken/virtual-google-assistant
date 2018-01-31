export declare class SkillResponse {
    response: any;
    sessionAttributes?: any;
    version: string;
    constructor(rawJSON: any);
    attr(key: string): string;
    attrs(...keys: string[]): any;
    card(): any | undefined;
    cardContent(): string | undefined;
    cardImage(): any;
    cardSmallImage(): string | undefined;
    cardLargeImage(): string | undefined;
    cardTitle(): string | undefined;
    prompt(): string | undefined;
    reprompt(): string;
    private wrapJSON(rawJSON);
}
