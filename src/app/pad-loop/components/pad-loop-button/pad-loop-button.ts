import { AfterViewInit, Component, effect, inject, Input, ViewChild } from '@angular/core';
import { IPadLoop } from '../../interfaces/pad-loop.interface';
import { UiService } from '../../../ui/services/ui.service';
import { LucideAngularModule, LucideSettings, LucideTrash, LucidePlay } from 'lucide-angular';
import { Button } from "../../../ui/components/button/button";
import { DialogService } from '../../../ui/services/dialog.service';
import { PadLoopForm } from '../pad-loop-form/pad-loop-form';
import { SessionService } from '../../../session/services/session.service';
import { YoutubePlayer } from '../../../ui/components/youtube-player/youtube-player';
import { PadLoopStatus } from '../../enums/pad-loop-status.enum';

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

    @ViewChild('player') youtubePlayer?: YoutubePlayer;

    public state: PadLoopStatus = PadLoopStatus.CONFIGURING;

    public LucideSettings = LucideSettings;

    public LucideTrash = LucideTrash;

    public LucidePlay = LucidePlay;

    @Input() public padLoop?: IPadLoop;

    constructor() {
        effect(() => {
            const keys = this.uiService.keys();

            if (!this.youtubePlayer || !this.padLoop) {
                return;
            }

            const { time: { start, end } } = this.padLoop;
            if (keys.has('ArrowLeft')) {
                this.youtubePlayer.controls.seek(start);
            }
        });
    }

    public async ngAfterViewInit() {
        if (!this.youtubePlayer || !this.padLoop) {
            return;
        }

        const { youtubeId, time: { start, end } } = this.padLoop;

        try {
            await this.youtubePlayer.controls.load(youtubeId, start, end);
            this.state = PadLoopStatus.READY;
        } catch (e) {
            this.state = PadLoopStatus.ERROR;
        }
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

    public onReady() {
        console.log('onReady');
    }

    public play() {
        console.log('play', this.padLoop);
        if (!this.youtubePlayer) {
            return;
        }

        this.youtubePlayer.controls.play();
        this.state = PadLoopStatus.PLAYING;
    }


}
