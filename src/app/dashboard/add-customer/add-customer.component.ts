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

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer: any = {};
  id: any = '';
  shopiFyStores: any = [];
  countries: any = [];
  formattedaddress = ' ';
  options: any = {
    componentRestrictions: {
      // country: [''],
    },
  };
  countryCode: any = '+1';
  selectedCountry: any = {};
  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public modelS: ModelService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {
    this.customerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(12),
        ],
      ],
      address1: ['', [Validators.required]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['', [Validators.required]],
      store: ['', [Validators.required]],
    });
    console.log(modelS.allStores);
  }

  ngOnInit(): void {
    this.ngxService.start();
    // this.customerForm.get('store').setValue(this.modelS.allStores[0].store_id);
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('id')) {
        this.customerForm.get('store').clearValidators();
        this.id = params.id;
        this.getCustomer();
        console.log('Route:: ', this.id);
      }
    });
    this.getCountries();
  }

  getCountries() {
    // this.api.getByUrl('https://restcountries.com/v3.1/all', {}).subscribe(
    this.api
      .getByUrl(
        'https://countriesnow.space/api/v0.1/countries/info?returns=currency,flag,unicodeFlag,dialCode,iso',
        {}
      )
      .subscribe(
        (data: any) => {
          if (!data.error) {
            console.log('Countries Data:: ', data.data);
            this.countries = data.data;
          }
          this.ngxService.stop();
        },
        (err: any) => {
          this.ngxService.stop();
        }
      );
  }

  countrySelected() {
    let country: any = this.countries.find(
      (x) => x.name == this.customerForm.value.country
    );
    if (country) {
      this.selectedCountry = country;
      this.options.componentRestrictions.country =
        this.selectedCountry.unicodeFlag;
      this.countryCode = '+' + country.dialCode;
    }
    console.log('>> ', this.customerForm.value.country, this.options, country);
  }

  AddressChange(address: any) {
    //setting address from API to local variable
    console.log('address:: ', address);
    this.formattedaddress = address.formatted_address;
    for (let i = 0; i < address.address_components.length; i++) {
      let comp: any = address.address_components[i];
      for (let j = 0; j < comp.types.length; j++) {
        if (comp.types[j] == 'administrative_area_level_2') {
          this.customerForm.get('city').setValue(comp.long_name);
        }
        if (comp.types[j] == 'sublocality' || comp.types[j] == 'locality') {
          this.customerForm.get('province').setValue(comp.long_name);
        }
        if (comp.types[j] == 'postal_code') {
          this.customerForm.get('zip').setValue(comp.long_name);
        }
        // if (!this.customerForm.value.country.length) {
        if (comp.types[j] == 'country') {
          console.log(comp.long_name);
          this.customerForm.get('country').setValue(comp.long_name);
          let country: any = this.countries.find(
            (x: any) => x.name == this.customerForm.value.country
          );
          if (country) {
            this.selectedCountry = country;
            this.options.componentRestrictions.country =
              this.selectedCountry.unicodeFlag;
            this.countryCode = '+' + country.dialCode;
          }
        }
        // }
      }
    }
  }

  getCustomer() {
    this.api.get('customer-node/get-single-customer/' + this.id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.data) {
          console.log('data:: ', data);
          this.customer = data.data;
          this.customerForm.patchValue(data.data);
          this.customerForm.get('address1').setValue(data.data.address_line1);
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

  submitForm() {
    if (this.customerForm.valid) {
      this.ngxService.start();
      let url: any = '';
      if (!this.id.length) {
        url = 'customer-node/create-customer/' + this.customerForm.value.store;
      } else {
        url =
          'customer-node/update-customer/' +
          this.customer.store_id +
          '/' +
          this.customer.shopify_id;
      }
      let val: any = this.customerForm.value;
      val.phone = this.countryCode + val.phone;
      this.api.post(url, val).subscribe(
        (data: any) => {
          this.ngxService.stop();
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.router.navigateByUrl('/dashboard/customers');
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          
          this.api.showToast('error', Array.isArray(err.error.error) ? err.error.error[0].msg+': '+err.error.error[0].param : err.error.error);
        }
      );
    } else {
      this.customerForm.markAllAsTouched();
    }
  }
}
