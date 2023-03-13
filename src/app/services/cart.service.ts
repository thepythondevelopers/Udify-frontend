import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {}

  add(data: any) {
    return new Promise((resolve, reject) => {
      let cartData = [];
      let cart: any = sessionStorage.getItem('cart');
      if (cart && cart != null) {
        cartData = JSON.parse(sessionStorage.getItem('cart'));
      }
      let index = cartData.findIndex((x: any) => x.id == data.id);
      if (index > -1) {
        resolve({
          status: 'error',
          message: 'Product already exist in your cart.',
        });
      }
      cartData.push(data);
      sessionStorage.setItem('cart', JSON.stringify(cartData));
      resolve({
        status: 'success',
        message: 'Product added successfully in cart.',
      });
    });
  }

  fetch() {
    return new Promise((resolve, reject) => {
      let cartData = [];
      let cart: any = sessionStorage.getItem('cart');
      if (cart && cart != null) {
        cartData = JSON.parse(sessionStorage.getItem('cart'));
      }
      resolve(cartData);
    });
  }

  remove(data: any) {
    return new Promise((resolve, reject) => {
      let cartData = [];
      let cart: any = sessionStorage.getItem('cart');
      if (cart && cart != null) {
        cartData = JSON.parse(sessionStorage.getItem('cart'));
      }
      let index = cartData.findIndex((x: any) => x.id == data.id);
      if (index > -1) {
        cartData.splice(index, 1);
      }
      sessionStorage.setItem('cart', JSON.stringify(cartData));
      resolve(cartData);
    });
  }

  emptyCart() {
    return new Promise((resolve, reject) => {
      sessionStorage.setItem('cart', JSON.stringify([]));
      resolve([]);
    });
  }
}
