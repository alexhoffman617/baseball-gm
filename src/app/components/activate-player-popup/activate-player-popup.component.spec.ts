import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatePlayerPopupComponent } from './activate-player-popup.component';

describe('ActivatePlayerPopupComponent', () => {
  let component: ActivatePlayerPopupComponent;
  let fixture: ComponentFixture<ActivatePlayerPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivatePlayerPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivatePlayerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
