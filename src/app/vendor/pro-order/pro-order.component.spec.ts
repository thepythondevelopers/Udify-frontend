import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProOrderComponent } from './pro-order.component';

describe('ProOrderComponent', () => {
  let component: ProOrderComponent;
  let fixture: ComponentFixture<ProOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
