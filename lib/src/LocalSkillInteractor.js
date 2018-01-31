"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleInvoker_1 = require("./ModuleInvoker");
const SkillInteractor_1 = require("./SkillInteractor");
class LocalSkillInteractor extends SkillInteractor_1.SkillInteractor {
    constructor(handler, model, locale, applicationID) {
        super(model, locale, applicationID);
        this.handler = handler;
        this.model = model;
    }
    invoke(requestJSON) {
        if (typeof this.handler === "string") {
            return ModuleInvoker_1.ModuleInvoker.invokeHandler(this.handler, requestJSON);
        }
        else {
            return ModuleInvoker_1.ModuleInvoker.invokeFunction(this.handler, requestJSON);
        }
    }
}
exports.LocalSkillInteractor = LocalSkillInteractor;
//# sourceMappingURL=LocalSkillInteractor.js.map