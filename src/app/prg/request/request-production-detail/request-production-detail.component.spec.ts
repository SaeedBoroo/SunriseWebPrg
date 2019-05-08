import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestProductionDetailComponent } from './request-production-detail.component';

describe('RequestProductionDetailComponent', () => {
  let component: RequestProductionDetailComponent;
  let fixture: ComponentFixture<RequestProductionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestProductionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestProductionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
