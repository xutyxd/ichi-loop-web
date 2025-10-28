import { Component, inject } from '@angular/core';
import { SessionService } from '../../services/session.service';

import { Button } from '../../../ui/components/button/button';
import { DialogService } from '../../../ui/services/dialog.service';
import { PadLoopForm } from '../../../pad-loop/components/pad-loop-form/pad-loop-form';

@Component({
  selector: 'app-session-layout',
  imports: [Button],
  templateUrl: './session-layout.html',
  styleUrl: './session-layout.scss',
})
export class SessionLayout {
    private dialogService = inject(DialogService);
    private sessionService = inject(SessionService);
    
    public session = this.sessionService.active;

    public addLoop() {
        this.dialogService.open(PadLoopForm);
    }
}
