import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PaymentComponent } from 'src/app/shared/payment/payment.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsService } from 'src/app/admin/services/cms.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css'],
})
export class PlansComponent implements OnInit {
  pricingTab: any = 'basic';
  panels = [
    {
      active: false,
      name: '1. Do I need to install an app in Shopify?',
      description:
        "Anim pariatur cliche reprehenderit, enim eiusmod high lifeaccusamus terry richardson ad squid. 3 wolf moon officia aute,non cupidatat skateboard dolor brunch. Food truck quinoanesciunt laborum eiusmod. Brunch 3 wolf moon tempor, suntaliqua put a bird on it squid single-origin coffee nullaassumenda shoreditch et. Nihil anim keffiyeh helvetica, craftbeer labore wes anderson cred nesciunt sapiente ea proident.Ad vegan excepteur butcher vice lomo. Leggings occaecat craftbeer farm-to-table, raw denim aesthetic synth nesciunt youprobably haven't heard of them accusamus labore sustainableVHS.",
      disabled: false,
    },
    {
      active: false,
      disabled: false,
      name: '1. Do I need to install an app in Shopify?',
      description:
        "Anim pariatur cliche reprehenderit, enim eiusmod high lifeaccusamus terry richardson ad squid. 3 wolf moon officia aute,non cupidatat skateboard dolor brunch. Food truck quinoanesciunt laborum eiusmod. Brunch 3 wolf moon tempor, suntaliqua put a bird on it squid single-origin coffee nullaassumenda shoreditch et. Nihil anim keffiyeh helvetica, craftbeer labore wes anderson cred nesciunt sapiente ea proident.Ad vegan excepteur butcher vice lomo. Leggings occaecat craftbeer farm-to-table, raw denim aesthetic synth nesciunt youprobably haven't heard of them accusamus labore sustainableVHS.",
    },
    {
      active: false,
      disabled: false,
      name: '1. Do I need to install an app in Shopify?',
      description:
        "Anim pariatur cliche reprehenderit, enim eiusmod high lifeaccusamus terry richardson ad squid. 3 wolf moon officia aute,non cupidatat skateboard dolor brunch. Food truck quinoanesciunt laborum eiusmod. Brunch 3 wolf moon tempor, suntaliqua put a bird on it squid single-origin coffee nullaassumenda shoreditch et. Nihil anim keffiyeh helvetica, craftbeer labore wes anderson cred nesciunt sapiente ea proident.Ad vegan excepteur butcher vice lomo. Leggings occaecat craftbeer farm-to-table, raw denim aesthetic synth nesciunt youprobably haven't heard of them accusamus labore sustainableVHS.",
    },
  ];
  plans: any = [];
  planPurchase: boolean = false;
  constructor(
    public api: ApiService,
    private modal: NzModalService,
    private authS: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public cmsService: CmsService
  ) {
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('type')) {
        this.planPurchase = true;
      }
    });
  }

  ngOnInit(): void {
    this.getSectionsData();
    this.getPlans();
  }

  getSectionsData() {
    this.api.post('cms-node/get-cms-page/pricingPlans', {}).subscribe((data: any) => {
      if(data){
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        } 
        if (data.data) {
          this.cmsService.pricingPlans = JSON.parse(data.data);
        }
      }
    });
  }

  getPlans() {
    this.api.post('stripe-node/get-plan', {}).subscribe(
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
      },
      (err) => {
        this.plans = [];
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  purchasePlan(plan: any) {
    console.log("plan purchased::",plan);
    let token = this.authS.getAuthToken();
    // this.user = this.authS.getAuthUser();
    let headr: any = {};
    if (token.length) {
      console.log('Plan:: ', plan);
      plan.purchase = this.planPurchase;
      const modal = this.modal.create({
        nzTitle: 'Payment',
        nzContent: PaymentComponent,
        nzComponentParams: { plan },
        nzFooter: null
      });
    } else {
      this.api.showToast('info', 'You must login to purchase the plan.');
      this.router.navigateByUrl('/signin');
    }
    // modal.open()
  }
}
