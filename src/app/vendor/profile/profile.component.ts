import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEdit: boolean = false;
  user: any = {};
  isAdminUser: boolean = false;
  id: any = '';
  isImpersonated: any = false;
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
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private eventS: EventService
  ) {
    this.profileForm = this.fb.group({
      cover: ['', []],
      avatar: ['', []],
      title: ['', [Validators.required]],
      about: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: [
        { value: '', disable: true },
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(([+][(]?[0-9]{1,1}[)]?)|([(]?[0-9]{4}[)]?))s*[)]?[-s.]?[(]?[0-9]{1,1}[)]?([-s.]?[0-9]{3})([-s.]?[0-9]{2,3})'
          ),
        ],
      ],
      store_name: [''],
      vendor_email: [
        '',
        [
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      // vendor_email: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      //   ],
      // ],
      company: [''],
      // address_unit: ['', [Validators.required]],
      address_street: ['', [Validators.required]],
      address_city: ['', [Validators.required]],
      address_state: ['', [Validators.required]],
      address_country: ['', [Validators.required]],
      secret_key: ['', [Validators.required]],
      publishable_key: ['', [Validators.required]],
      address_zip: ['', [Validators.required]],

      // password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.profileForm.disable();
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('type')) {
        this.isAdminUser = true;
        this.isEdit = params.type == 'edit';
        if (!this.isEdit) {
          this.profileForm.disable();
        } else {
          this.profileForm.enable();
        }
      } else {
        this.isAdminUser = false;
      }

      if (params && params.hasOwnProperty('id')) {
        this.id = params.id;
        this.ngxService.start();
        this.getUserProfile();
      } else {
        this.isAdminUser = false;
        this.ngxService.start();
        this.getProfile();
      }
    });
  }

  ngOnInit(): void {
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
      (x) => x.name == this.profileForm.value.address_country
    );
    if (country) {
      this.selectedCountry = country;
      this.options.componentRestrictions.country =
        this.selectedCountry.unicodeFlag;
      this.countryCode = '+' + country.dialCode;
    }
    console.log('>> ', this.profileForm.value.country, this.options, country);
  }

  getProfile() {
    this.ngxService.start();
    this.api.get('profile-node/get-profile', {}).subscribe(
      async (data: any) => {
        if (data.hasOwnProperty('error')) {
          return false;
        }
        if (data.hasOwnProperty('email')) {
          this.user = data;
          if (!this.isImpersonated) {
            this.auth.setUser(data);
          }
          this.profileForm.patchValue(data);
          this.profileForm.patchValue(data.account_id);
          if(data.account_id.avatar){
            this.profileForm
            .get('avatar')
            .setValue(
              'https://f000.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=' +
                data.account_id.avatar.fileId
            );
          this.profileForm
            .get('cover')
            .setValue(
              'https://f000.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=' +
                data.account_id.cover.fileId
            );

            console.log("profile form::",this.profileForm.get('cover').value)

          this.old_avatar_fileId = data.account_id.avatar.fileId;
          this.old_avatar_filename = data.account_id.avatar.filename;

          this.old_cover_fileId = data.account_id.cover.fileId;
          this.old_cover_filename = data.account_id.cover.filename;
          }
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
      }
    );
  }

  getUserProfile() {
    this.api.post('admin-node/admin/user/' + this.id, {}).subscribe(
      async (data: any) => {
        if (data.hasOwnProperty('error')) {
          return false;
        }
        if (data.hasOwnProperty('email')) {
          this.user = data;
          if (!this.isImpersonated) {
            this.auth.setUser(data);
          }
          this.profileForm.patchValue(data);
          this.profileForm.patchValue(data.account_id);
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
      }
    );
  }

  bindImage(img) {
    return img;
  }

  edit() {
    this.isEdit = !this.isEdit;
    if (!this.isEdit) {
      this.profileForm.disable();
    } else {
      this.profileForm.enable();
    }
    this.profileForm.reset();
    this.profileForm.patchValue(this.user);
    this.profileForm.patchValue(this.user.account_id);
  }

  coverPic: any;
  coverChanged(event: any) {
    let that = this;
    var reader = new FileReader();
    this.coverPic = event.files[0];
    // that.profileForm.controls.cover.setValue(event.files[0]);
    reader.readAsDataURL(event.files[0]);
    reader.onload = function () {
      console.log(reader.result);
      let res: any = reader.result;
      that.profileForm.controls.cover.setValue(res.split(',')[1]);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  proPic: any;
  avatarChanged(event: any) {
    let that = this;
    var reader = new FileReader();
    // that.profileForm.controls.avatar.setValue(event.files[0]);
    this.proPic = event.files[0];
    reader.readAsDataURL(event.files[0]);
    reader.onload = function () {
      console.log(reader.result);
      let res: any = reader.result;
      that.profileForm.controls.avatar.setValue(res.split(',')[1]);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  cancel() {}

  old_avatar_fileId: any = null;
  old_avatar_filename: any = null;
  old_cover_fileId: any = null;
  old_cover_filename: any = null;
  save() {
    if (this.profileForm.valid) {
      this.ngxService.start();
      let url = 'profile-node/supplier-profile-update';
      let param = this.profileForm.value;
      const formData = new FormData();
      if (this.proPic) {
        formData.append('avatar', this.proPic);
        formData.append('old_avatar_fileId', this.old_avatar_fileId);
        formData.append('old_avatar_filename', this.old_avatar_filename);
      }
      if (this.coverPic) {
        formData.append('cover', this.proPic);
        formData.append('old_cover_fileId', this.old_cover_fileId);
        formData.append('old_cover_filename', this.old_cover_filename);
      }
      for (var key in this.profileForm.value) {
        if (this.profileForm.value.hasOwnProperty(key)) {
          // console.log(key + ' -> ' + this.firstForm.value[key]);
          if (key != 'avatar' && key != 'cover') {
            if (this.profileForm.value[key]) {
              formData.append(key, this.profileForm.value[key]);
            }
          }
        }
      }

      this.api.post(url, formData).subscribe((data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.message) {
          this.api.showToast('success', data.message);
          this.eventS.updatedProfile();
          this.getProfile();
          this.edit();
        }
        this.ngxService.stop();
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
