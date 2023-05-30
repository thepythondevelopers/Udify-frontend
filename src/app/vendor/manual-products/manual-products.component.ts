import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { ModelService } from 'src/app/services/model.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CartService } from 'src/app/services/cart.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manual-products',
  templateUrl: './manual-products.component.html',
  styleUrls: ['./manual-products.component.css'],
})
export class ManualProductsComponent implements OnInit {
  
  @ViewChild('csv_inpt')
  csv_inpt_Variable: ElementRef;

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
  fileurl: string;
  constructor(
    public api: ApiService,
    private eventS: EventService,
    public modelS: ModelService,
    private ngxService: NgxUiLoaderService,
    private cart: CartService,
    private changeRef: ChangeDetectorRef,
    private modal: NzModalService
  ) {
    this.fileurl=environment.fileurl;
    this.storeSub = this.eventS.getChangedStore().subscribe(() => {
      this.ngxService.start();
      this.page = 1;
      this.total = 0;
      this.getManualProducts();
    });
  }

  ngOnInit(): void {
    // if (this.modelS.selectedStore.length) {
      this.ngxService.start();
      this.page = 1;
      this.total = 0;
      this.getManualProducts();
    // }
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  getManualProducts() {
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
    }
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
    this.productSubscription = this.api
      .post('vendor-product-node/get-all-product', param)
      .subscribe(
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

  removeProduct(prod) {
    this.modal.create({
      nzTitle: 'Are you sure?',
      nzContent: 'You want to remove this product from your catalog?',
      nzClosable: false,
      nzOkText: 'Yes',
      nzOnOk: () =>
        new Promise((resolve) => {
          this.confirmDelete(prod);
        }),
    });
  }

  getProductImage(prod: any) {
    if(prod.hasOwnProperty('images')) {
      let data: any = (prod.images);
      this.changeRef.detectChanges();
      return data.length ? data[0] : false;
    } else {
      this.changeRef.detectChanges();
      return false;
    }
    // return data.length ? data.replace('[', '').replace(']', '') : false;
  }

  confirmDelete(prod: any) {
    console.log("store_id::",prod.store_id);
    console.log("prod id::",prod.id);
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
            this.getManualProducts();
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
    this.getManualProducts();
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
    this.getManualProducts();
  }

  addProductToCatalog(prod) {
    this.cart.add(prod).then((res: any) => {
      this.api.showToast(res.status, res.message);
    });
  }

  csvFile: any;
  selectedCSV(files: FileList) {
    console.log('csvFile:: ', this.csvFile, files.item(0));
    this.csvFile = files.item(0);
  }

  uploadCSV() {
    console.log('csvFile:: ', this.csvFile);
    if (this.csvFile) {
      const formData = new FormData();
      formData.append('file', this.csvFile, this.csvFile.name);
      this.api
        .post('vendor-product-node/csv-product', formData)
        .subscribe(async (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.csvFile = null;
            console.log("native element::",this.csv_inpt_Variable.nativeElement.value);
            this.csv_inpt_Variable.nativeElement.value = null;
            console.log("native element::",this.csv_inpt_Variable.nativeElement.value);
            // if (this.api.isManualProducts) {
              this.page = 1;
              this.total = 0;
              this.getManualProducts();
            // }
            this.api.showToast('success', data.message);
          }
          this.ngxService.stop();
        });
    }
  }

  sample(){

  }

  checkManualProducts() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
    this.total = 0;
    this.page = 1;
    this.products = [];
    this.getManualProducts();
  }
}
