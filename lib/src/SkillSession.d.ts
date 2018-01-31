export declare class SkillSession {
    private _attributes;
    private _new;
    private _id;
    constructor();
    attributes(): {
        [id: string]: any;
    };
    updateAttributes(sessionAttributes: any): void;
    id(): string;
    setID(id: string): void;
    isNew(): boolean;
    used(): void;
}
