import { Component, ElementRef } from '@angular/core';

@Component({
  selector: '[app-input]',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {

    public isSelect = false;

    constructor(private elementRef: ElementRef) {
        this.isSelect = this.elementRef.nativeElement.tagName.toLowerCase() === 'select';
    }
}
