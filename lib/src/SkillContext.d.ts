import { AudioPlayer } from "./AudioPlayer";
import { Device } from "./Device";
import { SkillSession } from "./SkillSession";
import { User } from "./User";
export declare class SkillContext {
    private _locale;
    private _applicationID;
    private _accessToken;
    private _device;
    private _user;
    private _session;
    applicationID(): string;
    device(): Device;
    user(): User;
    accessToken(): string;
    setAccessToken(token: string): void;
    locale(): string;
    audioPlayer(): AudioPlayer;
    audioPlayerEnabled(): boolean;
    newSession(): void;
    session(): SkillSession;
    endSession(): void;
    activeSession(): boolean;
}
