import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {
  stores: any = [];
  constructor(
    public api: ApiService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.getShopifyConnectivity();
  }

  getShopifyConnectivity() {
    this.ngxService.start();
    this.api.get('integration-node/get-integration-all', {}).subscribe(
      async (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.stores = [];
          return false;
        }
        if (data.length) {
          this.stores = data;
        } else {
          this.stores = [];
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.stores = [];
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  sync(type: any, store: any) {
    // this.ngxService.start();
    this.api.showSwal('success', 'The store will get updated with the current details of the shopify.');
    this.api.get('vendor-'+type+'-node/sync-' + type + '/' + store._id, {}).subscribe(
      async (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        this.api.showToast('success', data.message);
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        console.log('Login err:: ', err);
        this.api.showToast(
          'error',
          err.error.hasOwnProperty('message')
            ? err.error.message
            : err.error.error
        );
      }
    );
  }
}

