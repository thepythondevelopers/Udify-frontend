import { Component, OnDestroy, OnInit,Input,ViewChild,ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { ModelService } from 'src/app/services/model.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ChatComponent } from '../chat/chat.component';
import { PaynowService } from 'src/app/paynow.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { PaymentComponent } from 'src/app/shared/payment/payment.component';
import { Router } from '@angular/router';
import { ChargeComponent } from 'src/app/shared/charge/charge.component';

declare var Stripe: any;
declare var $: any;
declare var CardJs: any;

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  orders: any = [];
  searchtext: any = '';

  stripe: any;

  vendor: any = {};

  orderSubscription: any;
  dateFormat = 'yyyy-MM-dd';
  filterDate: any = '';

  total: any = 0;
  page: any = 1;
  storeSub: any;
  dateRange: any = '';
  suppliers: any=[];
  suppliers_id: any=[];
  status: any=[];
  publishable_keys: any=[];
  id: any;
  images: any=[];
  pt: any;
  user_id: any;

  constructor(
    private modal: NzModalService,
    public api: ApiService,
    private eventS: EventService,
    public modelS: ModelService,
    private ngxService: NgxUiLoaderService,
    private pn : PaynowService,
    private authS: AuthService,
    private router: Router,
  ) {
    this.user_id = JSON.parse(localStorage.getItem("user"))._id;
    // this.storeSub = this.eventS.getChangedStore().subscribe(() => {
    //   this.getOrders();
    // });
  }

  handler:any = null;

  ngOnInit(): void {
    // if (this.modelS.selectedStore.length) {
    // }
    this.getOrders();
  }

  ngOnDestroy(): void {
    // if (this.storeSub) {
    //   this.storeSub.unsubscribe();
    // }
  }

  pay_check(amount: any,supplier_id: any,publishable_key: any,shopify_order_id:any,customer_id:any){
    this.api.get('stripe-node/supplier-stripe-secret-key/'+supplier_id,{}).subscribe((data)=>{
      var charge = {"amount":amount,"supplier_id":supplier_id,"publishable_key":publishable_key,"secret_key":Object.entries(data)[0][1],"shopify_order_id":shopify_order_id,"customer_id":customer_id}
    let token = this.authS.getAuthToken();
    // this.user = this.authS.getAuthUser();
    let headr: any = {};
    if (token.length) {
      const modal = this.modal.create({
        nzTitle: 'Payment to the Supplier',
        nzContent: ChargeComponent,
        nzComponentParams: { charge },
        nzFooter: null
      });
      if(modal){
        console.log("value from modal::",modal);
      }
    } else {
      this.api.showToast('info', 'You must login to purchase the plan.');
      this.router.navigateByUrl('/signin');
    }
    // modal.open()
    })
  }

  getVendor(id:any) {
    this.api.post('user-vendor-node/user-vendor/' + id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && Object.keys(data).length) {
          console.log('Customer data:: ', data);
          this.vendor = data.hasOwnProperty('_id') ? data : data.data;
          console.log("ven::",this.vendor);
          this.chat();
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
    } else {
      this.dateRange = '';
    }
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    this.orderSubscription = this.api
      .post('order-node/catalog-user-order-list', param)
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.docs) {
            console.log('orders data:: ', data.docs);
            if(data.docs){
              for(let j=0;j<data.docs.length;j++){
                console.log("shopify order id::",data.docs[j].shopify_order_id)
                this.api.post('order-node/get-order-payment',{"shopify_order_id":data.docs[j].shopify_order_id,"customer_id":data.docs[j].user}).subscribe(
                  (op_data:any)=>{
                    if(op_data){
                      console.log("order payment status::",op_data.status)
                    this.status[j] = op_data.status;
                    }
                  }
                )
              }
              console.log("order staus array::",this.status);
            }
            for(let i=0;i<data.docs.length;i++){
              let shopify_order_id=data.docs[i].shopify_order_id;
              let prd_id=data.docs[i].line_items[0].product_id;
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
              this.api.post('order-node/catalog-order-supplier',{"shopify_order_id":shopify_order_id})
              .subscribe(
                (data2 :any)=>{
                  if(data2){
                    
                    this.suppliers_id[i]=data2[0].supplier_id
                    this.api.get('stripe-node/supplier-stripe-secret-key/'+this.suppliers_id[i],{})
                    .subscribe(
                      (data4 :any)=>{
                        this.publishable_keys[i]=data4.stripe_publishable_key;
                        console.log("publishable key::",this.publishable_keys[i]);
                      }
                    )
                    this.api.post('order-node/catalog-order-supplier-name',{"supplier_id":data2[0].supplier_id})
                  .subscribe(
                    (data3 :any)=>{
                      if(data3){
                        this.suppliers[i] = data3.supplier_name;
                      }
                    }
                  )
                  }
                }
              )
            }
            console.log("supplier ids::",this.suppliers);
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
            this.getOrders();
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
    this.getOrders();
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
    this.getOrders();
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
