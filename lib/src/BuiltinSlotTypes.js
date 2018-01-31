"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const virtual_core_1 = require("virtual-core");
class BuiltinSlotTypes {
    static values() {
        return [
            new NumberSlotType(),
        ];
    }
}
exports.BuiltinSlotTypes = BuiltinSlotTypes;
class BuiltinSlotType extends virtual_core_1.SlotType {
    constructor(name, values, regex) {
        super(name, values);
        this.name = name;
        this.values = values;
        this.regex = regex;
    }
    match(value) {
        let slotMatch = new virtual_core_1.SlotMatch(false);
        if (this.regex) {
            const match = value.match(this.regex);
            if (match) {
                slotMatch = new virtual_core_1.SlotMatch(true, value);
            }
        }
        if (!slotMatch.matches) {
            slotMatch = super.match(value);
        }
        return slotMatch;
    }
}
exports.BuiltinSlotType = BuiltinSlotType;
class NumberSlotType extends BuiltinSlotType {
    constructor() {
        super("AMAZON.NUMBER", NumberSlotType.LONG_FORM_SLOT_VALUES(), "^[0-9]*$");
    }
    static LONG_FORM_SLOT_VALUES() {
        const slotValues = [];
        for (const key of Object.keys(NumberSlotType.LONG_FORM_VALUES)) {
            const values = NumberSlotType.LONG_FORM_VALUES[key];
            slotValues.push({ id: key, name: { value: key, synonyms: values } });
        }
        return slotValues;
    }
}
NumberSlotType.LONG_FORM_VALUES = {
    1: ["one"],
    2: ["two"],
    3: ["three"],
    4: ["four"],
    5: ["five"],
    6: ["six"],
    7: ["seven"],
    8: ["eight"],
    9: ["nine"],
    10: ["ten"],
    11: ["eleven"],
    12: ["twelve"],
    13: ["thirteen"],
    14: ["fourteen"],
    15: ["fifteen"],
    16: ["sixteen"],
    17: ["seventeen"],
    18: ["eighteen"],
    19: ["nineteen"],
    20: ["twenty"],
};
exports.NumberSlotType = NumberSlotType;
//# sourceMappingURL=BuiltinSlotTypes.js.map