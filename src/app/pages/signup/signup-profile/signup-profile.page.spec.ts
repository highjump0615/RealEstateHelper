import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupProfilePage } from './signup-profile.page';

describe('SignupProfilePage', () => {
  let component: SignupProfilePage;
  let fixture: ComponentFixture<SignupProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
