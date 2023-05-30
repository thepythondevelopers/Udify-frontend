import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogOrderComponent } from './catalog-order/catalog-order.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ConnectToShopifyComponent } from './connect-to-shopify/connect-to-shopify.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomersComponent } from './customers/customers.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ManualProductsComponent } from './manual-products/manual-products.component';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { ProOrderComponent } from './pro-order/pro-order.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { StoresComponent } from './stores/stores.component';
import { VendorComponent } from './vendor.component';
import { VendorsComponent } from './vendors/vendors.component';
import { ProductGalleryComponent } from '../product-gallery/product-gallery.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: 'vendor',
    component: VendorComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },

      // { path: 'products', component: ProductsComponent },
      // { path: 'manual-products', component: ManualProductsComponent },
      { path: 'products', component: ManualProductsComponent },

      { path: 'customers', component: CustomersComponent },
      { path: 'customer/:id', component: CustomerComponent },

      //{ path: 'orders', component: OrdersComponent },
      { path: 'order/:id', component: OrderComponent },
      {path: 'notifications', component: NotificationsComponent},
      { path: 'vendors', component: VendorsComponent },
      { path: 'pro-order', component: ProOrderComponent },
      { path: 'catalog', component: CatalogComponent },
      {path :'catalog-orders', component: CatalogOrderComponent},
      {path :'payment-details', component: PaymentDetailComponent},
      { path: 'profile', component: ProfileComponent },
      { path: 'stores', component: StoresComponent },
      { path: 'connect-to-shopify', component: ConnectToShopifyComponent },

      { path: 'product-gallery',component: ProductGalleryComponent },

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
export class VendorRoutingModule {}
