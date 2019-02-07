import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Expiry1Page } from './expiry1.page';

describe('Expiry1Page', () => {
  let component: Expiry1Page;
  let fixture: ComponentFixture<Expiry1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Expiry1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Expiry1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
