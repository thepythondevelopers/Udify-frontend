import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ChatComponent } from '../chat/chat.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css','../../../assets/css/bootstrap.min.css']
})
export class NotificationsComponent implements OnInit {
  notf: any=[];
  vendor: any;

  totalntf:Number;
  page:Number=1;

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

  notification(){
      this.api.get('aware-node/get-notification', {}).subscribe(
        async (data: any) => {
          if(data){
            this.notf = data.notification.reverse();
            this.totalntf = this.notf.length;
          }
        }
      )
  }

}
