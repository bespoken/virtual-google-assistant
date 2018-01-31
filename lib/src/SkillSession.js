"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
class SkillSession {
    constructor() {
        this._id = "SessionID." + uuid.v4();
        this._new = true;
        this._attributes = {};
    }
    attributes() {
        return this._attributes;
    }
    updateAttributes(sessionAttributes) {
        if (sessionAttributes !== undefined && sessionAttributes !== null) {
            this._attributes = sessionAttributes;
        }
    }
    id() {
        return this._id;
    }
    setID(id) {
        this._id = id;
    }
    isNew() {
        return this._new;
    }
    used() {
        this._new = false;
    }
}
exports.SkillSession = SkillSession;
//# sourceMappingURL=SkillSession.js.map