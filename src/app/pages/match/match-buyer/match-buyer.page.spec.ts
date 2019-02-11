import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchBuyerPage } from './match-buyer.page';

describe('MatchBuyerPage', () => {
  let component: MatchBuyerPage;
  let fixture: ComponentFixture<MatchBuyerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchBuyerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchBuyerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
