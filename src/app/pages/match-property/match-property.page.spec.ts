import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchPropertyPage } from './match-property.page';

describe('MatchPropertyPage', () => {
  let component: MatchPropertyPage;
  let fixture: ComponentFixture<MatchPropertyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchPropertyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchPropertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
