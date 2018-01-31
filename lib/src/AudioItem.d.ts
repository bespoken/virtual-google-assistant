export declare class AudioItem {
    private _json;
    stream: AudioItemStream;
    constructor(_json: any);
    clone(): AudioItem;
}
export declare class AudioItemStream {
    url: string;
    token: string;
    expectedPreviousToken: string;
    offsetInMilliseconds: number;
}
