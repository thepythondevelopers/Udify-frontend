import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css','./notifications.component.css','../../../assets/css/bootstrap.min.css']
})
export class NotificationsComponent implements OnInit {

  notf: any=[];
  vendor: any;
  customer: any = {};

  constructor(
    public api: ApiService,
    private modal: NzModalService,
    private ngxService: NgxUiLoaderService,
  ) { 
    this.notification();
  }

  ngOnInit(): void {
  }

  delete_notf(notf_id:any){
    console.log("notf_id",notf_id);
    this.api.post('aware-node/delete-notification', {"email":JSON.parse(localStorage.getItem('user')).email,"notf_id":notf_id}).subscribe(
      async (data: any) => {
        if(data){
          this.api.showToast('success', data.msg);
          this.notification();
        }
        else{
          this.api.showToast('error', 'Invalid request');
        }
      }
    )
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

  notification(){
      this.api.get('aware-node/get-notification', {}).subscribe(
        async (data: any) => {
          if(data){
            this.notf = data.notification.reverse();
          }
        }
      )
  }


}
