import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PaymentComponent } from 'src/app/shared/payment/payment.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
})
export class SupportComponent implements OnInit {
  supports: any = [];
  page: any = 1;
  total: any = 0;
  supportSub: any;
  constructor(
    public api: ApiService,
    private modal: NzModalService,
    private authS: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.getPlans();
  }

  getPlans() {
    this.ngxService.start();
    this.api.post('support-node/get-all-ticket-admin', {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.length) {
          console.log('data:: ', data);
          this.supports = data;
        } else {
          this.supports = [];
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.supports = [];
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  paginate(e) {
    
  }
}
