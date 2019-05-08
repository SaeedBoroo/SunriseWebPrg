import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pricelist2Component } from './pricelist2.component';

describe('Pricelist2Component', () => {
  let component: Pricelist2Component;
  let fixture: ComponentFixture<Pricelist2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pricelist2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pricelist2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
