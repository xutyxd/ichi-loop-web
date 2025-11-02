import { computed, Injectable, NgZone, signal } from '@angular/core';
import { SpecialKeys } from '../enums/special-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class UiService {
    private Keys = {
        special: new Set(Object.values(SpecialKeys)),
        pressed: signal<Set<string>>(new Set()),
        disable: false,
        add: (event: KeyboardEvent) => {
            const pressed = [...this.Keys.pressed()];
            const special = pressed.some((key) => this.Keys.special.has(key as any));
            // Avoid exit from app
            if (pressed.length > 0 && special) {
                // Stop propagation
                event.stopPropagation();
                event.preventDefault();
            }
            
            // Get code
            const { code } = event;
            // Get current keys
            const current = new Set(this.Keys.pressed());
            // Check if key is already pressed
            if (current.has(code)) {
                return;
            }
            // Add key
            current.add(code);
            // Set new keys
            this.Keys.pressed.set(current);
            console.log('pressed', current);
        },
        remove: (event: KeyboardEvent) => {
            // // Stop propagation
            // event.stopPropagation();
            // event.preventDefault();
            // Get code
            const { code } = event;
            // Get current keys
            const current = new Set(this.Keys.pressed());
            // Check if key is already pressed
            if (current.delete(code)) {
                // Set new keys
                this.Keys.pressed.set(current);
            }
        },
        clean: () => {
            this.Keys.pressed.set(new Set());
        }
    };
    // Expose keys as computed avoiding writable signal
    public keys = computed(() => this.Keys.pressed());

    constructor(ngZone: NgZone) {
        // Avoid zone for performance
        ngZone.runOutsideAngular(() => {
            window.addEventListener('keydown', (event: KeyboardEvent) => {
                if (this.Keys.disable) {
                    return;
                }

                this.Keys.add(event);
            });
            window.addEventListener('keyup', (event: KeyboardEvent) => {
                if (this.Keys.disable) {
                    return;
                }
                this.Keys.remove(event);
            });
            window.addEventListener('blur', () => {
                if (this.Keys.disable) {
                    return;
                }
                this.Keys.clean();
            });
        });
    }

    public disableKeys() {
        this.Keys.disable = true;
    }

    public enableKeys() {
        this.Keys.disable = false;
    }
}
