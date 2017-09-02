import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerProgressionTestComponent } from './player-progression-test.component';

describe('PlayerProgressionTestComponent', () => {
  let component: PlayerProgressionTestComponent;
  let fixture: ComponentFixture<PlayerProgressionTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerProgressionTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerProgressionTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
