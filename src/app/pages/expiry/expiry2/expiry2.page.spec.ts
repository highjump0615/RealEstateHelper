import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Expiry2Page } from './expiry2.page';

describe('Expiry2Page', () => {
  let component: Expiry2Page;
  let fixture: ComponentFixture<Expiry2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Expiry2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Expiry2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
