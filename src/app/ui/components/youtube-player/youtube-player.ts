import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

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
    private player?: Window['YT']['Player'];

    public id = `youtube-player-${crypto.randomUUID()}`;

    @Input() public videoId?: string;

    constructor() {
        this.player = new window.YT.Player(this.id, {
            height: '100%',
            width: '100%',
            videoId: 'dQw4w9WgXcQ',
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                start: 0,
                theme: 'light',
                wmode: 'transparent',
            },
        });
    }

    private playerVars = {
        'autoplay': 0,        // We will control play/pause with the API, not autoplay.
        'controls': 0,        // This is the main one. Hides the player controls.
        'showinfo': 0,        // Deprecated, but good for safety. Hides title.
        'rel': 0,             // Hides related videos at the end.
        'iv_load_policy': 3,  // Hides video annotations.
        'modestbranding': 1,  // Removes the YouTube logo (mostly).
        'playsinline': 1,     // CRITICAL for mobile web. Prevents fullscreen.
        'disablekb': 1        // Disables keyboard controls.
      };

    async ngAfterViewInit() {
        if (!this.videoId) {
            return;
        }
        this.loadVideoById(this.videoId);
    }

    private loadVideoById(videoId: string) {
        this.player = new window.YT.Player(this.id, {
            height: '100%',
            width: '100%',
            videoId,
            playerVars: this.playerVars,
            events: {
                onReady: this.onPlayerReady.bind(this),
                onStateChange: this.onPlayerStateChange.bind(this),
            },
        });
    }

    private onPlayerReady(event: any) {
        console.log('onPlayerReady', event);
    }

    private onPlayerStateChange(event: any) {
        console.log('onPlayerStateChange', event);
    }
}
