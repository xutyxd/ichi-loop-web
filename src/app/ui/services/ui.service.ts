import { computed, Injectable, NgZone, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
    private Keys = {
        pressed: signal<Set<string>>(new Set()),
        add: (event: KeyboardEvent) => {
            // Stop propagation
            event.stopPropagation();
            event.preventDefault();
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
        },
        remove: (event: KeyboardEvent) => {
            // Stop propagation
            event.stopPropagation();
            event.preventDefault();
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
            window.addEventListener('keydown', this.Keys.add);
            window.addEventListener('keyup', this.Keys.remove);
            window.addEventListener('blur', this.Keys.clean);
        });
    }
}
