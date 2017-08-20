import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePlayerTestComponent } from './generate-player-test.component';

describe('GeneratePlayerTestComponent', () => {
  let component: GeneratePlayerTestComponent;
  let fixture: ComponentFixture<GeneratePlayerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratePlayerTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePlayerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
