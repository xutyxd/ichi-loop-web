import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { YoutubePlayerStatus } from '../../enums/youtube-player-status.enum';

declare global {
    interface Window {
        YT: any;
    }
}
@Component({
    selector: 'app-youtube-player',
    imports: [],
    templateUrl: './youtube-player.html',
    styleUrl: './youtube-player.scss',
})
export class YoutubePlayer implements AfterViewInit {
    private playerVars = {
        'autoplay': 0,        // We will control play/pause with the API, not autoplay.
        'controls': 0,        // This is the main one. Hides the player controls.
        'showinfo': 0,        // Deprecated, but good for safety. Hides title.
        'rel': 0,             // Hides related videos at the end.
        'iv_load_policy': 3,  // Hides video annotations.
        'modestbranding': 1,  // Removes the YouTube logo (mostly).
        'playsinline': 1,     // CRITICAL for mobile web. Prevents fullscreen.
        'disablekb': 1,        // Disables keyboard controls.
        'start': 0,
        'end': undefined as number | undefined,
    };

    private player?: Window['YT']['Player'];

    public id = `youtube-player-${crypto.randomUUID()}`;

    public status = YoutubePlayerStatus.UNSTARTED;

    @Input() public videoId?: string;

    @Output() public onReady = new EventEmitter<void>();

    async ngAfterViewInit() {
        if (!this.videoId) {
            return;
        }

        this.loadVideoById(this.videoId);
    }

    private loadVideoById(videoId: string, start: number = 0, end?: number) {
        let resolve: () => void;
        let reject: () => void;

        const promise = new Promise<void>((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });

        this.playerVars = { ...this.playerVars, start, end };

        if (this.player) {
            this.player.destroy();
        }

        this.player = new window.YT.Player(this.id, {
            height: '100%',
            width: '100%',
            videoId,
            playerVars: this.playerVars,
            events: {
                onReady: (event: any) => {
                    this.onPlayerReady(event);
                    resolve();
                },
                onStateChange: this.onPlayerStateChange.bind(this),
                onError: (event: any) => {
                    this.onPlayerError(event);
                    reject();
                },
            },
        });

        return promise;
    }

    private onPlayerReady(event: any) {
        console.log('onPlayerReady', event);
        this.onReady.emit();
    }

    private onPlayerStateChange(event: any) {
        this.status = event.data;

        switch (event.data) {
            case YoutubePlayerStatus.ENDED:
                console.log('onPlayerStateChange: ended');
                if (this.playerVars.end !== undefined) {
                    this.player?.seekTo(this.playerVars.start, true);
                }
                break;
            case YoutubePlayerStatus.PLAYING:
                console.log('onPlayerStateChange: playing');
                break;
            case YoutubePlayerStatus.PAUSED:
                console.log('onPlayerStateChange: paused');
                break;
            case YoutubePlayerStatus.BUFFERING:
                console.log('onPlayerStateChange: buffering');
                break;
            case YoutubePlayerStatus.CUED:
                console.log('onPlayerStateChange: cued');
                break;
        }
    }

    private onPlayerError(event: any) {
        console.log('onPlayerError', event);
    }

    public controls = {
        load: (id: string, start: number = 0, end?: number) => this.loadVideoById(id, start, end),
        play: () => this.player?.playVideo(),
        seek: (time: number) => this.player?.seekTo(time, true),
        time: () => this.player?.getCurrentTime(),
        pause: () => this.player?.pauseVideo(),
        stop: () => this.player?.stopVideo(),
    }
}
