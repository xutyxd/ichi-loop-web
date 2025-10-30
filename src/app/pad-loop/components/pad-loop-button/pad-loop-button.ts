import { Component, Input } from '@angular/core';
import { IPadLoop } from '../../interfaces/pad-loop.interface';

@Component({
  selector: 'app-pad-loop-button',
  imports: [],
  templateUrl: './pad-loop-button.html',
  styleUrl: './pad-loop-button.scss',
})
export class PadLoopButton {
    @Input() public padLoop?: IPadLoop;
}
