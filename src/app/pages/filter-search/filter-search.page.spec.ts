import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSearchPage } from './filter-search.page';

describe('FilterSearchPage', () => {
  let component: FilterSearchPage;
  let fixture: ComponentFixture<FilterSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
