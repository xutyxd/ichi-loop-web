import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter } from 'rxjs';

import { IPadLoop } from '../../interfaces/pad-loop.interface';

import { DIALOG_DATA } from '../../../ui/tokens/dialog.tokens';
import { DialogRef } from '../../../ui/classes/dialog-ref.class';

import { Button } from "../../../ui/components/button/button";
import { InputForm } from '../../../ui/components/input/input-form/input-form';
import { Input } from '../../../ui/components/input/input/input';
import { YoutubePlayer } from '../../../ui/components/youtube-player/youtube-player';
import { YoutubePlayerStatus } from '../../../ui/enums/youtube-player-status.enum';
import { PadLoopMode } from '../../enums/pad-loop-mode.enum';

@Component({
  selector: 'app-pad-loop-form',
  imports: [ReactiveFormsModule, InputForm, Input, Button, YoutubePlayer],
  templateUrl: './pad-loop-form.html',
  styleUrl: './pad-loop-form.scss',
})
export class PadLoopForm {
    @ViewChild('player') youtubePlayer?: YoutubePlayer;

    public youtubeUrl = new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}(&.*)?$/)] });

    public types = PadLoopMode;

    public videoId?: string;

    public loaded = false;

    public padLoopForm = new FormGroup({
        uuid: new FormControl<string>(crypto.randomUUID(), { nonNullable: true }),
        title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
        youtubeId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
        time: new FormGroup({
            start: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
            end: new FormControl<number | undefined>(undefined),
        }),
        key: new FormControl<string | undefined>({ value: undefined, disabled: false }, { nonNullable: true, validators: [Validators.required] }),
        mode: new FormControl<PadLoopMode>(PadLoopMode.LOOP, { nonNullable: true }),
        volume: new FormControl<number>(0, { nonNullable: true })
    });

    constructor(private dialogRef: DialogRef,
                @Inject(DIALOG_DATA) padLoop?: Partial<IPadLoop>) {
        if (padLoop) {
            this.padLoopForm.patchValue(padLoop);

            if (padLoop.youtubeId) {
                const url = `https://www.youtube.com/watch?v=${padLoop.youtubeId}`;
                this.youtubeUrl.setValue(url, { emitEvent: false });
                this.videoId = padLoop.youtubeId;
            }
        }

        this.youtubeUrl.valueChanges.pipe(filter(() => this.youtubeUrl.valid)).subscribe(value => {
            const [, videoId] = value.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/) || [];
            this.padLoopForm.patchValue({ youtubeId: videoId });
            this.videoId = videoId;
            this.loaded = false;
        });
    }

    public onKeydown(event: KeyboardEvent) {
        if (event.key.length !== 1) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        this.padLoopForm.patchValue({ key: event.code });
    }

    public onReady() {
        if (!this.youtubePlayer) {
            return;
        }

        this.loaded = true;
    }

    public controls = {
        play: async () => {

            if (!this.youtubePlayer || !this.videoId) {
                return;
            }

            const state = this.youtubePlayer.state();

            if (state === YoutubePlayerStatus.PAUSED) {
                this.youtubePlayer.controls.play();
                return;
            }

            const { start, end } = this.padLoopForm.getRawValue().time;

            await this.youtubePlayer.controls.load(this.videoId, Math.round(start), end ? Math.round(end) : undefined);

            this.youtubePlayer.controls.seek(start);
        },
        pause: () => {

            this.youtubePlayer?.controls.pause()
        },
        stop: () => {

            this.youtubePlayer?.controls.stop()
        },
    }
    public go = {
        start: () => {

            if (!this.youtubePlayer) {
                return;
            }
    
            const { start } = this.padLoopForm.getRawValue().time;
    
            this.youtubePlayer.controls.seek(start);
        },
        end: () => {

            if (!this.youtubePlayer) {
                return;
            }
    
            const { end } = this.padLoopForm.getRawValue().time;

            if ([null, undefined, ''].includes(end as null | undefined)) {
                return;
            }

            this.youtubePlayer.controls.seek(end as number);
        }
    }

    public cancel() {
        this.dialogRef.close();
    }

    public save() {
        if (this.padLoopForm.invalid) {
            return;
        }

        this.dialogRef.close(this.padLoopForm.value);
    }
}
