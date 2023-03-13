import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PaymentComponent } from 'src/app/shared/payment/payment.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit, AfterViewChecked {
  id: any = '';
  ticket: any = { reply: [] };
  reply: any = '';
  user: any = {};
  status: any = 'New';
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(
    public api: ApiService,
    private modal: NzModalService,
    private authS: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('id')) {
        this.id = params.id;
        this.getTicket();
        console.log('Route:: ', this.id);
      }
    });
    this.user = this.auth.getAuthUser();
    console.log('Current user', this.user);
  }

  scrolled: boolean = false;
  ngAfterViewChecked() {
    // if(!this.scrolled) {
    //   this.scrollToBottom();
    //   this.scrolled = true;
    // }
  }

  getTicket() {
    this.ngxService.start();
    this.api.post('support-node/get-ticket/' + this.id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.ticket && data.ticket._id) {
          console.log('data:: ', data);
          this.ticket = data.ticket;
          if (!this.ticket.hasOwnProperty('reply')) {
            this.ticket.reply = data.reply;
          }
          this.status = data.ticket.status;
        } else {
          this.ticket = {};
        }
        this.ngxService.stop();
        setTimeout(() => {
          this.scrollToBottom();
        }, 500);
      },
      (err) => {
        this.ngxService.stop();
        this.ticket = {};
        console.log('err:: ', err);
        this.api.showToast('error', err.error.error);
      },
      () => {
        this.ngxService.stopAll();
      }
    );
  }

  saveReply() {
    this.api
      .post('support-node/reply-support-ticket/' + this.id, {
        message: this.reply,
        status: this.status,
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
          this.scrollToBottom();
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

  getLastReplier() {
    if (this.ticket && this.ticket.reply && this.ticket.reply.length) {
      return this.ticket.reply[this.ticket.reply.length - 1].hasOwnProperty('user_id')
        ? 'Udify'
        : this.ticket.name;
    } else {
      return this.ticket.name;
    }
  }

  changeStatus() {
    this.api
      .post('support-node/ticket-status-change/' + this.id, {
        status: this.status,
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

  getFile(file: any) {
    return JSON.parse(file)[0];
  }
}
