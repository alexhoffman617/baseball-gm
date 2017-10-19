import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPlayerRowComponent } from './team-player-row.component';

describe('TeamPlayerRowComponent', () => {
  let component: TeamPlayerRowComponent;
  let fixture: ComponentFixture<TeamPlayerRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPlayerRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPlayerRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
