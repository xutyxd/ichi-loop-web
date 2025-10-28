export interface IPadLoop {
    id: string;
    title: string;
    youtubeUrl: string;
    time: {
        start: number;
        end: number;
    }
    volume: number;
}