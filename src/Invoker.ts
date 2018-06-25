import * as http from "http";
import * as https from "https";
import * as path from "path";
import * as URL from "url";

var ProxyAgent = require('proxy-agent'); // no typescript definitions

export class Invoker {
    public static async invokeExpressFile(fileName: string, port: number, jsonRequest: any, restOfPath?: string): Promise<any> {
        const fullPath = path.join(process.cwd(), fileName);

        // Ensure the cache is removed always to be able to start the server on command
        delete require.cache[require.resolve(fullPath)];
        const handlerModule = require(fullPath);

        if (!handlerModule.close) {
            throw new Error("The web server needs to be in the module.exports")
        }

        await new Promise(resolve => {
            handlerModule.on("listening", (server: any) => {
                resolve();
            });
        });

        const urlString = "http://127.0.0.1:" + port;

        const response = await Invoker.invokeWithURLString(urlString, jsonRequest);

        //After we process the request, we close the server before sending the next one.
        await new Promise(resolve => handlerModule.close(resolve));

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
        const fullPath = path.join(process.cwd(), fileName);
        const handlerModule = require(fullPath);

        return Invoker.invokeFunction(handlerModule[functionName], jsonRequest);
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

        if(process.env.http_proxy){
            (requestOptions as any).agent = new ProxyAgent(process.env.http_proxy)
        }

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
