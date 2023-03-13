import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from 'src/app/services/model.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/auth/auth.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ForgotComponent } from '../forgot/forgot.component';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit {
  id: any = '';
  type: any = 'view';
  reply: any = '';
  ticket: any = { reply: [] };
  user: any = {};
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  ticketId: any = '';
  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public modelS: ModelService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private auth: AuthService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('type')) {
        this.type = params.type;
        // this.getTicket();
        console.log('Route:: ', this.id);
      }

      if (params && params.hasOwnProperty('id')) {
        // this.id = params.id;
        // this.getTicket();
        console.log('Route:: ', this.id);
      }
    });
    // this.user = this.auth.getAuthUser();
    // console.log('Current user', this.user);
  }

  getTicket() {
    this.ngxService.start();
    this.api.post('support-node/get-ticket/' + this.ticketId, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.ticket && data.ticket._id) {
          console.log('data:: ', data);
          this.id = this.ticketId;
          this.ticket = data.ticket;
          if (!this.ticket.hasOwnProperty('reply')) {
            this.ticket.reply = data.reply;
          }
        } else {
          this.ticket = {};
        }
        // setTimeout(() => {
        //   this.scrollToBottom();
        // }, 500);
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.ticket = {};
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  saveReply() {
    this.api
      .post('support-node/reply-support-ticket-user/' + this.id, {
        message: this.reply,
        // parent_id: this.id,
      })
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.reply = '';
            this.getTicket();
          }
          // setTimeout(() => {
          //   this.scrollToBottom();
          // }, 500);
          this.ngxService.stop();
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  viewTicket() {
    if (this.ticketId.length) {
      // this.router.navigate(['/support/tickets'], { queryParams: { id: this.ticketId, type: 'view' }, queryParamsHandling: 'merge' });
      this.getTicket();
    } else {
      this.api.showToast('error', 'Please enter ticket tracking ID');
    }
  }

  forgotTracking() {
    let modal = this.modal.create({
      // nzTitle: 'Modal Title',
      nzContent: ForgotComponent,
      nzClosable: false,
      nzFooter: null,
      // nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000))
    });
    modal.afterClose.subscribe(() => {});
  }

  getFile(file: any) {
    return JSON.parse(file)[0];
  }

  markAsResolved() {
    this.api
      .post('support-node/ticket-status-change/' + this.id, {
        status: 'Resolved',
      })
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.reply = '';
            this.getTicket();
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

  getLastReplier() {
    if (this.ticket.reply.length) {
      this.ticket.reply[this.ticket.reply.length - 1].hasOwnProperty('user_id')
        ? 'Udify'
        : this.ticket.name;
    } else {
      return this.ticket.name;
    }
  }
}
