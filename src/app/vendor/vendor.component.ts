import { Component, OnInit } from '@angular/core';
import {
  NavigationStart,
  Router,
  Event as NavigationEvent,
} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../services/api.service';
import { EventService } from '../services/event.service';
import { ModelService } from '../services/model.service';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { CartComponent } from './cart/cart.component';
import { filter } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
})
export class VendorComponent implements OnInit {
  isCollapsed: boolean = false;
  shopiFyStores: any = [];
  selectedStore: any = 'all';
  isImpersonated: any = false;
  user: any = {};
  cartItems: any = Array(10);
  cartLoading = false;
  initLoading = false;
  menuItem: any = '/vendor/home';
  constructor(
    public api: ApiService,
    private auth: AuthService,
    private router: Router,
    private eventS: EventService,
    public modelS: ModelService,
    private ngxService: NgxUiLoaderService,
    private drawerService: NzDrawerService,
    private modal: NzModalService
  ) {
    this.eventS.getAddedStore().subscribe(() => {
      this.ngxService.start();
      // this.getShopifyConnectivity();
    });

    this.eventS.getUpdatedProfile().subscribe(() => {
      this.getProfile();
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationEvent) => {
        if (event) {
          if (
            event['url'] == '/vendor/home' ||
            event['url'] == '/vendor/products' ||
            event['url'] == '/vendor/manual-products' ||
            event['url'] == '/vendor/customers' ||
            event['url'] == '/vendor/orders' ||
            event['url'] == '/vendor/stores' ||
            event['url'] == '/vendor/catalog'
          ) {
            this.menuItem = event['url'];
          } else {
            this.menuItem = '';
          }
        } else {
          this.menuItem = '';
        }
      });
  }

  ngOnInit(): void {
    console.log('SPINNER:: ', SPINNER);
    this.ngxService.start();
    // this.getShopifyConnectivity();
    this.getProfile();

    this.isImpersonated = this.auth.getSession('impersonate');
  }

  ordersPage() {
    if (this.api.isUserOrders) {
      this.api.isUserOrders = false;
      this.eventS.changedStore();
    }
  }

  producsPage() {
    if (this.api.isManualProducts) {
      this.api.isManualProducts = false;
      this.eventS.changedStore();
    }
  }

  async getShopifyConnectivity() {
    this.api.get('integration-node/get-integration-all', {}).subscribe(
      async (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.shopiFyStores = [];
          return false;
        }
        if (data.length) {
          // this.hasIntegrations = true;
          this.shopiFyStores = data;
          this.modelS.allStores = data;
          // this.selectedStore = data[0].guid;
          let allGuid = await data.map((x) => {
            return x.store_id;
          });
          console.log('stores:: ', data, allGuid);
          if (allGuid) {
            this.modelS.selectedStore = allGuid;
            this.eventS.changedStore();
          }
        } else {
          // this.shopiFyStores = ['One', 'Two', 'Three'];
          this.shopiFyStores = [];
          this.modelS.allStores = [];
          this.modelS.selectedStore = [];
          this.eventS.changedStore();
          // this.hasIntegrations = false;
        }
        this.ngxService.stop();
      },
      (err) => {
        this.shopiFyStores = [];
        this.modelS.allStores = [];
        this.modelS.selectedStore = [];
        this.eventS.changedStore();
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
        this.ngxService.stop();
      }
    );
  }

  logout() {
    if (this.isImpersonated) {
      this.modelS.isImpersonated = false;
      this.modelS.impersonatedToken = '';
      this.modelS.impersonatedUser = {};
      this.auth.removeSession('impersonate');
      this.router.navigate(['/admin/users']);
    } else {
      this.auth.logout();
    }
  }

  async storeChange() {
    console.log('Current Store:: ', this.selectedStore);
    if (this.selectedStore == 'all') {
      let allGuid = await this.shopiFyStores.map((x) => {
        return x.store_id;
      });
      if (allGuid) {
        this.modelS.selectedStore = allGuid;
      }
    } else {
      this.modelS.selectedStore = [this.selectedStore];
    }
    this.eventS.changedStore();
  }

  getProfile() {
    this.api.get('profile-node/get-profile', {}).subscribe(
      async (data: any) => {
        if (data.hasOwnProperty('error')) {
          return false;
        }
        if (data.hasOwnProperty('email')) {
          this.user = data;
          console.log("user data::",this.user);
          if (!this.isImpersonated) {
            this.auth.setUser(data);
          }
        }
        this.ngxService.stop();
      },
      () => {
        this.ngxService.stop();
      }
    );
  }

  openCart() {
    const drawerRef = this.drawerService.create<
      CartComponent,
      { value: string },
      string
    >({
      nzTitle: 'Cart',
      nzWrapClassName: 'cartDrawer',
      nzContent: CartComponent,
    });

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe((data) => {
      console.log(data);
      // if (typeof data === 'string') {
      //   this.value = data;
      // }
    });
  }

  chat() {
    let modal = this.modal.create({
      nzTitle: '',
      nzContent: ChatComponent,
      nzClosable: false,
      nzClassName: 'custom_nzmodal chat_nzmodal',
      nzFooter: null,
      nzCloseIcon: null,
      nzOnOk: () => new Promise((resolve) => {}),
    });
  }
}
