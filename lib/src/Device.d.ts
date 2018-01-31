export declare class Device {
    private _id;
    private _supportedInterfaces;
    id(): string;
    setID(id: string): void;
    addSupportedInterface(name: string, value?: any): void;
    supportedInterfaces(): any;
}
