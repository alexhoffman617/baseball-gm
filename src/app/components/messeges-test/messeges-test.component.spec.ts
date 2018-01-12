import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessegesTestComponent } from './messeges-test.component';

describe('MessegesTestComponent', () => {
  let component: MessegesTestComponent;
  let fixture: ComponentFixture<MessegesTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessegesTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessegesTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
