import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToShopifyComponent } from './connect-to-shopify.component';

describe('ConnectToShopifyComponent', () => {
  let component: ConnectToShopifyComponent;
  let fixture: ComponentFixture<ConnectToShopifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectToShopifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectToShopifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
