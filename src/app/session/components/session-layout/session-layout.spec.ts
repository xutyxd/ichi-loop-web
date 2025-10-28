import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionLayout } from './session-layout';

describe('SessionLayout', () => {
  let component: SessionLayout;
  let fixture: ComponentFixture<SessionLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
