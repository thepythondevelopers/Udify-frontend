import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../services/api.service';
import { EventService } from '../services/event.service';
import { ModelService } from '../services/model.service';
import { DataModel } from './models/data.model';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isCollapsed: boolean = false;
  shopiFyStores: any = [];
  selectedStore: any = 'all';
  dataM = new DataModel();
  user: any = {};
  isImpersonated: any = false;
  no_of_notf: any;
  constructor(
    public api: ApiService,
    private auth: AuthService,
    private router: Router,
    private eventS: EventService,
    public modelS: ModelService,
    private ngxService: NgxUiLoaderService
  ) {


    this.eventS.getAddedStore().subscribe(() => {
      this.ngxService.start();
      this.getShopifyConnectivity();
    });

    this.eventS.getUpdatedProfile().subscribe(() => {
      this.getProfile();
    });
  }

  ngOnInit(): void {

    console.log('SPINNER:: ', SPINNER);
    this.ngxService.start();
    this.getShopifyConnectivity();
    this.getProfile();

    this.isImpersonated = this.auth.getSession('impersonate');
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

  notification(){
    console.log("email::",JSON.parse(localStorage.getItem("user")).email)
    if(JSON.parse(localStorage.getItem("user")).email){
      this.api.get('aware-node/get-notification/'+JSON.parse(localStorage.getItem("user")).email, {}).subscribe(
        async (data: any) => {
          if(data){
            this.no_of_notf = data.notification.length;
          }
        }
      )
    }
  }

  getProfile() {
    this.api.get('profile-node/get-profile', {}).subscribe(
      async (data: any) => {
        if (data.hasOwnProperty('error')) {
          return false;
        }
        if (data.hasOwnProperty('email')) {
          this.user = data;
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
}
