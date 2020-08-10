import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeDetailPage } from './subscribe-detail.page';

describe('SubscribeDetailPage', () => {
  let component: SubscribeDetailPage;
  let fixture: ComponentFixture<SubscribeDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
