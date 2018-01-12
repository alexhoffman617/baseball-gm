import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPitcherRowComponent } from './team-pitcher-row.component';

describe('TeamPitcherRowComponent', () => {
  let component: TeamPitcherRowComponent;
  let fixture: ComponentFixture<TeamPitcherRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPitcherRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPitcherRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
