import { ApplicationRef, createComponent, createEnvironmentInjector, EnvironmentInjector, inject, Injectable, Injector, Type } from '@angular/core';

import { KeyboardService } from './keyboard.service';

import { DIALOG_DATA } from '../tokens/dialog.tokens';
import { DialogRef } from '../classes/dialog-ref.class';
import { Dialog } from '../components/dialog/dialog/dialog';
import { DialogBoolean } from '../components/dialog/dialog-boolean/dialog-boolean';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private appRef = inject(ApplicationRef);
    private envInjector = inject(EnvironmentInjector);

    private keyboardService = inject(KeyboardService);

    public open<T, R = unknown>(component: Type<T>, data?: unknown): Promise<R | undefined> {
        this.keyboardService.keys.disable();
        // Create a new dialog component to host component inside
        const hostRef = createComponent(Dialog, {
            environmentInjector: this.envInjector
        });
        // Define base providers
        const providers = [
            { provide: DialogRef, useValue: new DialogRef(hostRef) },
            { provide: DIALOG_DATA, useValue: data }
        ];

        const injector = createEnvironmentInjector(providers, this.envInjector);
        // this.appRef.tick();
        const childRef = hostRef.instance.vc.createComponent(component, { environmentInjector: injector });

        // attach view to app and add host element to body
        this.appRef.attachView(hostRef.hostView);
        // Append host element to body
        document.body.appendChild(hostRef.location.nativeElement);

        let resolveFn: (value?: R) => void;
        const resultPromise = new Promise<R | undefined>((resolve) => {
            resolveFn = resolve;
        });

        const closeFn = (result?: R) => {
            // close native dialog
            try { hostRef?.instance.dialogRef?.nativeElement.close(); } catch { }
            // destroy child
            if (childRef) {
                childRef.destroy();
            }
            // remove host
            if (hostRef) {
                this.appRef.detachView(hostRef.hostView);
                hostRef.destroy();
            }

            resolveFn(result);
        };
        this.appRef.tick();
        const dialogEl = hostRef.instance.dialogRef?.nativeElement as HTMLDialogElement;

        const close = (event?: Event) => {
            event?.preventDefault();

            const value = (event?.target as HTMLDialogElement | undefined)?.returnValue;

            let formatted = value;
            try {
                formatted = JSON.parse(formatted as string).data;
            } catch { }

            this.keyboardService.keys.enable();
            closeFn(formatted as R | undefined);
        };

        dialogEl.addEventListener('close', close, { once: true });
        dialogEl.addEventListener('cancel', close, { once: true });

        return resultPromise;
    }

    public async ask(title: string, message: string) {
        const response = await this.open(DialogBoolean, {
            title,
            message,
        });

        return Boolean(response);
    }
}
