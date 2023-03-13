import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogOrderComponent } from './catalog-order.component';

describe('CatalogOrderComponent', () => {
  let component: CatalogOrderComponent;
  let fixture: ComponentFixture<CatalogOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
