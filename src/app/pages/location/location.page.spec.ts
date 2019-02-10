import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPage } from './location.page';

describe('LocationPage', () => {
  let component: LocationPage;
  let fixture: ComponentFixture<LocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
