import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveRequestComponent } from './save-request.component';

describe('SaveRequestComponent', () => {
  let component: SaveRequestComponent;
  let fixture: ComponentFixture<SaveRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
