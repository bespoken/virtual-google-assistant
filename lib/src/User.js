"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
class User {
    constructor(id) {
        this._enablePermissions = false;
        this._id = id;
        if (!this._id) {
            this._id = "amzn1.ask.account." + uuid.v4();
        }
    }
    id() {
        return this._id;
    }
    setID(id) {
        this._id = id;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map