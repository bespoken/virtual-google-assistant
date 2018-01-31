"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Device {
    constructor(id) {
        this._supportedInterfaces = {};
        this._id = id;
        this.addSupportedInterface("AudioPlayer");
    }
    id() {
        return this._id;
    }
    setID(id) {
        this._id = id;
    }
    addSupportedInterface(name, value) {
        if (!value) {
            value = {};
        }
        this._supportedInterfaces[name] = value;
    }
    supportedInterfaces() {
        return this._supportedInterfaces;
    }
}
exports.Device = Device;
//# sourceMappingURL=Device.js.map