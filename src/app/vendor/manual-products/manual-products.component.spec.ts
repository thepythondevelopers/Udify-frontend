import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualProductsComponent } from './manual-products.component';

describe('ManualProductsComponent', () => {
  let component: ManualProductsComponent;
  let fixture: ComponentFixture<ManualProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
