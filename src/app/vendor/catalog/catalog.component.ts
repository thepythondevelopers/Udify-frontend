import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { ModelService } from 'src/app/services/model.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  products: any = [];
  searchtext: any = '';
  pageIndex = 1;
  pageSize = 10;

  productSubscription: any;
  dateFormat = 'yyyy-MM-dd';
  filterDate: any = '';

  customerSubscription: any;
  total: any = 0;
  page: any = 1;

  storeSub: any;
  dateRange: any = '';
  constructor(
    public api: ApiService,
    private eventS: EventService,
    public modelS: ModelService,
    private ngxService: NgxUiLoaderService,
    private modal: NzModalService
  ) {
    // this.storeSub = this.eventS.getChangedStore().subscribe(() => {
    //   this.ngxService.start();
    //   this.getCatalog();
    // });
  }

  ngOnInit(): void {
    // if (this.modelS.selectedStore.length) {
      this.ngxService.start();
      this.getCatalog();
    // }
  }

  ngOnDestroy(): void {
    // if (this.storeSub) {
    //   this.storeSub.unsubscribe();
    // }
  }

  getCatalog() {
    console.log('filterDate:: ', this.filterDate);
    // let param: any = {
    //   store_id: this.modelS.selectedStore,
    //   page: this.page,
    // };
    // if (this.searchtext.length) {
    //   param.search_string = this.searchtext;
    // }
    // if (this.filterDate.length) {
    //   param.startedDate = moment(this.filterDate[0]).format('YYYY-MM-DD');
    //   param.endDate = moment(this.filterDate[1]).format('YYYY-MM-DD');
    // }
    // if (this.productSubscription) {
    //   this.productSubscription.unsubscribe();
    // }
    this.productSubscription = this.api
      .post('catalog-node/get-vendor-catalog', {})
      .subscribe(
        (data: any) => {
          console.log('Error:: ', data);
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.length) {
            console.log('data:: ', data);
            // this.total = Math.ceil(parseInt(data.data.count) / 10);
            // this.total = data.totalDocs;
            this.products = data;
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

  getProductImage(prod: any) {
    let data: any = JSON.parse(prod.images);
    return data.length ? data[0].src : false;
  }

  getStoreName(prod: any) {
    let data: any = this.modelS.allStores.find(
      (x) => x.store_id == prod.store_id
    );
    if (data) {
      return data.domain;
    } else {
      return 'N/A';
    }
  }

  paginate(event) {
    console.log('Event:: ', event);
    this.page = event;
    this.getCatalog();
  }

  removeProduct(prod) {
    this.modal.create({
      nzTitle: 'Are you sure?',
      nzContent: 'You want to remove this product from your catalog?',
      nzClosable: false,
      nzOkText: 'Yes',
      nzOnOk: () =>
        new Promise((resolve) => {
          this.deleteProd(prod);
        }),
    });
  }

  deleteProd(prod) {
    this.productSubscription = this.api
      .post('catalog-node/remove-product-catalog/' + prod?.id, {})
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          this.modal.closeAll();
          this.getCatalog();
          this.ngxService.stop();
        },
        (err) => {
          this.ngxService.stop();
          this.modal.closeAll();
          this.api.showToast(
            'error',
            err.error.message ? err.error.message : err.error.error
          );
        }
      );
  }
}
