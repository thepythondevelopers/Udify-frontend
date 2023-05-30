import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../services/api.service';
import { EventService } from '../../services/event.service';
import { ModelService } from '../../services/model.service';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import moment from 'moment';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.css'],
})
export class VendorProfileComponent implements OnInit {
  products: any = [];
  vendor: any = {};
  id: any = '';
  total: any = 0;
  page: any = 1;
  filterDate: any = '';
  searchtext: any = '';
  selectedProd: any = {};
  isStoreVisible: any = false;
  isAgreementVisible: any = false;
  selectedStore: any = '';
  shopiFyStores: any = [];
  agreementVal: any = null;
  agreementAccept: any = false;
  constructor(
    private modal: NzModalService,
    public api: ApiService,
    private auth: AuthService,
    private router: Router,
    private eventS: EventService,
    public modelS: ModelService,
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute
  ) {
    this.eventS.getAddedStore().subscribe(() => {
      // this.ngxService.start();
      this.getShopifyConnectivity();
    });
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('id')) {
        this.id = params.id;
        this.ngxService.start();
        this.getVendor();
        this.getVendorProduct();
      }
    });
  }

  ngOnInit(): void {
    this.getShopifyConnectivity();
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

  getVendor() {
    this.api.post('user-vendor-node/user-vendor/' + this.id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && Object.keys(data).length) {
          console.log('Customer data:: ', data);
          this.agreementVal = data.aggreement;
          this.vendor = data.hasOwnProperty('_id') ? data : data.data;
        } else {
          this.vendor = {};
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.vendor = {};
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  getVendorProduct() {
    let param: any = {
      store_id: this.modelS.selectedStore,
      page: this.page,
    };
    if (this.searchtext.length) {
      param.search_string = this.searchtext;
    }
    if (this.filterDate.length) {
      param.startedDate = moment(this.filterDate[0]).format('YYYY-MM-DD');
      param.endDate = moment(this.filterDate[1]).format('YYYY-MM-DD');
    }
    this.api
      .post('user-catalog-node/get-vendor-product/' + this.id, param)
      .subscribe(
        (data: any) => {
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
          this.products = [];
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
  }

  getProductImage(prod: any) {
    let data: any = JSON.parse(prod.images);
    return data.length ? data[0].src : false;
  }

  paginate(event) {
    console.log('Event:: ', event);
    this.page = event;
    this.getVendorProduct();
  }

  getImage(img) {
    return img && img !== null ? 'data:image/png;base64,' + img : '';
  }

  addToFav() {
    this.ngxService.start();
    this.api
      .post('user-vendor-node/add-vendor-favourite/' + this.id, {})
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
          } else {
          }
          this.ngxService.stop();
        },
        (err) => {
          this.ngxService.stop();
          this.api.showToast('error', err.error.error);
        }
      );
  }

  addProduct(prod) {
    this.upgradeModal(prod);
  }

  upgradeModal(prod) {
    let modal = this.modal.create({
      nzTitle:
        '<span nz-icon nzType="info-circle" nzTheme="outline"></span> Requires an upgrade',
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
      if (!this.agreementVal && this.agreementVal == null) {
        this.isAgreementVisible = true;
      } else {
        this.addProductToStore();
      }
    } else {
      this.api.showToast('error', 'Please choose store');
    }
  }

  checkProductToStore() {
    if (this.agreementAccept) {
      this.ngxService.start();
      this.api
        .post('agreement-node/aggreement/' + this.vendor._id, {})
        .subscribe(
          (data: any) => {
            if (data.hasOwnProperty('error')) {
              this.api.showToast('error', data.error);
              return false;
            }
            if (data && data.message) {
              if((data.message).toLowerCase().indexOf('already') > -1) {
                this.api.showToast('error', data.message);
              } else {
                this.api.showToast('success', data.message);
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
          this.api.showToast('error', err.error.error);
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

  chat() {
    console.log("this vendor::",this.vendor);
    let modal = this.modal.create({
      nzTitle: '',
      nzContent: ChatComponent,
      nzComponentParams: { vendor: this.vendor },
      nzClosable: false,
      nzClassName: 'custom_nzmodal chat_nzmodal',
      nzFooter: null,
      nzCloseIcon: null,
      nzOnOk: () => new Promise((resolve) => {}),
    });
  }
}
