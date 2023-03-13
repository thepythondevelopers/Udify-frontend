import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PaymentComponent } from 'src/app/shared/payment/payment.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css'],
})
export class PlansComponent implements OnInit {
  plans: any = [];
  page: any = 1;
  total: any = 0;
  planSub: any;
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
    this.api.post('stripe-node/get-plan-admin', {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.length) {
          console.log('data:: ', data);
          this.plans = data;
        } else {
          this.plans = [];
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.plans = [];
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }
  confirmDelete(plan) {}

  paginate($event) {}

  
  planStatusChange(plan, event) {
    console.log(plan, event);
    this.ngxService.start();
    let url: any = event
      ? 'stripe-node/active-plan/' + plan.app_id
      : 'stripe-node/inactive-plan/' + plan.app_id;
    this.planSub = this.api.post(url, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        this.api.showToast(
          'success',
          `Plan successfully ${event ? 'enabled' : 'disabled'}.`
        );

        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        plan.status = !plan.status;
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }
}
