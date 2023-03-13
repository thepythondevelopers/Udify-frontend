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
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  selImages: any = [];
  prodVariations = [{ option1: '', price: '', sku: '' }];

  product: any = {};
  id: any = '';
  shopiFyStores: any = [];
  quill: any;
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
  }

  ngOnInit(): void {
    this.quill = new Quill('#editor', {
      theme: 'snow'
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
          this.prodVariations = data.data[0].product_variants;
          this.selImages = JSON.parse(data.data[0].images);
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

      that.selImages.push({ attachment: res.split(',')[1] });
      document.getElementById('prod-image')['value'] = null;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  deleteImage(i) {
    this.selImages.splice(i, 1);
  }

  submitProduct() {
    var html = this.quill.root.innerHTML;
    console.log(html);
    if(html == '<p><br></p>') {
      this.productForm.markAllAsTouched();
    } else {
      this.productForm.get('body_html').setValue(html);
    }
    if (this.productForm.valid) {
      let url: any = '';
      if (!this.id.length) {
        url = 'product-node/create-product/' + this.productForm.value.store;
      } else {
        url =
          'product-node/update-product/' +
          this.product.store_id +
          '/' +
          this.product.id;
      }
      if (
        this.prodVariations[this.prodVariations.length - 1].option1.length &&
        this.prodVariations[this.prodVariations.length - 1].sku.length &&
        this.prodVariations[this.prodVariations.length - 1].price
      ) {
        this.ngxService.start();
        let params: any = {
          shopify: {
            ...this.productForm.value,
            variants: this.prodVariations,
            images: this.selImages,
          },
        };
        console.log('Params:: ', params);
        this.api.post(url, params).subscribe(
          (data: any) => {
            this.ngxService.stop();
            if (data.hasOwnProperty('error')) {
              this.api.showToast('error', data.error);
              return false;
            }
            if (data && data.message) {
              this.api.showToast('success', data.message);
              this.router.navigateByUrl('/dashboard/products');
            }
          },
          (err) => {
            this.ngxService.stop();
            console.log('Login err:: ', err);
            this.api.showToast('error', err.error.error);
          }
        );
      } else {
        this.api.showToast(
          'error',
          'Please fill the values of product variations'
        );
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
