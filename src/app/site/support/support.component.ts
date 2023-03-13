import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from 'src/app/services/model.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddTicketComponent } from '../add-ticket/add-ticket.component';
import { AuthService } from 'src/app/auth/auth.service';
import { CmsService } from 'src/app/admin/services/cms.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
})
export class SupportComponent implements OnInit {
  tickets: any = [];
  knowledge: any = [];
  constructor(
    public api: ApiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public modelS: ModelService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private modal: NzModalService,
    public cmsService: CmsService
  ) {}

  ngOnInit(): void {
    this.getSectionsData();
    this.getknowledges();
    // if(this.auth.getAuthStatus()) {
    //   this.ngxService.start();
    //   this.getTickets();
    // } else {
    //   this.api.showToast('info', 'Please login to check your support tickets.');
    // }
  }

  getknowledges() {
    // this.ngxService.start();
    // this.api.post('knowledgebase-node/get-base/'+this.id, {}).subscribe(
    this.api.post('knowledgebase-node/get-base', {}).subscribe(
      // this.api.post('get-base', {}).subscribe(
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

  getSectionsData() {
    this.api.post('cms-node/get-cms-page/support', {}).subscribe((data: any) => {
      if (data && data.hasOwnProperty('error')) {
        this.api.showToast('error', data.error);
        return false;
      } 
      if (data && data.data) {
        this.cmsService.support = JSON.parse(data.data);
      }
    });
  }

  getTickets() {
    this.api.post('support-node/get-all-ticket', {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.length) {
          console.log('data:: ', data);
          this.tickets = data;
        } else {
          this.tickets = [];
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.tickets = [];
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  addSupportTicket() {
    // let modal = this.modal.create({
    //   // nzTitle: 'Modal Title',
    //   nzContent: AddTicketComponent,
    //   nzClosable: false,
    //   nzFooter: null,
    //   // nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000))
    // });
    // modal.afterClose.subscribe(() => {
    //   this.getTickets();
    // });
    this.router.navigate(['/support/ticket'], { queryParams: { type: 'add' }, queryParamsHandling: 'merge' });
  }

  viewSupportTicket(){
    this.router.navigate(['/support/tickets'], { queryParams: { type: 'view' }, queryParamsHandling: 'merge' });
  }

  openTicket(ticket: any) {}
}
