import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FantasyDraftComponent } from './fantasy-draft.component';

describe('FantasyDraftComponent', () => {
  let component: FantasyDraftComponent;
  let fixture: ComponentFixture<FantasyDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FantasyDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FantasyDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
