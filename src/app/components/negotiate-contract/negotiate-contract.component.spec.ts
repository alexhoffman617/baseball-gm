import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiateContractComponent } from './negotiate-contract.component';

describe('NegotiateContractComponent', () => {
  let component: NegotiateContractComponent;
  let fixture: ComponentFixture<NegotiateContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegotiateContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegotiateContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
