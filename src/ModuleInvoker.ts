import * as path from "path";

export class ModuleInvoker {
    public static invokeHandler(handler: string, jsonRequest: any): Promise<any> {
        const handlerParts = handler.split(".");
        const functionName = handlerParts[handlerParts.length - 1];
        const fileName = handlerParts.slice(0, handlerParts.length - 1).join("/") + ".js";
        const fullPath = path.join(process.cwd(), fileName);
        const handlerModule = require(fullPath);

        return ModuleInvoker.invokeFunction(handlerModule[functionName], jsonRequest);
    }

    public static invokeFunction(googleFunction: (...args: any[]) => void, jsonRequest: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const response = {
                status: (code: number) => {
                    return response;
                },
                send: (payload: any) => {
                    resolve(payload);
                    return response;
                }
            };

            try {
                googleFunction(jsonRequest, response);
            } catch (error) {
                reject(error);
            }
        });
    }
}