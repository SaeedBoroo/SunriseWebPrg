import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Userfurther2Component } from './userfurther2.component';

describe('Userfurther2Component', () => {
  let component: Userfurther2Component;
  let fixture: ComponentFixture<Userfurther2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Userfurther2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Userfurther2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
