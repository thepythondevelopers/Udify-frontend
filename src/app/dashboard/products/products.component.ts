import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { ModelService } from 'src/app/services/model.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
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
    private ngxService: NgxUiLoaderService
  ) {
    this.storeSub = this.eventS.getChangedStore().subscribe(() => {
      this.ngxService.start();
      this.getProducts();
    });
  }

  ngOnInit(): void {
    if (this.modelS.selectedStore.length) {
      this.ngxService.start();
      this.getProducts();
    }
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  getProducts() {
    console.log('filterDate:: ', this.filterDate);
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
    } else {
      this.dateRange = '';
    }
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
    console.log("param::",param)
    this.productSubscription = this.api
      .post('product-node/get-all-product-store', param)
      .subscribe(
        (data: any) => {
          console.log('data:: ', data);
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

  getProductImage(prod: any) {
    let data: any = JSON.parse(prod.images);
    return data.length ? data[0].src : false;
  }

  confirmDelete(prod: any) {
    this.ngxService.start();
    this.customerSubscription = this.api
      .post(
        'product-node/delete-shopify-product/' + prod.store_id + '/' + prod.id,
        {}
      )
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            this.ngxService.stop();
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.getProducts();
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
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
    this.getProducts();
  }

  dateRangeChanges() {
    console.log('daterange:: ', this.dateRange);

    let mObject = moment().subtract(
      0,
      this.dateRange == 'week'
        ? 'weeks'
        : this.dateRange == 'month'
        ? 'months'
        : this.dateRange == 'year'
        ? 'years'
        : 'year'
    );
    let startDate = mObject.startOf(this.dateRange).format('YYYY-MM-DD');
    let endDate = mObject.endOf(this.dateRange).format('YYYY-MM-DD');
    console.log('startDate:: ', startDate);
    console.log('endDate:: ', endDate);

    this.filterDate = [new Date(startDate), new Date(endDate)];
    this.getProducts();
  }
}
