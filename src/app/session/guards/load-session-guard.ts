import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SessionService } from '../services/session.service';

export const loadSessionGuard: CanActivateFn = (route, state) => {
    const sessionService = inject(SessionService);
    // Try to get the session id from the route params
    const sessionId = route.paramMap.get('id');
    // Get sessions
    const sessions = sessionService.sessions();
    // Try to find it
    const session = sessions.find(s => s.uuid === sessionId);
    // If session active it
    if (session) {
        sessionService.select(session);
        return true;
    }
    // Get first session
    const [first] = sessions;
    // If first session exists select it
    if (first) {
        sessionService.select(first);
        return true;
    }
    // Create a new session
    sessionService.add({ uuid: crypto.randomUUID(), title: 'Session 1', padLoops: [] });
    // Return true to allow the route to be activated
    return true;
};
