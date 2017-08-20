import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGameTestComponent } from './play-game-test.component';

describe('HomeComponent', () => {
  let component: PlayGameTestComponent;
  let fixture: ComponentFixture<PlayGameTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayGameTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayGameTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
