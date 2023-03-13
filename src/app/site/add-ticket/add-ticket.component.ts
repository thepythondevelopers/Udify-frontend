import { Component, OnInit } from '@angular/core';
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
import { NzModalService } from 'ng-zorro-antd/modal';

declare var Quill: any;
@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css'],
})
export class AddTicketComponent implements OnInit {
  quill: any;
  ticketForm: FormGroup;
  path: any = 'add';
  category: any = '';
  attach: any;
  ticketId: any = '';
  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public modelS: ModelService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private modal: NzModalService
  ) {
    this.ticketForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params) => {
        console.log('params:: ', params);
        if (params) {
          this.category;
          if (params.type) {
            this.path = params.type;
          } else {
            this.path = '';
          }
          if (params.category) {
            this.category = params.category;
          } else {
            this.category = '';
          }
        }
      },
      (e) => {
        console.log('params err:: ', e);
      }
    );
    this.ngxService.stopAll();
  }

  chooseCategory(cat: any) {
    this.router.navigate(['/support/ticket'], {
      queryParams: { category: cat },
      queryParamsHandling: 'merge',
    });
  }

  attachment(event) {
    this.attach = event.files[0];
    console.log('this.attach:: ', this.attach);
  }

  submitForm() {
    if (this.ticketForm.valid) {
      this.ngxService.start();
      let url: any = 'support-node/create-support-without'; //'create-support';
      let params: any = {
        category: this.category,
        ...this.ticketForm.value,
      };
      let formData = new FormData();
      for (let p in params) {
        // params[p]
        console.log(p);
        formData.append(p, params[p]);
      }
      formData.append('attachment', this.attach);
      this.api.post(url, formData).subscribe(
        (data: any) => {
          this.ngxService.stop();
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.ticketId = data.ticket_id;
            // this.router.navigate(['/support/submit-ticket'], {
            //   queryParams: { submit: 1 },
            //   queryParamsHandling: 'merge',
            // });
            // this.modal.closeAll();
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
    } else {
      this.ticketForm.markAllAsTouched();
    }
  }

  viewTicket() {
    this.router.navigate(['/support/tickets'], {
      queryParams: { type: 'view' },
      queryParamsHandling: 'merge',
    });
  }
}
