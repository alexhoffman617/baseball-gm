import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFreeAgentComponent } from './team-free-agent.component';

describe('TeamFreeAgentComponent', () => {
  let component: TeamFreeAgentComponent;
  let fixture: ComponentFixture<TeamFreeAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamFreeAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamFreeAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
