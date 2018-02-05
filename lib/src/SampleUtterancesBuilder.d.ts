import { SampleUtterances } from "virtual-core";
export declare class SampleUtterancesBuilder {
    static fromFolder(folder: string): SampleUtterances;
    private static extractUtterancesFromFile(folder, fileName);
}
