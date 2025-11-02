import { Component, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

import { Button } from '../../../ui/components/button/button';

import { SessionService } from '../../services/session.service';
import { ISession } from '../../interfaces/session.interface';
import { Router } from '@angular/router';



@Component({
  selector: 'app-session-list',
  imports: [UpperCasePipe, Button],
  templateUrl: './session-list.html',
  styleUrl: './session-list.scss',
})
export class SessionList {
    private router: Router = inject(Router);
    private sessionService: SessionService = inject(SessionService);

    public sessions = this.sessionService.sessions;

    public add() {
        // Get length of sessions
        const length = this.sessions().length;

        // Create new session
        const session: ISession = {
            uuid: crypto.randomUUID(),
            title: `Session ${length + 1}`,
            padLoops: []
        };

        this.sessionService.add(session);
    }

    public select(session: ISession) {
        // Navigate to session
        this.router.navigate([`/${session.uuid}`]);
    }

    public remove(session: ISession) {
        this.sessionService.remove(session);
    }
}
