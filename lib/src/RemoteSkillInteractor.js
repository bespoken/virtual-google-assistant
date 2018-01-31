"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const https = require("https");
const URL = require("url");
const SkillInteractor_1 = require("./SkillInteractor");
class RemoteSkillInteractor extends SkillInteractor_1.SkillInteractor {
    constructor(urlString, model, locale, applicationID) {
        super(model, locale, applicationID);
        this.urlString = urlString;
        this.model = model;
    }
    invoke(requestJSON) {
        const httpModule = this.urlString.startsWith("https") ? https : http;
        const url = URL.parse(this.urlString);
        const requestString = JSON.stringify(requestJSON);
        const requestOptions = {
            headers: {
                "Content-Length": Buffer.byteLength(requestString),
                "Content-Type": "application/json",
            },
            hostname: url.hostname,
            method: "POST",
            path: url.path,
            port: url.port ? parseInt(url.port, 10) : undefined,
        };
        return new Promise((resolve, reject) => {
            const req = httpModule.request(requestOptions, (response) => {
                if (response.statusCode !== 200) {
                    reject("Invalid response: " + response.statusCode + " Message: " + response.statusMessage);
                    return;
                }
                let responseString = "";
                response.setEncoding("utf8");
                response.on("data", (chunk) => {
                    responseString = responseString + chunk;
                });
                response.on("end", () => {
                    try {
                        const responseJSON = JSON.parse(responseString);
                        resolve(responseJSON);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
            req.on("error", (e) => {
                console.error(`problem with request: ${e.message}`);
                reject(e);
            });
            req.write(requestString);
            req.end();
        });
    }
}
exports.RemoteSkillInteractor = RemoteSkillInteractor;
//# sourceMappingURL=RemoteSkillInteractor.js.map