import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { SharedModule } from '../shared/shared/shared.module';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { OrdersComponent } from './orders/orders.component';
import { VendorsComponent } from './vendors/vendors.component';
import { ProOrderComponent } from './pro-order/pro-order.component';
import { CatalogComponent } from './catalog/catalog.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetComponent } from './forget/forget.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import { StoresComponent } from './stores/stores.component';
import { ConnectToShopifyComponent } from './connect-to-shopify/connect-to-shopify.component';
import { CustomerComponent } from './customer/customer.component';
import { OrderComponent } from './order/order.component';
import { CartComponent } from './cart/cart.component';
import { ManualProductsComponent } from './manual-products/manual-products.component';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { CatalogOrderComponent } from './catalog-order/catalog-order.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { ProductGalleryComponent } from '../product-gallery/product-gallery.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [
    VendorComponent,
    ProductsComponent,
    CustomersComponent,
    OrdersComponent,
    VendorsComponent,
    ProOrderComponent,
    CatalogComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    ResetPasswordComponent,
    ProfileComponent,
    StoresComponent,
    ConnectToShopifyComponent,
    CustomerComponent,
    OrderComponent,
    CartComponent,
    ManualProductsComponent,
    ChatComponent,
    ChatListComponent,
    ChatDetailComponent,
    CatalogOrderComponent,
    PaymentDetailComponent,
    ProductGalleryComponent,
    NotificationsComponent
  ],
  imports: [CommonModule, VendorRoutingModule, SharedModule],
  exports: [VendorComponent, SharedModule],
})
export class VendorModule {}
