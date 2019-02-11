import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBuyerPage } from './profile-buyer.page';

describe('ProfileBuyerPage', () => {
  let component: ProfileBuyerPage;
  let fixture: ComponentFixture<ProfileBuyerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileBuyerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBuyerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
