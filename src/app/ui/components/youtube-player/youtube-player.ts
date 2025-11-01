import { AfterViewInit, Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
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

    private State = signal<YoutubePlayerStatus>(YoutubePlayerStatus.UNSTARTED);

    public id = `youtube-player-${crypto.randomUUID()}`;

    public state = computed(() => this.State());

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
                onReady: () => {
                    this.onPlayerReady();
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

    private onPlayerReady() {
        this.onReady.emit();
    }

    private onPlayerStateChange(event: any) {
        this.State.set(event.data);

        switch (event.data) {
            case YoutubePlayerStatus.ENDED:
                if (this.playerVars.end !== undefined) {
                    this.player?.seekTo(this.playerVars.start, true);
                }
                break;
            case YoutubePlayerStatus.PLAYING:
                break;
            case YoutubePlayerStatus.PAUSED:
                break;
            case YoutubePlayerStatus.BUFFERING:
                break;
            case YoutubePlayerStatus.CUED:
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
