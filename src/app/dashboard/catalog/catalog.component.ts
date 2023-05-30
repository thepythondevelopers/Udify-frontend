import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../services/api.service';
import { EventService } from '../../services/event.service';
import { ModelService } from '../../services/model.service';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: any = [];
  isCollapsed: boolean = false;
  shopiFyStores: any = [];
  selectedStore: any = '';
  user: any = {};
  isImpersonated: any = false;
  isStoreVisible: any = false;
  total: any = 0;
  page: any = 1;
  selectedProd: any = {};
  isAgreementVisible: any = false;
  agreementVal: any = null;
  agreementAccept: any = false;

  constructor(
    private modal: NzModalService,
    public api: ApiService,
    private auth: AuthService,
    private router: Router,
    private eventS: EventService,
    public modelS: ModelService,
    private ngxService: NgxUiLoaderService
  ) {
    this.eventS.getAddedStore().subscribe(() => {
      // this.ngxService.start();
      this.getShopifyConnectivity();
    });
  }

  ngOnInit(): void {
    this.getShopifyConnectivity();
    this.isImpersonated = this.auth.getSession('impersonate');
    this.getCatalogProducts();
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
        // this.ngxService.stop();
      },
      (err) => {
        this.shopiFyStores = [];
        this.modelS.allStores = [];
        this.modelS.selectedStore = [];
        this.eventS.changedStore();
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
        // this.ngxService.stop();
      }
    );
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

  getCatalogProducts() {
    this.ngxService.start();
    this.api.post('user-catalog-node/get-supplier-catalog', {}).subscribe(
      (data: any) => {
        console.log('Error:: ', data);
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.docs) {
          console.log('data:: ', data);
          // this.total = Math.ceil(parseInt(data.data.count) / 10);
          this.total = data.totalDocs;
          this.products = data.docs;
        } else {
          this.products = [];
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        console.log('Login err:: ', err);
        this.api.showToast(
          'error',
          err.error.message ? err.error.message : err.error.error
        );
      }
    );
  }

  paginate(event) {
    console.log('Event:: ', event);
    this.page = event;
    this.getCatalogProducts();
  }

  getProductImage(prod: any) {
    let data: any = JSON.parse(prod.images);
    return data.length ? data[0].src : false;
  }

  showVendor() {
    // this.router.navigateByUrl('/')
  }

  addProduct(prod) {
    console.log("prod details::",prod);
    console.log('this.selectedProd:: ', prod.id);
    // return;
    this.upgradeModal(prod);
  }

  upgradeModal(prod) {
    let modal = this.modal.create({
      nzTitle:
        '<span nz-icon nzType="info-circle" nzTheme="outline"></span><span class="upgrade">Requires an upgrade</span>',
      nzContent:
        'Please upgrade your subscription to get access to this feature',
      nzClosable: true,
      nzClassName: 'custom_nzmodal',
      nzOkText: 'Upgrade subscription',
      nzOnOk: () =>
        new Promise((resolve) => {
          this.selectedProd = prod;
          modal.close();
          this.isStoreVisible = true;
        }),
    });
  }

  checkUserAgreement() {
    if (this.selectedStore) {
      // if (!this.agreementVal && this.agreementVal == null) {
      //   this.isAgreementVisible = true;
      // } else {
      //   this.addProductToStore();
      // }
      this.ngxService.start();
      this.api
        .post(
          //'agreement-node/check-aggreement/' + this.selectedProd.user_id._id,s
          'agreement-node/check-aggreement/' + this.selectedProd._id,
          {}
        )
        .subscribe((data: any) => {
          console.log('checkUserAgreement Data:: ', data);
          if (data && data != null) {
            this.isAgreementVisible = false;
            this.addProductToStore();
            // if (data.hasOwnProperty('error')) {
            //   this.api.showToast('error', data.error);
            //   return false;
            // }
            // if (data && data.message) {
            //   if((data.message).toLowerCase().indexOf('already') > -1) {
            //     this.api.showToast('error', data.message);
            //   } else {
            //     this.api.showToast('success', data.message);
            //     this.isAgreementVisible = false;
            //     // this.addProductToStore();
            //   }
            // }
          } else {
            this.isAgreementVisible = true;
          }
          this.ngxService.stop();
        });
    } else {
      this.api.showToast('error', 'Please choose store');
    }
  }

  checkProductToStore() {
    if (this.agreementAccept) {
      this.ngxService.start();
      this.api
        .post('agreement-node/aggreement/' + this.selectedProd._id, {})
        .subscribe(
          (data: any) => {
            if (data.hasOwnProperty('error')) {
              this.api.showToast('error', data.error);
              return false;
            }
            if (data && data.message) {
              if (data.message.toLowerCase().indexOf('already') > -1) {
                this.api.showToast('error', data.message);
              } else {
                this.api.showToast('success', data.message);
                this.isStoreVisible = false;
                this.isAgreementVisible = false;
                this.addProductToStore();
              }
            }
            this.ngxService.stop();
          },
          (err) => {
            this.ngxService.stop();
            // this.isAgreementVisible = false;
            this.api.showToast('error', err.error.error);
          }
        );
      // this.addProductToStore();
    }
  }

  addProductToStore() {
    // if (this.selectedStore) {
    this.ngxService.start();
    this.api
      .post(
        'user-catalog-node/add-product-catalog-shopify/' +
          this.selectedProd.id +
          '/' +
          this.selectedStore,
        {}
      )
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.isStoreVisible = false;
          } else {
          }
          this.ngxService.stop();
        },
        (err) => {
          this.ngxService.stop();
          this.isStoreVisible = false;
          console.log("error from order list::",err);
          this.api.showToast('error', err.error.message);
        }
      );
    // } else {
    //   this.api.showToast('error', 'Please choose store');
    // }
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isStoreVisible = false;
  }

  cancelAgreement(): void {
    console.log('Button cancel clicked!');
    this.isAgreementVisible = false;
  }
}
