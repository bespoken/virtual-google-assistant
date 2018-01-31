import { SampleUtterances } from "virtual-core";
export declare class SampleUtterancesBuilder {
    static fromFile(file: string): SampleUtterances;
    static fromJSON(sampleUtterancesJSON: any): SampleUtterances;
    private static parseFlatFile(utterances, fileData);
}
