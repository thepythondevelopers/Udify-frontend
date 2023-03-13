import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../services/api.service';
import { EventService } from '../../services/event.service';
import { ModelService } from '../../services/model.service';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItem: any = [];
  loading: boolean = false;
  constructor(
    public api: ApiService,
    private auth: AuthService,
    private router: Router,
    private eventS: EventService,
    public modelS: ModelService,
    private ngxService: NgxUiLoaderService,
    private drawerService: NzDrawerService,
    private cart: CartService,
    private drawerRef: NzDrawerRef<string>
  ) {}

  ngOnInit(): void {
    this.getCart();
  }

  close() {
    this.drawerRef.close();
  }

  getCart() {
    this.cart.fetch().then((data: any) => {
      this.cartItem = data;
    });
  }

  removeCart(data: any) {
    this.cart.remove(data).then((res: any) => {
      this.cartItem = res;
    });
  }

  getProductImage(prod: any) {
    let data: any = JSON.parse(prod.images);
    return data.length ? data[0].src : false;
  }

  checkout() {
    let url: any = 'catalog-node/create-catalog';
    let result = this.cartItem.map((a) => a.id);
    let param: any = result;
    this.api.post(url, {product_id: param}).subscribe(
      (data: any) => {
        console.log('Error:: ', data);
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data._id) {
          this.api.showToast(
            'success',
            'Product added to catalog successfully.'
          );
          this.cart.emptyCart().then((res: any) => {
            this.cartItem = res;
          });
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        console.log('Login err:: ', err);
        this.api.showToast(
          'error',
          err.error.message ? err.error.message : err.error.error
        );
      }
    );
  }
}
