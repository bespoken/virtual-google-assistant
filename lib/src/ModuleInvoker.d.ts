export declare class ModuleInvoker {
    static invokeHandler(handler: string, event: any): Promise<any>;
    static invokeFunction(lambdaFunction: (...args: any[]) => void, event: any): Promise<any>;
}
