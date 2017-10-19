import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDbCleanupComponent } from './admin-db-cleanup.component';

describe('AdminDbCleanupComponent', () => {
  let component: AdminDbCleanupComponent;
  let fixture: ComponentFixture<AdminDbCleanupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDbCleanupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDbCleanupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
