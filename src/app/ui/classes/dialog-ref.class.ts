import { ComponentRef } from "@angular/core";
import { Dialog } from "../components/dialog/dialog/dialog";

export class DialogRef {
    private instance: Dialog;
    public nativeElement: HTMLDialogElement;

    constructor(dialog: ComponentRef<Dialog>) {
        this.instance = dialog.instance;
        this.nativeElement = dialog.instance.dialogRef?.nativeElement as HTMLDialogElement;
    }

    public open() {
        this.instance.open();
    }

    public close(data?: unknown) {
        this.instance.close(data);
    }
}