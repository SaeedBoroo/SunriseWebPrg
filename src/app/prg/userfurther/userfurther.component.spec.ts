import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserfurtherComponent } from './userfurther.component';

describe('UserfurtherComponent', () => {
  let component: UserfurtherComponent;
  let fixture: ComponentFixture<UserfurtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserfurtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserfurtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
