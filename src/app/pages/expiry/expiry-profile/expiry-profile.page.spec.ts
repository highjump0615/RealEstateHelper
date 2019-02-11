import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryProfilePage } from './expiry-profile.page';

describe('ExpiryProfilePage', () => {
  let component: ExpiryProfilePage;
  let fixture: ComponentFixture<ExpiryProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiryProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
