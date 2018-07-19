import * as path from "path";

export class ExpressServerWrapper {
    private handlerModule: any;
    private serverStarted: boolean = false;
    constructor(private expressFile: any, private expressPort: number) {
    }

    public async startServer(): Promise<void> {
        const fullPath = path.join(process.cwd(), this.expressFile);

        // Ensure the cache is removed always to be able to start the server on command
        delete require.cache[require.resolve(fullPath)];
        const handlerModule = require(fullPath);

        if (!handlerModule.close) {
            throw new Error("The web server needs to be in the module.exports")
        }

        await new Promise((resolve, reject) => {
            let timeout = true;
            setTimeout(() => {
                if (timeout) {
                    reject(new Error("Server took to long to start listening."));
                }
            }, 2000);

            handlerModule.on("listening", (server: any) => {
                timeout = false;
                resolve();
            });
        });

        this.handlerModule = handlerModule;
        this.serverStarted = true;
    };

    public async stopServer(): Promise<void> {
        //After we process the request, we close the server before sending the next one.
        await new Promise((resolve, reject) => {
            let timeout = true;
            setTimeout(() => {
                if (timeout) {
                    reject(new Error("Server took to long to stop."));
                }
            }, 2000);

            this.handlerModule.close(() => {
                timeout = false;
                resolve();
            });
        });

        this.serverStarted = false;
    }

    public isServerStarted(): boolean {
        return this.serverStarted;
    }
}
