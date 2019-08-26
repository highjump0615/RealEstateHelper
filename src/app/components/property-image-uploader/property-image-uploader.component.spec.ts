import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyImageUploaderComponent } from './property-image-uploader.component';

describe('PropertyImageUploaderComponent', () => {
  let component: PropertyImageUploaderComponent;
  let fixture: ComponentFixture<PropertyImageUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyImageUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
