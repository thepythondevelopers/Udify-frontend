import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { ModelService } from 'src/app/services/model.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  customers: any = [];
  searchtext: any = '';

  customerSubscription: any;
  dateFormat = 'yyyy-MM-dd';
  filterDate: any = '';

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
    // this.storeSub = this.eventS.getChangedStore().subscribe(() => {
    //   this.getCustomers();
    // });
  }

  ngOnInit(): void {
    // if (this.modelS.selectedStore.length) {
    //   this.getCustomers();
    // }
    this.getCustomers();
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  getCustomers() {
    this.ngxService.start();
    console.log('filterDate:: ', this.filterDate);
    let param: any = {
      // store_id: this.modelS.selectedStore,
      page: this.page,
    };
    if (this.searchtext.length) {
      param.search_string = this.searchtext;
    }
    if (this.filterDate.length) {
      param.startedDate = moment(new Date(this.filterDate[0])).format(
        'YYYY-MM-DD'
      );
      param.endDate = moment(new Date(this.filterDate[1])).format('YYYY-MM-DD');
    } else {
      this.dateRange = '';
    }
    if (this.customerSubscription) {
      this.customerSubscription.unsubscribe();
    }
    this.customerSubscription = this.api
      .post('vendor-customer-node/get-customer', param)
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.docs) {
            console.log('data:: ', data);
            // this.total = Math.ceil(parseInt(data.data.count) / 10);
            this.total = parseInt(data.totalDocs);
            this.customers = data.docs;
          } else {
            this.customers = [];
          }
          this.ngxService.stop();
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
  }

  getCustomerImage(cust: any) {
    let data: any = JSON.parse(cust.images);
    return data[0].src;
  }

  confirmBlock(cust: any) {
    // this.ngxService.start();
    // this.customerSubscription = this.api
    //   .post(
    //     'customer-node/delete-shopify-customer/' +
    //       cust.store_id +
    //       '/' +
    //       cust.shopify_id,
    //     {}
    //   )
    //   .subscribe(
    //     (data: any) => {
    //       this.ngxService.stop();
    //       if (data.hasOwnProperty('error')) {
    //         this.api.showToast('error', data.error);
    //         return false;
    //       }
    //       if (data && data.message) {
    //         this.api.showToast('success', data.message);
    //         this.getCustomers();
    //       }
    //     },
    //     (err) => {
    //       this.ngxService.stop();
    //       console.log('Login err:: ', err);
    //       this.api.showToast('error', err.error.error);
    //     }
    //   );
  }

  getStoreName(cust: any) {
    let data: any = this.modelS.allStores.find(
      (x) => x.store_id == cust.store_id
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
    this.getCustomers();
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
    this.getCustomers();
  }
}
