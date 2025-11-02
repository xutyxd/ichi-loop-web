import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadLoopEmpty } from './pad-loop-empty';

describe('PadLoopEmpty', () => {
  let component: PadLoopEmpty;
  let fixture: ComponentFixture<PadLoopEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadLoopEmpty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PadLoopEmpty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
