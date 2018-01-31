"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class ModuleInvoker {
    static invokeHandler(handler, event) {
        const handlerParts = handler.split(".");
        const functionName = handlerParts[handlerParts.length - 1];
        const fileName = handlerParts.slice(0, handlerParts.length - 1).join("/") + ".js";
        const fullPath = path.join(process.cwd(), fileName);
        const handlerModule = require(fullPath);
        return ModuleInvoker.invokeFunction(handlerModule[functionName], event);
    }
    static invokeFunction(lambdaFunction, event) {
        return new Promise((resolve, reject) => {
            const callback = (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            };
            const context = new LambdaContext(callback);
            lambdaFunction(event, context, callback);
        });
    }
}
exports.ModuleInvoker = ModuleInvoker;
class LambdaContext {
    constructor(callback) {
        this.callback = callback;
        this.awsRequestId = "N/A";
        this.callbackWaitsForEmptyEventLoop = true;
        this.functionName = "BST.LambdaServer";
        this.functionVersion = "N/A";
        this.memoryLimitInMB = -1;
        this.invokedFunctionArn = "N/A";
        this.logGroupName = "N/A";
        this.logStreamName = null;
        this.identity = null;
        this.clientContext = null;
    }
    fail(error) {
        this.done(error, null);
    }
    succeed(body) {
        this.done(null, body);
    }
    getRemainingTimeMillis() {
        return -1;
    }
    done(error, body) {
        let statusCode = 200;
        let contentType = "application/json";
        let bodyString = null;
        if (error === null) {
            bodyString = JSON.stringify(body);
        }
        else {
            statusCode = 500;
            contentType = "text/plain";
            bodyString = "Unhandled Exception from Lambda: " + error.toString();
        }
        this.callback(error, body);
    }
}
//# sourceMappingURL=ModuleInvoker.js.map