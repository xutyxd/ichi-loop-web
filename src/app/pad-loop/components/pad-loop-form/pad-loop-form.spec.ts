import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadLoopForm } from './pad-loop-form';

describe('PadLoopForm', () => {
  let component: PadLoopForm;
  let fixture: ComponentFixture<PadLoopForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadLoopForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PadLoopForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
