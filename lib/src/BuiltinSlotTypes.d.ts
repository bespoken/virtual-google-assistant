import { ISlotValue, SlotMatch, SlotType } from "virtual-core";
export declare class BuiltinSlotTypes {
    static values(): BuiltinSlotType[];
}
export declare class BuiltinSlotType extends SlotType {
    name: string;
    values: ISlotValue[];
    private regex;
    constructor(name: string, values: ISlotValue[], regex?: string);
    match(value: string): SlotMatch;
}
export declare class NumberSlotType extends BuiltinSlotType {
    private static LONG_FORM_VALUES;
    private static LONG_FORM_SLOT_VALUES();
    constructor();
}
