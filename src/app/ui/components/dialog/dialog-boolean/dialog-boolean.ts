import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '../../../tokens/dialog.tokens';
import { DialogRef } from '../../../classes/dialog-ref.class';
import { Button } from "../../button/button";

@Component({
    selector: 'app-dialog-boolean',
    imports: [Button],
    templateUrl: './dialog-boolean.html',
    styleUrl: './dialog-boolean.scss',
})
export class DialogBoolean {

    constructor(private dialogRef: DialogRef,
                @Inject(DIALOG_DATA) public ask?: { title: string, message: string }) {}

    public confirm() {
        this.dialogRef.close(true);
    }

    public cancel() {
        this.dialogRef.close(false);
    }
}
