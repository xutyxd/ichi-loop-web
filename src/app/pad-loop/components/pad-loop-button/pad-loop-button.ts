import { Component, inject, Input } from '@angular/core';
import { IPadLoop } from '../../interfaces/pad-loop.interface';
import { UiService } from '../../../ui/services/ui.service';
import { LucideAngularModule, LucideSettings, LucideTrash } from 'lucide-angular';

@Component({
  selector: 'app-pad-loop-button',
  imports: [LucideAngularModule],
  templateUrl: './pad-loop-button.html',
  styleUrl: './pad-loop-button.scss',
})
export class PadLoopButton {
    private uiService = inject(UiService);

    public LucideSettings = LucideSettings;

    public LucideTrash = LucideTrash;

    @Input() public padLoop?: IPadLoop;

    public edit() {
        console.log('edit', this.padLoop);
    }

    public remove() {
        console.log('delete', this.padLoop);
    }
}
