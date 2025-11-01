import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ISession } from '../interfaces/session.interface';
import { UserStorageService } from '../../providers/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
    private userStorageService = inject(UserStorageService);

    private Sessions;

    private Active = signal<ISession | undefined>(undefined);

    public sessions = computed(() => this.Sessions());

    public active = computed(() => this.Active());

    public first = computed<ISession | undefined>(() => this.Sessions()[0]);

    constructor(){
        // Add effect to save update of active session
        effect(() => {
            // Get sessions on memory
            const sessions = this.Sessions();
            // Save on local storage
            this.userStorageService.set('sessions', sessions);
        });
        // Define sessions
        let sessions: ISession[] = [];
        try {
            // Try to load sessions from local storage
            sessions = this.userStorageService.get('sessions');
        } catch { }

        this.Sessions = signal<ISession[]>(sessions);
    }

    public add(session: ISession) {
        this.Sessions.update((sessions) => [...sessions, session]);
        this.select(session);
    }

    public select(session: ISession) {
        this.Active.set(session);
    }

    public update(session: ISession) {
        this.Sessions.update((sessions) => sessions.map(s => s.uuid === session.uuid ? session : s));
    }

    public remove(session: ISession) {
        this.Sessions.update((sessions) => sessions.filter(s => s.uuid !== session.uuid));
    }
}
