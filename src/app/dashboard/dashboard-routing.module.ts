import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../services/auth.guard';
import { OrdersComponent } from './orders/orders.component';
import { StoresComponent } from './stores/stores.component';
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
import { CatalogOrderDetailComponent } from './catalog-order-detail/catalog-order-detail.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'catalog-orders', component: CatalogOrderComponent },
      { path: 'catalog-orders/:id', component: CatalogOrderDetailComponent },
      { path: 'stores', component: StoresComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'connect-to-shopify', component: ConnectToShopifyComponent },

      { path: 'catalog', component: CatalogComponent },
      {path: 'payment-status', component: PaymentHistoryComponent},
      {path: 'notifications', component: NotificationsComponent},
      { path: 'vendors', component: VendorsComponent },
      { path: 'vendor/view/:id', component: VendorProfileComponent },

      { path: 'add-product', component: AddProductComponent },
      // { path: 'edit-product/:id', component: AddProductComponent },
      { path: 'edit-product/:id', component: EditProductComponent },
      { path: 'product/:id', component: ProductComponent },
      { path: 'vendor-products', component: VendorProductComponent },

      { path: 'add-customer', component: AddCustomerComponent },
      { path: 'edit-customer/:id', component: AddCustomerComponent },
      { path: 'customer/:id', component: CustomerComponent },

      { path: 'add-order', component: AddOrderComponent },
      { path: 'edit-order', component: AddOrderComponent },
      { path: 'order/:id', component: OrderComponent },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
