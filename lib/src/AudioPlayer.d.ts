import { AudioItem } from "./AudioItem";
export declare enum AudioPlayerActivity {
    BUFFER_UNDERRUN = 0,
    FINISHED = 1,
    IDLE = 2,
    PLAYING = 3,
    PAUSED = 4,
    STOPPED = 5,
}
export declare class AudioPlayer {
    isPlaying(): boolean;
    playbackOffset(offset: number): void;
    playbackNearlyFinished(): Promise<any>;
    playbackFinished(): Promise<any>;
    playbackStarted(): Promise<any>;
    playbackStopped(): Promise<any>;
    playerActivity(): AudioPlayerActivity;
    playing(): AudioItem;
    resume(): void;
    suspend(): void;
    suspended(): boolean;
    private audioPlayerRequest(requestType);
    private enqueue(audioItem, playBehavior);
    private handleDirective(directive);
    private dequeue();
    private playNext();
}
