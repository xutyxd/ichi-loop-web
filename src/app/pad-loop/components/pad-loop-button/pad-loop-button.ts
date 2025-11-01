import { AfterViewInit, Component, effect, inject, Input, signal, ViewChild } from '@angular/core';
import { IPadLoop } from '../../interfaces/pad-loop.interface';
import { UiService } from '../../../ui/services/ui.service';
import { LucideAngularModule, LucideSettings, LucideTrash, LucideLoaderCircle, LucidePlay } from 'lucide-angular';
import { Button } from "../../../ui/components/button/button";
import { DialogService } from '../../../ui/services/dialog.service';
import { PadLoopForm } from '../pad-loop-form/pad-loop-form';
import { SessionService } from '../../../session/services/session.service';
import { YoutubePlayer } from '../../../ui/components/youtube-player/youtube-player';
import { PadLoopState } from '../../enums/pad-loop-status.enum';
import { YoutubePlayerStatus } from '../../../ui/enums/youtube-player-status.enum';
import { PadLoopMode } from '../../enums/pad-loop-mode.enum';

@Component({
    selector: 'app-pad-loop-button',
    imports: [LucideAngularModule, Button, YoutubePlayer],
    templateUrl: './pad-loop-button.html',
    styleUrl: './pad-loop-button.scss',
})
export class PadLoopButton implements AfterViewInit {
    private dialogService = inject(DialogService);

    private uiService = inject(UiService);

    private sessionService = inject(SessionService);

    private last = false;

    @ViewChild('player') youtubePlayer?: YoutubePlayer;

    // public state = signal<PadLoopState>(PadLoopState.CONFIGURING);

    public LucideSettings = LucideSettings;

    public LucideTrash = LucideTrash;

    public LucideLoaderCircle = LucideLoaderCircle;

    public LucidePlay = LucidePlay;

    @Input() public padLoop?: IPadLoop;

    constructor() {
        effect(() => {
            const keys = this.uiService.keys();

            if (!this.youtubePlayer || !this.padLoop) {
                return;
            }

            const state = this.youtubePlayer.state();
            const { time: { start }, key, mode } = this.padLoop;

            switch (mode) {
                case PadLoopMode.ONE_SHOT:
                    if (keys.has(key)) {
                        this.youtubePlayer.controls.seek(start);
                    }

                    if (state !== YoutubePlayerStatus.PLAYING) {
                        this.youtubePlayer.controls.play();
                    }
                    break;

                case PadLoopMode.GATE:
                    const gated = state === YoutubePlayerStatus.PLAYING;

                    if (gated && !keys.has(key)) {
                        this.youtubePlayer.controls.pause();
                    }

                    if (!gated && keys.has(key)) {
                        this.youtubePlayer.controls.seek(start);
                        this.youtubePlayer.controls.play();
                    }

                    break;

                case PadLoopMode.LOOP:
                    const fullTap = this.last && !keys.has(key);

                    if (fullTap) {
                        if (state === YoutubePlayerStatus.PLAYING) {
                            this.youtubePlayer.controls.pause();
                        } else {
                            this.youtubePlayer.controls.play();
                        }
                    }

                    break;
                default:
                    break;
            }
            this.last = keys.has(key);
        });
    }

    public async ngAfterViewInit() {
        if (!this.youtubePlayer || !this.padLoop) {
            return;
        }

        const { youtubeId, time: { start, end } } = this.padLoop;

        try {
            await this.youtubePlayer.controls.load(youtubeId, start, end);
        } catch (e) { }
    }

    public async edit() {
        const padLoop = await this.dialogService.open(PadLoopForm, this.padLoop) as IPadLoop | undefined;

        if (!padLoop) {
            return;
        }
        // Get session
        const activeSession = this.sessionService.active();

        if (!activeSession) {
            return;
        }

        // Update padLoop on session
        const updated = { ...activeSession, padLoops: activeSession.padLoops.map(loop => loop.uuid === padLoop.uuid ? padLoop : loop) };
        // Update session
        this.sessionService.update(updated);
    }

    public remove() {
        const uuid = this.padLoop?.uuid;

        if (!uuid) {
            return;
        }

        const activeSession = this.sessionService.active();

        if (!activeSession) {
            return;
        }

        // Update padLoop on session
        const updated = { ...activeSession, padLoops: activeSession.padLoops.filter(loop => loop.uuid !== uuid) };
        // Update session
        this.sessionService.update(updated);
    }

    public toggle() {
        if (!this.youtubePlayer) {
            return;
        }

        const keys = this.uiService.keys();
        const state = this.youtubePlayer.state();
        const playing = state === YoutubePlayerStatus.PLAYING;

        if (playing) {
            this.youtubePlayer.controls.pause();
            return;
        }

        this.youtubePlayer.controls.play();
    }
}
