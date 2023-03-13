import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  countries: any = [];
  countryCode: any = '+1';
  selectedCountry: any = {};
  options: any = {
    componentRestrictions: {
      // country: [''],
    },
  };
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public api: ApiService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      // user_name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('(([+][(]?[0-9]{1,1}[)]?)|([(]?[0-9]{4}[)]?))s*[)]?[-s.]?[(]?[0-9]{1,1}[)]?([-s.]?[0-9]{3})([-s.]?[0-9]{2,3})')]],
      //store_name: ['', [Validators.required]],
      /*store_email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],*/
      address_unit: ['', [Validators.required]],
      address_street: ['', [Validators.required]],
      // address_unit: ['', [Validators.required]],
      address_city: ['', [Validators.required]],
      address_state: ['', [Validators.required]],
      address_zip: ['', [Validators.required]],
      address_country: ['', [Validators.required]],
      notification_email_list: ['0', [Validators.required]],
      // tax_number: ['', [Validators.required]],
      // business_type: ['', [Validators.required]],
      about: ['', [Validators.required]],

      // password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {    this.getCountries();
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
      (x) => x.name == this.registerForm.value.address_country
    );
    if (country) {
      this.selectedCountry = country;
      this.options.componentRestrictions.country =
        this.selectedCountry.unicodeFlag;
      this.countryCode = '+' + country.dialCode;
    }
    console.log('>> ', this.registerForm.value.country, this.options, country);
  }

  register() {
    console.log("register form valid::",this.registerForm)
    if (this.registerForm.valid) {
      this.ngxService.start();

      console.log('Register Form Value:: ', this.registerForm.value);
      // this.auth.post('auth/signup', this.registerForm.value).subscribe(
      this.auth
        .post('authentication-node/supplier-sign-up', this.registerForm.value)
        .subscribe(
          (res) => {
            this.ngxService.stop();
            console.log('Register res:: ', res);
            this.auth.showToast('success', 'Sign Up Successfully.');
            this.router.navigateByUrl('/signin');
          },
          (err) => {
            this.ngxService.stop();
            console.log('Register err:: ', err);
            for (let i = 0; i < err.error.error.length; i++) {
              this.auth.showToast('error', err.error.error[i].msg);
            }
          }
        );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  signup() {
    this.router.navigateByUrl('/signup');
  }
}
