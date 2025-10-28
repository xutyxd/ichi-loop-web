import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter } from 'rxjs';

import { IPadLoop } from '../../interfaces/pad-loop.interface';

import { DIALOG_DATA } from '../../../ui/tokens/dialog.tokens';
import { DialogRef } from '../../../ui/classes/dialog-ref.class';

import { Button } from "../../../ui/components/button/button";
import { InputForm } from '../../../ui/components/input/input-form/input-form';
import { Input } from '../../../ui/components/input/input/input';
import { YoutubePlayer } from '../../../ui/components/youtube-player/youtube-player';

@Component({
  selector: 'app-pad-loop-form',
  imports: [ReactiveFormsModule, InputForm, Input, Button, YoutubePlayer],
  templateUrl: './pad-loop-form.html',
  styleUrl: './pad-loop-form.scss',
})
export class PadLoopForm {

    private youtubeUrl = new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}(&.*)?$/)] });

    public videoId?: string;

    public padLoopForm = new FormGroup({
        id: new FormControl<string>('', { nonNullable: true }),
        title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
        youtubeUrl: this.youtubeUrl,
        time: new FormGroup({
            start: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
            end: new FormControl<number>(0, { nonNullable: true })
        }),
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
        });
    }

    public cancel() {
        this.dialogRef.close();
    }

    public save() {
        this.dialogRef.close(this.padLoopForm.value);
    }
}
