import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoolean } from './dialog-boolean';

describe('DialogBoolean', () => {
  let component: DialogBoolean;
  let fixture: ComponentFixture<DialogBoolean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBoolean]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogBoolean);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
