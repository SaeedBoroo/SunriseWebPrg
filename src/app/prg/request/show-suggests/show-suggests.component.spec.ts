import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSuggestsComponent } from './show-suggests.component';

describe('ShowSuggestsComponent', () => {
  let component: ShowSuggestsComponent;
  let fixture: ComponentFixture<ShowSuggestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSuggestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSuggestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
