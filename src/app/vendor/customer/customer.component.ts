import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer: any = {};
  id: any = '';

  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('id')) {
        this.id = params.id;
        this.ngxService.start();
        this.getCustomer();
      }
    });
  }

  ngOnInit(): void {}

  getCustomer() {
    this.api.post('vendor-customer-node/get-user-customer/' + this.id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.length) {
          console.log('Customer data:: ', data);
          this.customer = data[0];
        } else {
          this.customer = {};
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.customer = {};
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }
}
