import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { ModelService } from 'src/app/services/model.service';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-catalog-order',
  templateUrl: './catalog-order.component.html',
  styleUrls: ['./catalog-order.component.css']
})
export class CatalogOrderComponent implements OnInit {
  orders: any = [];
  status: any = [];
  searchtext: any = '';
  
  orderSubscription: any;
  dateFormat = 'yyyy-MM-dd';
  filterDate: any = '';

  total: any = 0;
  page: any = 1;
  storeSub: any;
  dateRange: any = '';
  confirm_cancel: boolean=false;
  customers: any=[];
  images: any=[];
  customer: any = {};
  customers_id: any=[];
  customer_email: any=[];
  cust_email: any="";
  shopify_order_id: any="";

  constructor(
    public api: ApiService,
    private eventS: EventService,
    private modelS: ModelService,
    private ngxService: NgxUiLoaderService,
    private modal: NzModalService
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

  chat() {
    console.log("customer data::",this.customer);
    let modal = this.modal.create({
      nzTitle: '',
      nzContent: ChatComponent,
      nzComponentParams: { customer :this.customer },
      nzClosable: false,
      nzClassName: 'custom_nzmodal chat_nzmodal',
      nzFooter: null,
      nzCloseIcon: null,
      nzOnOk: () => new Promise((resolve) => {}),
    });
  }

  request_payment(cust_email:any,shopify_order_id : any){
    let msg = "A request for payment has been asked by the supplier, name : "+JSON.parse(localStorage.getItem('user')).first_name+" "+JSON.parse(localStorage.getItem('user')).last_name+", Supplier Email : "+JSON.parse(localStorage.getItem('user')).email;
    console.log("customer email::",cust_email," msg::",msg)
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var date = dd+"-"+mm+"-"+yyyy;
    console.log("date::",date);
    this.api.post('aware-node/send-notification',{"email":cust_email,"msg":[{
      "body":"A request for payment has been asked by the supplier for shopify order id "+shopify_order_id,
      "send_by" : JSON.parse(localStorage.getItem('user')).first_name+" "+JSON.parse(localStorage.getItem('user')).last_name,
      "email" : JSON.parse(localStorage.getItem('user')).email,
      "date" : dd+"-"+mm+"-"+yyyy,
      "notf_id" : Math.random()
    }]}).subscribe(
      (notification:any)=>{
        if(notification){
          console.log("notification::",notification);
          this.api.showToast('success', "A request for payment has been sent to the customer");
        }
      }
    )
  }

  order_cancelled(cust_email:any,shopify_order_id:any){
    this.cust_email=cust_email;
    this.shopify_order_id=shopify_order_id;
    this.confirm_cancel=true;
  }

  handleCancel(){
    this.confirm_cancel=false;
  }

  cancel_order(){
    this.confirm_cancel=false;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var date = dd+"-"+mm+"-"+yyyy;
    console.log("date::",date);
    console.log("customer email::",this.cust_email);
    this.api.post('aware-node/send-notification',{"email":this.cust_email,"msg":[{
      "body":"Your order has been cancelled by the supplier, shopify order id : "+this.shopify_order_id,
      "send_by" : JSON.parse(localStorage.getItem('user')).first_name+" "+JSON.parse(localStorage.getItem('user')).last_name,
      "email" : JSON.parse(localStorage.getItem('user')).email,
      "date" : dd+"-"+mm+"-"+yyyy,
      "notf_id" : Math.random()
    }]}).subscribe(
      (notification:any)=>{
        if(notification){
          console.log("notification::",notification);
          this.api.showToast('success', "Order cancelled, the customer is informed");
        }
      }
    )
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
            console.log("orders data::",this.orders);
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
            console.log('orders data:: ', data[0].data);
            for(let i=0;i<data[0].data.length;i++){
              this.api.post('order-node/get-order-payment',{"shopify_order_id":data[0].data[i].shopify_order_id,"customer_id":data[0].data[i].user}).subscribe(
                (op_data:any)=>{
                  if(op_data){
                    console.log("order payment status::",op_data.status)
                  this.status[i] = op_data.status;
                  }
                }
              )
              console.log("user::",data[0].data[i].user)
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
              if(data[0].data[i].user){
                this.api.post('order-node/catalog-order-customer-name-email',{"customer_id":data[0].data[i].user})
                .subscribe(
                  (data3 :any)=>{
                    if(data3){
                      this.customers_id[i] = data[0].data[i].user;
                      this.customers[i] = data3.customer_name;
                      this.customer_email[i] = data3.email;
                    }
                  }
                )
              }
            }
            console.log("customer names::",this.customers);
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

  getCustomer(id:any) {
    console.log("customer id::",id);
    this.api.post('vendor-customer-node/get-user-customer/' + id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && Object.keys(data).length) {
          console.log('Customer data:: ', data);
          this.customer = data.hasOwnProperty('_id') ? data : data[0];
          console.log("this.customer::",this.customer)
          this.chat();
        } else {
          this.customer = {};
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.customer = {};
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
