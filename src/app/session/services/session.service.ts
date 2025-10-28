import { computed, Injectable, signal } from '@angular/core';
import { ISession } from '../interfaces/session.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
    private Sessions = signal<ISession[]>([]);
    private Active = signal<ISession | undefined>(undefined);

    public sessions = computed(() => this.Sessions());

    public active = computed(() => this.Active());

    public first = computed<ISession | undefined>(() => this.Sessions()[0]);

    constructor(){ }

    public add(session: ISession) {
        this.Sessions.update((sessions) => [...sessions, session]);
        this.select(session);
    }

    public select(session: ISession) {
        this.Active.set(session);
    }

    public remove(session: ISession) {
        this.Sessions.update((sessions) => sessions.filter(s => s.id !== session.id));
    }
}
