import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeamTestComponent } from './create-team-test.component';

describe('CreateTeamTestComponent', () => {
  let component: CreateTeamTestComponent;
  let fixture: ComponentFixture<CreateTeamTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTeamTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTeamTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
