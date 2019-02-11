import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteAddPage } from './note-add.page';

describe('NoteAddPage', () => {
  let component: NoteAddPage;
  let fixture: ComponentFixture<NoteAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
