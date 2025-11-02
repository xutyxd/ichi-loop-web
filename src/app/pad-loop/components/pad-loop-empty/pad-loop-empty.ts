import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { Button } from '../../../ui/components/button/button';
import { PadLoopForm } from '../pad-loop-form/pad-loop-form';
import { IPadLoop } from '../../interfaces/pad-loop.interface';
import { DialogService } from '../../../ui/services/dialog.service';
import { SessionService } from '../../../session/services/session.service';
import { PadLoopService } from '../../services/pad-loop.service';

@Component({
  selector: 'app-pad-loop-empty',
  imports: [LucideAngularModule, Button],
  templateUrl: './pad-loop-empty.html',
  styleUrl: './pad-loop-empty.scss',
})
export class PadLoopEmpty {

    private dialogService = inject(DialogService);
    private sessionService = inject(SessionService);
    
    private session = this.sessionService.active;

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
