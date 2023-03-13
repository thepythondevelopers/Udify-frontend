import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { ModelService } from 'src/app/services/model.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css'],
})
export class VendorsComponent implements OnInit {
  vendors: any = [];
  searchtext: any = '';

  vendorrSubscription: any;
  dateFormat = 'yyyy-MM-dd';
  filterDate: any = '';

  total: any = 0;
  page: any = 1;

  storeSub: any;
  dateRange: any = '';

  constructor(
    public api: ApiService,
    private eventS: EventService,
    private modelS: ModelService,
    private ngxService: NgxUiLoaderService
  ) {
    this.storeSub = this.eventS.getChangedStore().subscribe(() => {
      this.ngxService.start();
      this.getVendors();
    });
  }

  ngOnInit(): void {
    if (this.modelS.selectedStore.length) {
      this.ngxService.start();
      this.getVendors();
    }
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  getVendors() {
    console.log('filterDate:: ', this.filterDate);
    let param: any = {
      store_id: this.modelS.selectedStore,
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
    }
    if (this.vendorrSubscription) {
      this.vendorrSubscription.unsubscribe();
    }
    this.vendorrSubscription = this.api
      .post('user-vendor-node/get-user-favourite-vendor', param)
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.length) {
            console.log('data:: ', data);
            // this.total = Math.ceil(parseInt(data.data.count) / 10);
            // this.total = parseInt(data.totalDocs);
            this.vendors = data;
          } else {
            this.vendors = [];
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

  confirmDelete(cust: any) {
    this.ngxService.start();
    this.vendorrSubscription = this.api
      .post('user-vendor-node/remove-vendor-favourite/' + cust._id, {})
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.ngxService.stop();
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.getVendors();
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
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
    this.ngxService.start();
    this.getVendors();
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
    this.ngxService.start();
    this.getVendors();
  }
}
