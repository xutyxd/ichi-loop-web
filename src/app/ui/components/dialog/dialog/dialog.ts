import { AfterViewInit, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog implements AfterViewInit {
    @ViewChild('dialog') dialogRef?: ElementRef<HTMLDialogElement>;
    @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;

    public ngAfterViewInit() {
        if (!this.dialogRef) {
            return;
        }

        this.open();
    }

    public open() {
        const ref = this.dialogRef;

        if (!ref) {
            return;
        }

        if (ref.nativeElement.open) {
            return;
        }

        ref.nativeElement.showModal();
        ref.nativeElement.addEventListener('click', (e) => {
            if (e.target === ref.nativeElement) {
                this.close();
            }
        });
    }

    public close(data?: unknown) {
        if (!this.dialogRef) {
            return;
        }
        const value = data ? { data } : {};
        this.dialogRef.nativeElement.close(JSON.stringify(value));
    }
}
