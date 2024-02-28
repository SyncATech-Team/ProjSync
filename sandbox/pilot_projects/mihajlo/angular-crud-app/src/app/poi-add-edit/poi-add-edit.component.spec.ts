import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiAddEditComponent } from './poi-add-edit.component';

describe('PoiAddEditComponent', () => {
  let component: PoiAddEditComponent;
  let fixture: ComponentFixture<PoiAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoiAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoiAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
