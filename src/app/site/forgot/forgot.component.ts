import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
})
export class ForgotComponent implements OnInit {
  email: any = '';
  ticket: any = 'open';
  constructor(
    public api: ApiService,
    private modal: NzModalService,
    private ngxService: NgxUiLoaderService,

  ) {}

  ngOnInit(): void {}

  sendTracking() {
    if(this.email.length) {
      if(this.validateEmail()) {
        this.ngxService.start();
        let url: any = 'support-node/forgot-ticket-id'; 
        let params: any={
          email: this.email,
          status: this.ticket
        }
        this.api.post(url, params).subscribe(
          (data: any) => {
            this.ngxService.stop();
            if (data.hasOwnProperty('error')) {
              this.api.showToast('error', data.error);
              return false;
            }
            if (data && data.message) {
              this.api.showToast('success', data.message);
              // this.api.showToast('success', 'An email with details about your tickets has been sent to your address.');
              this.modal.closeAll();
            }
          },
          (err) => {
            this.ngxService.stop();
            console.log('Login err:: ', err);
            this.api.showToast('error', err.error.error);
          }
        );

      } else {
      this.api.showToast('error', 'Please enter valid email');
    };
    } else {
      this.api.showToast('error', 'Please enter your email');
    }
  }

  validateEmail = () => {
    return this.email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
}
