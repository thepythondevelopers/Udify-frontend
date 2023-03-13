import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PaymentComponent } from 'src/app/shared/payment/payment.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-knowledgebase',
  templateUrl: './knowledgebase.component.html',
  styleUrls: ['./knowledgebase.component.css'],
})
export class KnowledgebaseComponent implements OnInit {
  knowledge: any = [];
  page: any = 1;
  total: any = 0;
  knowledgeSub: any;
  constructor(
    public api: ApiService,
    private modal: NzModalService,
    private authS: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.getknowledges();
  }

  getknowledges() {
    this.ngxService.start();
    this.api.post('knowledgebase-node/get-base', {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.length) {
          console.log('data:: ', data);
          this.knowledge = data;
        } else {
          this.knowledge = [];
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.knowledge = [];
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  confirmDelete(know: any) {
    this.ngxService.start();
    this.knowledgeSub = this.api
      .post('knowledgebase-node/destroy-base/' + know._id, {})
      .subscribe(
        (data: any) => {
          this.ngxService.stop();
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.getknowledges();
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
  }
}
