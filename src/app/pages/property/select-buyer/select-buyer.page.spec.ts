import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBuyerPage } from './select-buyer.page';

describe('SelectBuyerPage', () => {
  let component: SelectBuyerPage;
  let fixture: ComponentFixture<SelectBuyerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBuyerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBuyerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
