import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupEmailPage } from './signup-email.page';

describe('SignupEmailPage', () => {
  let component: SignupEmailPage;
  let fixture: ComponentFixture<SignupEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupEmailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
