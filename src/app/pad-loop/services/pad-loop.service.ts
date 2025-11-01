import { computed, inject, Injectable } from '@angular/core';
import { SessionService } from '../../session/services/session.service';

@Injectable({
    providedIn: 'root'
})
export class PadLoopService {
    private sessionService = inject(SessionService);

    public padLoops = computed(() => {
        // Get active session
        const active = this.sessionService.active();
        // Get all sessions
        const sessions = this.sessionService.sessions();
        // Return pad loops of active session
        return sessions.find(s => s.uuid === active?.uuid)?.padLoops ?? [];
    });
}
