import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  order: any = {};
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
        this.getOrder();
      }
    });
  }

  ngOnInit(): void {}

  getOrder() {
    this.ngxService.start();
    this.api
      .get(
        this.api.isUserOrders
          ? 'order-node/get-single-order/' + this.id
          : 'vendor-order-node/get-single-order/' + this.id,
        {}
      )
      .subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.data) {
            console.log('order data:: ', data);
            this.order = data.data;
          } else {
            this.order = {};
          }
          this.ngxService.stop();
        },
        (err) => {
          this.ngxService.stop();
          this.order = {};
          console.log('Order err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
  }
}
