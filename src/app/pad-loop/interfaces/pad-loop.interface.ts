import { PadLoopMode } from "../enums/pad-loop-mode.enum";

export interface IPadLoop {
    uuid: string;
    title: string;
    youtubeId: string;
    key: string;
    mode: PadLoopMode;
    time: {
        start: number;
        end?: number;
    }
    volume: number;
}