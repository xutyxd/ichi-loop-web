import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadLoopButton } from './pad-loop-button';

describe('PadLoopButton', () => {
  let component: PadLoopButton;
  let fixture: ComponentFixture<PadLoopButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadLoopButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PadLoopButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
