import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistitemComponent } from './pricelistitem.component';

describe('PricelistComponent', () => {
  let component: PricelistitemComponent;
  let fixture: ComponentFixture<PricelistitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricelistitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelistitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
