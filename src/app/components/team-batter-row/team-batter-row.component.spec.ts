import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamBatterRowComponent } from './team-batter-row.component';

describe('TeamBatterRowComponent', () => {
  let component: TeamBatterRowComponent;
  let fixture: ComponentFixture<TeamBatterRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamBatterRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamBatterRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
