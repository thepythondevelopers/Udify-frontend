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

declare var $: any;
declare var Quill: any;
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  variantForm: FormGroup;
  selImages: any = [];
  prodVariations = [{ option1: '', price: '', sku: '' }];

  product: any = {};
  id: any = '';
  shopiFyStores: any = [];
  quill: any;

  isNewVariant: boolean = false;
  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public modelS: ModelService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required]],
      body_html: ['', [Validators.required]],
      vendor: ['', [Validators.required]],
      product_type: ['', [Validators.required]],
      store: ['', [Validators.required]],
    });

    this.variantForm = this.fb.group({
      option1: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.quill = new Quill('#editor', {
      theme: 'snow',
    });

    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('id')) {
        this.productForm.get('store').clearValidators();
        this.id = params.id;
        this.ngxService.start();
        this.getProduct();
        console.log('Route:: ', this.id);
      }
    });
  }

  getProduct() {
    this.api.get('product-node/get-single-shopify/' + this.id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.data) {
          console.log('data:: ', data);
          this.product = data.data[0];
          this.productForm.patchValue(data.data[0]);
          this.prodVariations = data.data[0].variant;
          this.selImages = JSON.parse(data.data[0].images);
          // this.quill.root.innerHTML =

          const value = data.data[0].body_html;
          const delta = this.quill.clipboard.convert(value);

          this.quill.setContents(delta, 'silent');
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

  addVariation() {
    console.log(this.prodVariations[this.prodVariations.length - 1].price);
    if (
      this.prodVariations[this.prodVariations.length - 1].option1.length &&
      this.prodVariations[this.prodVariations.length - 1].sku.length &&
      this.prodVariations[this.prodVariations.length - 1].price
    ) {
      this.prodVariations.push({ option1: '', price: '', sku: '' });
    }
  }

  removeVariation() {
    this.prodVariations.splice(this.prodVariations.length - 1, 1);
  }

  prodImageChange(event: any) {
    let that = this;
    var reader = new FileReader();
    reader.readAsDataURL(event.files[0]);
    reader.onload = function () {
      console.log(reader.result);
      let res: any = reader.result;

      // that.selImages.push({ attachment: res.split(',')[1] });
      console.log('that.selImages:: ', that.selImages);
      document.getElementById('prod-image')['value'] = null;
      that.addNewImage(res.split(',')[1]);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  submitProduct() {
    var html = this.quill.root.innerHTML;
    console.log(html);
    if (html == '<p><br></p>') {
      this.productForm.markAllAsTouched();
    } else {
      this.productForm.get('body_html').setValue(html);
    }
    if (this.productForm.valid) {
      this.ngxService.start();

      let url: any = '';

      url =
        'product-node/update-product/' +
        this.product.store_id +
        '/' +
        this.product.id;

      let params: any = {
        shopify: {
          ...this.productForm.value,
        },
      };
      console.log('Params:: ', params);
      this.api.post(url, params).subscribe(
        (data: any) => {
          if (data.hasOwnProperty('error')) {
            this.ngxService.stop();
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.getProduct();
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  deleteImage(image) {
    this.ngxService.start();
    console.log('Image:: ', image);
    let url =
      'product-node/shopfiy-product-image-delete/' +
      this.product.store_id +
      '/' +
      image.product_id +
      '/' +
      image.id;
    this.api.post(url, {}).subscribe(
      (data: any) => {
        this.ngxService.stop();
        if (data.hasOwnProperty('error')) {
          this.ngxService.stop();
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.message) {
          this.api.showToast('success', data.message);
          this.getProduct();
        }
      },
      (err) => {
        this.ngxService.stop();
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }
 
  addNewImage(img: any) {
    this.ngxService.start();
    let url =
      'product-node/shopfiy-product-image-create/' + this.product.store_id + '/' + this.product.id;
    let params = {
      shopify_product_image: {
        attachment: img,
      },
    };
    this.api.post(url, params).subscribe(
      (data: any) => {
        this.ngxService.stop();
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.message) {
          this.api.showToast('success', data.message);
          this.getProduct();
        }
      },
      (err) => {
        this.ngxService.stop();
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  deleteVariation(prod) {
    this.ngxService.start();
    console.log('Image:: ', prod);
    let url =
      'product-node/shopfiy-product-variant-delete/' +
      prod.store_id +
      '/' +
      prod.product_id +
      '/' +
      prod.id;
    this.api.post(url, {}).subscribe(
      (data: any) => {
        this.ngxService.stop();
        if (data.hasOwnProperty('error')) {
          this.ngxService.stop();
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.message) {
          this.api.showToast('success', data.message);
          this.getProduct();
        }
      },
      (err) => {
        this.ngxService.stop();
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  udateVariation(prod) {
    this.ngxService.start();
    console.log('Image:: ', prod);
    let url =
      'product-node/shopfiy-product-variant-update/' +
      prod.store_id +
      // '/' +
      // prod.product_id +
      '/' +
      prod.id;
    let params: any = {
      shopify_product_variant: {
        option1: prod.option1,
        sku: prod.sku,
        price: prod.price,
      },
    };
    this.api.post(url, params).subscribe(
      (data: any) => {
        this.ngxService.stop();
        if (data.hasOwnProperty('error')) {
          this.ngxService.stop();
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.message) {
          this.api.showToast('success', data.message);
          this.getProduct();
        }
      },
      (err) => {
        this.ngxService.stop();
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  addNewVariant() {
    this.isNewVariant = true;
  }

  submitVariant() {
    if (this.variantForm.valid) {
      this.ngxService.start();
      let url =
        'product-node/shopfiy-product-variant-create/' +
        this.product.store_id +
        '/' +
        this.product.id;
      let params: any = {
        shopify_product_variant: {
          ...this.variantForm.value,
        },
      };
      this.api.post(url, params).subscribe(
        (data: any) => {
          this.ngxService.stop();
          if (data.hasOwnProperty('error')) {
            this.ngxService.stop();
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.variantForm.reset();
            this.isNewVariant = false;
            this.api.showToast('success', data.message);
            this.getProduct();
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
    } else {
      this.variantForm.markAllAsTouched();
    }
  }
}
