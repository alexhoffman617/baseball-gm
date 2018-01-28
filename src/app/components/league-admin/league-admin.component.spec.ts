import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueAdminComponent } from './league-admin.component';

describe('LeagueAdminComponent', () => {
  let component: LeagueAdminComponent;
  let fixture: ComponentFixture<LeagueAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeagueAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
