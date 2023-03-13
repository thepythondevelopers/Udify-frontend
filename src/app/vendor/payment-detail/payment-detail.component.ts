import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { ModelService } from 'src/app/services/model.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {

  orders: any = [];
  status: any = [];
  cust_name: any = [];
  images: any=[];
  searchtext: any = '';

  orderSubscription: any;
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
    // this.storeSub = this.eventS.getChangedStore().subscribe(() => {
    //   if (this.api.isUserOrders) {
    //     this.getUserOrders();
    //   } else {
    //     this.getOrders();
    //   }
    // });
  }

  ngOnInit(): void {
    // if (this.modelS.selectedStore.length) {
    this.total = 0;
    this.page = 1;
    // if (this.api.isUserOrders) {
    //   this.getUserOrders();
    // } else {
    //   this.getOrders();
    // }
    // }
    this.getUserOrders();
  }

  checkUserOrder() {
    console.log('isUserOrders:: ', this.api.isUserOrders);
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    this.total = 0;
    this.page = 1;
    // if (this.api.isUserOrders) {
    //   this.getUserOrders();
    // } else {
    //   this.getOrders();
    // }
    this.getUserOrders();
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  getOrders() {
    this.ngxService.start();
    console.log('filterDate:: ', this.filterDate);
    let param: any = {
      // store_id: this.modelS.selectedStore,
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
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    this.orderSubscription = this.api
      .post(`vendor-order-node/get-all-order-store`, param)
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.docs.length) {
            console.log('orders data:: ', data);
            // this.orders = data.data;
            // this.total = Math.ceil(parseInt(data.data.count) / 10);
            this.total = parseInt(data.totalDocs);
            this.orders = data.docs;
          } else {
            this.orders = [];
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

  getUserOrders() {
    this.ngxService.start();
    console.log('filterDate:: ', this.filterDate);
    let param: any = {
      // store_id: this.modelS.selectedStore,
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
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    console.log("param::",param);
    this.orderSubscription = this.api
      .post(`vendor-order-node/get-user-order`, param)
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data.length && data[0].data.length) {
            if(data[0].data){
              for(let i=0;i<data[0].data.length;i++){
                console.log("shopify order id::",data[0].data[i].shopify_order_id)
                this.api.post('order-node/get-order-payment',{"shopify_order_id":data[0].data[i].shopify_order_id,"customer_id":data[0].data[i].user}).subscribe(
                  (op_data:any)=>{
                    if(op_data){
                      console.log("order payment status::",op_data.status)
                    this.status[i] = op_data.status;
                    }
                  }
                )
                let prd_id=data[0].data[i].line_items[0].product_id;
                this.api.get('product-node/get-single-shopify/' + prd_id, {}).subscribe(
                  (prd_data: any) => {
                    console.log("prd image::",JSON.parse(prd_data.data[0].images));
                    if(JSON.parse(prd_data.data[0].images).length>0){
                      this.images[i] = JSON.parse(prd_data.data[0].images)[0].src;
                    }
                    else{
                      this.images[i] = "";
                    }
                    console.log("images array::",this.images);
                  }
                );
                this.api.post("order-node/catalog-order-customer-name",{"customer_id":data[0].data[i].user}).subscribe(
                  (cust_data:any)=>{
                    if(cust_data){
                      console.log("customer name::",cust_data.customer_name)
                      this.cust_name[i] = cust_data.customer_name;
                    }
                  }
                )
              }
              console.log("order staus array::",this.status);
            }
            console.log('orders data:: ', data);
            // this.orders = data.data;
            // this.total = Math.ceil(parseInt(data.data.count) / 10);
            this.total = parseInt(data[0].metadata[0].total);
            this.orders = data[0].data;
          } else {
            this.orders = [];
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
    this.orderSubscription = this.api
      .post(
        'customer-node/delete-shopify-customer/' +
          cust.store_id +
          '/' +
          cust.shopify_id,
        {}
      )
      .subscribe(
        (data: any) => {
          this.ngxService.stop();
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            if (this.api.isUserOrders) {
              this.getUserOrders();
            } else {
              this.getOrders();
            }
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
  }

  paginate(event) {
    console.log('Event:: ', event);
    this.page = event;
    // if (this.api.isUserOrders) {
    //   this.getUserOrders();
    // } else {
    //   this.getOrders();
    // }
    this.getUserOrders();
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
    // if (this.api.isUserOrders) {
    //   this.getUserOrders();
    // } else {
    //   this.getOrders();
    // }
    this.getUserOrders();
  }
}
