import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsNewUser } from './settings-new-user';

describe('SettingsNewUser', () => {
  let component: SettingsNewUser;
  let fixture: ComponentFixture<SettingsNewUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsNewUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsNewUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
