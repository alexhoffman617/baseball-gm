import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateScheduleTestComponent } from './generate-schedule-test.component';

describe('GenerateScheduleTestComponent', () => {
  let component: GenerateScheduleTestComponent;
  let fixture: ComponentFixture<GenerateScheduleTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateScheduleTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateScheduleTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
