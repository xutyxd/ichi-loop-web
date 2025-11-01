export interface IPadLoop {
    uuid: string;
    title: string;
    youtubeId: string;
    time: {
        start: number;
        end: number;
    }
    volume: number;
}