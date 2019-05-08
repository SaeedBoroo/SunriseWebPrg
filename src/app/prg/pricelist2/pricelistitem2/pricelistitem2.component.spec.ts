import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pricelistitem2Component } from './pricelistitem2.component';

describe('Pricelistitem2Component', () => {
  let component: Pricelistitem2Component;
  let fixture: ComponentFixture<Pricelistitem2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pricelistitem2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pricelistitem2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
