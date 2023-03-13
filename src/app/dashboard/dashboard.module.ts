import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProductsComponent } from './products/products.component';
import { StoresComponent } from './stores/stores.component';
import { OrdersComponent } from './orders/orders.component';
import { CustomersComponent } from './customers/customers.component';
import { ConnectToShopifyComponent } from './connect-to-shopify/connect-to-shopify.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { CustomerComponent } from './customer/customer.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CatalogComponent } from './catalog/catalog.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { VendorsComponent } from './vendors/vendors.component';
import { VendorProductComponent } from './vendor-product/vendor-product.component';
import { CatalogOrderComponent } from './catalog-order/catalog-order.component';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { CatalogOrderDetailComponent } from './catalog-order-detail/catalog-order-detail.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    HomeComponent,
    ProfileComponent,
    ProductsComponent,
    StoresComponent,
    OrdersComponent,
    CustomersComponent,
    ConnectToShopifyComponent,
    AddProductComponent,
    AddCustomerComponent,
    AddOrderComponent,
    CustomerComponent,
    ProductComponent,
    OrderComponent,
    EditProductComponent,
    CatalogComponent,
    VendorProfileComponent,
    VendorsComponent,
    VendorProductComponent,
    CatalogOrderComponent,
    ChatComponent,
    ChatListComponent,
    ChatDetailComponent,
    CatalogOrderDetailComponent,
    PaymentHistoryComponent,
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    // RouterModule,
  ],
  exports: [
    DashboardComponent,
    HeaderComponent,
    SharedModule,
    // ChatListComponent,
    // ChatDetailComponent,
  ],
})
export class DashboardModule {}
