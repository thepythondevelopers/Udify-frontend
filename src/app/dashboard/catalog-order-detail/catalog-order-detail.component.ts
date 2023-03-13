import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Location } from '@angular/common';

@Component({
  selector: 'app-catalog-order-detail',
  templateUrl: './catalog-order-detail.component.html',
  styleUrls: ['./catalog-order-detail.component.css'],
})
export class CatalogOrderDetailComponent implements OnInit {
  @ViewChild('imageSlider', { static: false })
  imageSlider: ElementRef<HTMLElement>;
  @ViewChild('prodSlider', { static: false })
  prodSlider: ElementRef<HTMLElement>;

  order: any = {};
  id: any = '';
  array = [1, 2, 3, 4];
  effect = 'scrollx';

  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private location: Location
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
    this.api.get('order-node/get-single-order/' + this.id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.data) {
          console.log('order data:: ', data);
          this.order = data.data;
          if (this.order.line_items.length) {
            // for (let i = 0; i < this.order.line_items.length; i++) {
              this.order.line_items.forEach(element => {
                this.getProductsDetail(element);
              });
            // }
          } else {
            this.ngxService.stop();
          }
        } else {
          this.order = {};
          this.ngxService.stop();
        }
       
      },
      (err) => {
        this.ngxService.stop();
        this.order = {};
        console.log('Order err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  getProductsDetail(prod: any) {
    this.api
      .post('order-node/order-product-supplier/' + prod.product_id, {})
      .subscribe(
        (data: any) => {
          console.log('product data:: ', data);
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.product.length) {
            prod.data = data.product[0];
            console.log(prod.variant_id);
            prod.images = JSON.parse(data.product[0].images);
            console.log("product images::",prod.images);
            prod.description = data.product[0].body_html;
            prod.variant = {};
            // let varIds = JSON.parse(prod.variant_ids);
            let varients = data.product[0].variant.find(
              (x) => x.id == prod.variant_id
            );
            console.log('Varients:: ', varients);
            if (varients) {
              prod.variant = varients;
            }
          }
          this.ngxService.stop();
        },
        (err) => {
          this.ngxService.stop();
          console.log('product err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
  }

  parseString(val) {
    return parseFloat(val);
  }

  getCurrency(prod) {
    if (prod.price_set) {
      if (prod.price_set.presentment_money) {
        return prod.price_set.presentment_money.currency_code;
      }
      if (prod.price_set.shop_money) {
        return prod.price_set.shop_money.currency_code;
      }
    } else {
      return 'USD';
    }
  }

  goBack() {
    this.location.back();
  }

  changeSlide(fn: any, variab: any) {
    this[variab][fn]();
  }

  slideTo(i: any, variab: any) {
    this[variab].goTo(i);
  }
}
