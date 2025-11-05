import { Component, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { LucideAngularModule } from "lucide-angular";

import { DialogService } from '../../../ui/services/dialog.service';
import { Button } from '../../../ui/components/button/button';

import { SessionService } from '../../services/session.service';
import { ISession } from '../../interfaces/session.interface';





@Component({
  selector: 'app-session-list',
  imports: [UpperCasePipe, Button, LucideAngularModule],
  templateUrl: './session-list.html',
  styleUrl: './session-list.scss',
})
export class SessionList {
    private router: Router = inject(Router);
    private dialogService: DialogService = inject(DialogService);
    private sessionService: SessionService = inject(SessionService);

    public sessions = this.sessionService.sessions;

    public add() {
        // Get length of sessions
        const length = this.sessions().length;

        // Create new session
        const session: ISession = {
            uuid: crypto.randomUUID(),
            title: `Session ${length + 1}`,
            padLoops: [],
            active: true,
        };

        this.sessionService.add(session);
    }

    public select(session: ISession) {
        // Navigate to session
        this.router.navigate([`/${session.uuid}`]);
    }

    public async remove(session: ISession) {
        const response = await this.dialogService.ask('Confirm', 'Are you sure you want to delete this session?');
        
        if (!response) {
            return;
        }

        this.sessionService.remove(session);
    }
}
