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

@Component({
  selector: 'app-pad-loop-form',
  imports: [ReactiveFormsModule, InputForm, Input, Button, YoutubePlayer],
  templateUrl: './pad-loop-form.html',
  styleUrl: './pad-loop-form.scss',
})
export class PadLoopForm {

    private youtubeUrl = new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}(&.*)?$/)] });

    @ViewChild('player') youtubePlayer?: YoutubePlayer;

    public videoId?: string;

    public loaded = false;

    public padLoopForm = new FormGroup({
        id: new FormControl<string>('', { nonNullable: true }),
        title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
        youtubeUrl: this.youtubeUrl,
        time: new FormGroup({
            start: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
            end: new FormControl<number | undefined>(undefined),
        }),
        key: new FormControl<string | undefined>(undefined),
        volume: new FormControl<number>(0, { nonNullable: true })
    });

    constructor(private dialogRef: DialogRef,
                @Inject(DIALOG_DATA) padLoop?: Partial<IPadLoop>) {

        if (padLoop) {
            this.padLoopForm.patchValue(padLoop);
        }

        this.youtubeUrl.valueChanges.pipe(filter(() => this.youtubeUrl.valid)).subscribe(value => {
            const [, videoId] = value.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/) || [];
            this.videoId = videoId;
            this.loaded = false;
        });
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

            if (this.youtubePlayer.status === YoutubePlayerStatus.PAUSED) {
                this.youtubePlayer.controls.play();
                return;
            }

            const { start, end } = this.padLoopForm.getRawValue().time;
            console.log('start', start, 'end', end);
            await this.youtubePlayer.controls.load(this.videoId, Number(start), Number(end) ?? undefined);

            this.youtubePlayer.controls.seek(start);
        },
        pause: () => this.youtubePlayer?.controls.pause(),
        stop: () => this.youtubePlayer?.controls.stop(),
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
    
            if ([null, undefined].includes(end as null | undefined)) {
                return;
            }

            this.youtubePlayer.controls.seek(end as number);
        }
    }

    public cancel() {
        this.dialogRef.close();
    }

    public save() {
        console.log('save', this.padLoopForm.value);
        this.dialogRef.close(this.padLoopForm.value);
    }
}
