import { AfterViewInit, Component, effect, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { UiService } from '../../../ui/services/ui.service';
import { DialogService } from '../../../ui/services/dialog.service';
import { Button } from "../../../ui/components/button/button";

import { YoutubePlayer } from '../../../ui/components/youtube-player/youtube-player';
import { YoutubePlayerStatus } from '../../../ui/enums/youtube-player-status.enum';

import { SessionService } from '../../../session/services/session.service';

import { IPadLoop } from '../../interfaces/pad-loop.interface';
import { PadLoopMode } from '../../enums/pad-loop-mode.enum';
import { PadLoopForm } from '../pad-loop-form/pad-loop-form';

@Component({
    selector: 'app-pad-loop-button',
    imports: [LucideAngularModule, Button, YoutubePlayer],
    templateUrl: './pad-loop-button.html',
    styleUrl: './pad-loop-button.scss',
})
export class PadLoopButton implements OnInit, AfterViewInit {
    private dialogService = inject(DialogService);

    private uiService = inject(UiService);

    private sessionService = inject(SessionService);

    private last = false;

    @ViewChild('player') youtubePlayer?: YoutubePlayer;

    // public LucideSettings = LucideSettings;

    // public LucideTrash = LucideTrash;

    // public LucideLoaderCircle = LucideLoaderCircle;

    // public CircleFadingArrowUp = CircleFadingArrowUp;

    public icon = signal<string>('LucideLoaderCircle');

    public type = signal<string>('LucideInfinity');


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

            // Update youtubePlayer state
            const icons = {
                [YoutubePlayerStatus.UNSTARTED]: 'LucidePlay',
                [YoutubePlayerStatus.PLAYING]: 'LucidePause',
                [YoutubePlayerStatus.PAUSED]: 'LucidePlay',
                [YoutubePlayerStatus.ENDED]: 'LucidePlay',
                [YoutubePlayerStatus.BUFFERING]: 'LucideLoaderCircle',
                [YoutubePlayerStatus.CUED]: 'LucidePlay',
                [YoutubePlayerStatus.READY]: 'LucidePlay',
            };
    
            this.icon.set(icons[state]);
        });
    }

    private updateType(padLoop?: IPadLoop) {

        if (!padLoop) {
            return;
        }

        const { mode } = padLoop;

        switch (mode) {
            case PadLoopMode.ONE_SHOT:
                this.type.set('ArrowRightFromLine');
                break;
            case PadLoopMode.GATE:
                this.type.set('CircleFadingArrowUp');
                break;
            case PadLoopMode.LOOP:
                this.type.set('LucideInfinity');
                break;
            default:
                break;
        }
    }

    public ngOnInit() {
        this.updateType(this.padLoop);
    }

    public async ngAfterViewInit() {
        if (!this.youtubePlayer || !this.padLoop) {
            return;
        }

        const { youtubeId, time: { start, end } } = this.padLoop;

        try {
            await this.youtubePlayer.controls.load(youtubeId, start, end);
            this.icon.set('LucidePlay');
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
        // Update type
        this.updateType(padLoop);
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
}
