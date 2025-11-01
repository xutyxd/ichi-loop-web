import { ComponentRef } from "@angular/core";
import { Dialog } from "../components/dialog/dialog/dialog";

export class DialogRef {
    private instance: Dialog;

    public nativeElement?: HTMLDialogElement;

    public set onClose(fn: (data?: unknown) => void) {
        this.instance.ready.then(() => {
            this.nativeElement?.addEventListener('close', fn);
        });
    }

    constructor(dialog: ComponentRef<Dialog>) {
        this.instance = dialog.instance;
        this.instance.ready.then(() => {
            this.nativeElement = this.instance.dialogRef?.nativeElement;
        });
    }

    public open() {
        this.instance.open();
    }

    public close(data?: unknown) {
        this.instance.close(data);
    }
}