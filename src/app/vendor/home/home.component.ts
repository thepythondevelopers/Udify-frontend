import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/auth/auth.service';
import { ModelService } from 'src/app/services/model.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hasIntegrations: boolean = false;
  confirmModal?: NzModalRef;

  storeSub: any;
  constructor(
    public api: ApiService,
    private router: Router,
    private modal: NzModalService,
    private auth: AuthService,
    public modelS: ModelService,
    private eventS: EventService,
  ) {
    this.storeSub = this.eventS.getChangedStore().subscribe(() => {
      this.getShopifyConnectivity();
    });
  }

  ngOnInit(): void {
    this.getShopifyConnectivity();
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  getShopifyConnectivity() {
    // this.api.get('integration-node/get-integration-all', {}).subscribe((data: any) => {
    //   if(data && data.hasOwnProperty('integrations') && data.integrations.length) {
    //     console.log('data:: ', data);
    //     this.hasIntegrations = true;
    //   } else {
    //     this.hasIntegrations = false;
    //   }
    // },
    // (err) => {
    //   console.log('Login err:: ', err);
    //   this.api.showToast('error', err.error.error);
    // });

    let stores: any = this.modelS.allStores;
    console.log('123stores:: ', stores);
    if (stores.length) {
      this.hasIntegrations = true;
    } else {
      this.hasIntegrations = false;
    }
  }

  async connectToShopify() {
    let user: any = await this.auth.getAuthUser();
    console.log(this.hasIntegrations, 'User:: ', user);
    if (this.hasIntegrations) {
      this.router.navigate(['/vendor/connect-to-shopify']);
    } else {
      console.log('USER:: ', user);
      if (user.plan_status == 'trial') {
        this.goToPlan();
      } else {
        this.router.navigate(['/vendor/connect-to-shopify']);
      }
    }
  }

  goToPlan() {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Alert!',
      nzContent:
        'You need to purchase the plan first to connect the shopify account.',
      nzOkText: 'Go to plan',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.router.navigate(['/plan/purchase']),
    });
  }
}

