import * as http from "http";
import * as https from "https";
import * as path from "path";
import * as URL from "url";
import {ExpressServerWrapper} from "./ExpressServerWrapper";

export class Invoker {
    public static async invokeExpressFile(expressServerWrapper: ExpressServerWrapper,
                                          port: number,
                                          jsonRequest: any): Promise<any> {

        if (!expressServerWrapper.isServerStarted()) {
            throw new Error("Express server is not started yet");
        }

        const urlString = "http://127.0.0.1:" + port;

        const response = await Invoker.invokeWithURLString(urlString, jsonRequest);

        return response;
    }

    public static invokeHandler(handler: string, jsonRequest: any): Promise<any> {
        let functionName = "handler";
        let fileName = handler;
        // By default, we use handler as the name of the function in the lamba
        // If the filename does not end with .js, we assume the last part is the function name (e.g., index.handler)
        if (!handler.endsWith(".js")) {
            const functionSeparatorIndex = handler.lastIndexOf(".");
            functionName = handler.substr(functionSeparatorIndex + 1);
            fileName = handler.substr(0, functionSeparatorIndex);
            fileName += ".js";
        }
        const fullPath = path.isAbsolute(fileName) ? fileName : path.join(process.cwd(), fileName);
        const handlerModule = require(fullPath);

        return Invoker.invokeFunction(handlerModule[functionName], jsonRequest);
    }

    public static invokeFunction(googleFunction: (...args: any[]) => void | Promise<any>, jsonRequest: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const response = {
                status: (code: number) => {
                    return response;
                },
                send: (payload: any) => {
                    resolve(payload);
                    return response;
                },
                setHeader: () => {},
            };

            try {
                const request = {
                    body: jsonRequest,
                    get: () => {},
                    headers: {},
                };
                const googleFunctionResponse = await Promise.resolve(googleFunction(request, response));

                if (googleFunctionResponse) {
                    response.send(googleFunctionResponse);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    public static invokeWithURLString(urlString: string, jsonRequest: any) {
        const httpModule: any = urlString.startsWith("https") ? https : http;
        const url = URL.parse(urlString);
        const requestString = JSON.stringify(jsonRequest);

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
            const req = httpModule.request(requestOptions, (response: any) => {
                if (response.statusCode !== 200) {
                    reject("Invalid response: " + response.statusCode + " Message: " + response.statusMessage);
                    return;
                }

                let responseString = "";
                response.setEncoding("utf8");
                response.on("data", (chunk: string) => {
                    responseString = responseString + chunk;
                });

                response.on("end", () => {
                    try {
                        const responseJSON = JSON.parse(responseString);
                        resolve(responseJSON);
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on("error", (e: Error) => {
                console.error(`problem with request: ${e.message}`);
                reject(e);
            });

            req.write(requestString);
            req.end();
        });
    }
}