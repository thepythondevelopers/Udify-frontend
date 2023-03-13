import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogOrderDetailComponent } from './catalog-order-detail.component';

describe('CatalogOrderDetailComponent', () => {
  let component: CatalogOrderDetailComponent;
  let fixture: ComponentFixture<CatalogOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogOrderDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
