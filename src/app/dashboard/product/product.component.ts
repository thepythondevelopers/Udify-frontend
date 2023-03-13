import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  product: any = {};
  productImages: any = [];
  id: any = '';
  effect = 'scrollx';
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
        this.getProduct();
      }
    });
  }

  ngOnInit(): void {}

  getProduct() {
    this.api.get('product-node/get-single-shopify/' + this.id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.data) {
          console.log('product data:: ', data, JSON.parse(data.data[0].images));
          this.product = data.data[0];
          this.productImages = JSON.parse(data.data[0].images);
        } else {
          this.product = {};
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.product = {};
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }
}
