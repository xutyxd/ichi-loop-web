import { Component, inject } from '@angular/core';
import { SessionService } from '../../services/session.service';

import { Button } from '../../../ui/components/button/button';
import { DialogService } from '../../../ui/services/dialog.service';
import { PadLoopForm } from '../../../pad-loop/components/pad-loop-form/pad-loop-form';
import { IPadLoop } from '../../../pad-loop/interfaces/pad-loop.interface';
import { PadLoopButton } from '../../../pad-loop/components/pad-loop-button/pad-loop-button';
import { PadLoopService } from '../../../pad-loop/services/pad-loop.service';

@Component({
  selector: 'app-session-layout',
  imports: [Button, PadLoopButton],
  templateUrl: './session-layout.html',
  styleUrl: './session-layout.scss',
})
export class SessionLayout {
    private dialogService = inject(DialogService);
    private sessionService = inject(SessionService);
    private padLoopService = inject(PadLoopService);
    
    public session = this.sessionService.active;

    public padLoops = this.padLoopService.padLoops;

    public async addLoop() {
        const padLoop = await this.dialogService.open(PadLoopForm) as IPadLoop | undefined;

        if (!padLoop) {
            return;
        }

        const session = this.session();

        if (!session) {
            return;
        }
        const updated = { ...session, padLoops: [...session.padLoops, padLoop] };
        // Update session
        this.sessionService.update(updated);
        // Re-select session
        this.sessionService.select(updated);
    }
}
