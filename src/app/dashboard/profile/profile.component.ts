import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EventService } from 'src/app/services/event.service';
import {
  NavigationStart,
  Router,
  Event as NavigationEvent,
  ActivatedRoute,
} from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  firstForm: FormGroup;
  secondForm: FormGroup;
  user: any = {};
  isEdit: boolean = false;
  proPic: any = '';

  routerEvent: any;

  isAdminUser: boolean = false;
  id: any = '';
  isImpersonated: any = false;
  constructor(
    public api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private eventS: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private dom: DomSanitizer
  ) {
    this.firstForm = this.fb.group({
      about: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      location: ['', [Validators.required]],
      website: ['', [Validators.required]],
      avatar: ['', []],
      old_avatar_fileId: ['', []],
      old_avatar_filename: ['', []],
    });

    this.secondForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      name: ['', [Validators.required]],
      address_street: ['', [Validators.required]],
      address_city: ['', [Validators.required]],
      address_state: ['', [Validators.required]],
      address_zip: ['', [Validators.required]],
      address_country: ['', [Validators.required]],
    });
    this.firstForm.disable();
    this.secondForm.disable();
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('type')) {
        this.isAdminUser = true;
        this.isEdit = params.type == 'edit';
        if (!this.isEdit) {
          this.firstForm.disable();
          this.secondForm.disable();
        } else {
          this.firstForm.enable();
          this.secondForm.enable();
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
    this.isImpersonated = this.auth.getSession('impersonate');
  }

  ngOnDestroy(): void {
    if (this.routerEvent) {
      this.routerEvent.unsubscribe();
    }
  }

  old_avatar_fileId: any = '';
  old_avatar_filename: any = '';
  getProfile() {
    this.api.get('profile-node/get-profile', {}).subscribe(
      async (data: any) => {
        console.log("data from get profile::",data);
        if (data.hasOwnProperty('error')) {
          return false;
        }
        if (data.hasOwnProperty('email')) {
          this.user = data;
          if (!this.isImpersonated) {
            this.auth.setUser(data);
          }
          this.firstForm.patchValue(data);
          this.firstForm.patchValue(data.account_id);
          if(data.account_id.avatar){
            this.firstForm
            .get('avatar')
            .setValue(
              'https://udify-image-loader.s3.us-west-000.backblazeb2.com/' +
                data.account_id.avatar.filename
            );
          this.old_avatar_fileId = data.account_id.avatar.fileId;
          this.old_avatar_filename = data.account_id.avatar.filename;

          }
          this.secondForm.patchValue(data);
          this.secondForm.patchValue(data.account_id);
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
          this.firstForm.patchValue(data);
          this.firstForm.patchValue(data.account_id);

          this.secondForm.patchValue(data);
          this.secondForm.patchValue(data.account_id);
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
      }
    );
  }

  updateFirstForm() {
    if (!this.isAdminUser) {
      if (this.firstForm.valid) {
        this.ngxService.start();
        // console.log('this.firstForm:: ', this.firstForm.value);
        // return false;
        const formData = new FormData();
        if (this.proPic) {
          formData.append('avatar', this.proPic);
          formData.append('old_avatar_fileId', this.old_avatar_fileId);
          formData.append('old_avatar_filename', this.old_avatar_filename);
        }
        for (var key in this.firstForm.value) {
          if (this.firstForm.value.hasOwnProperty(key)) {
            // console.log(key + ' -> ' + this.firstForm.value[key]);
            if (key != 'avatar') {
              if (this.firstForm.value[key]) {
                formData.append(key, this.firstForm.value[key]);
              }
            }
          }
        }
        this.api
          .post('profile-node/update-user-profile1', formData)
          .subscribe(async (data: any) => {
            if (data.hasOwnProperty('error')) {
              this.api.showToast('error', data.error);
              return false;
            }
            if (data && data.message) {
              this.proPic = null;
              this.api.showToast('success', data.message);
              this.eventS.updatedProfile();
              this.getProfile();
            }
            this.ngxService.stop();
          });
      } else {
        this.firstForm.markAllAsTouched();
      }
    }
  }

  updateSecondForm() {
    if (!this.isAdminUser) {
      if (this.secondForm.valid) {
        this.ngxService.start();
        this.api
          .post('profile-node/update-user-profile2', this.secondForm.value)
          .subscribe(
            async (data: any) => {
              if (data.hasOwnProperty('error')) {
                this.api.showToast('error', data.error);
                return false;
              }
              if (data && data.message) {
                this.api.showToast('success', data.message);
                this.eventS.updatedProfile();
                this.getProfile();
              }
              this.ngxService.stop();
            },
            () => {
              this.ngxService.stop();
            }
          );
      } else {
        this.secondForm.markAllAsTouched();
      }
    }
  }

  bindImage(img) {
    // return img && img !== null ? 'data:image/png;base64,'+img : '';
    return img && img !== null
      ? img.indexOf('http') > -1
        ? img
        : 'data:image/png;base64,' + img
      : '';
  }

  profilePicChanged(event) {
    let that = this;
    // console.log('file:: ', event.files[0]);
    this.proPic = event.files[0];
    // // this.firstForm.get('avatar').setValue(event.files[0]);
    // // document.getElementById('pro_pic')['value']= null;

    var reader = new FileReader();
    reader.readAsDataURL(event.files[0]);
    reader.onload = function () {
      // console.log(reader.result);
      let res: any = reader.result;
      // that.proPic = (res.split(',')[1]);
      that.firstForm.controls.avatar.setValue(res.split(',')[1]);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  edit() {
    this.isEdit = !this.isEdit;
    if (!this.isEdit) {
      this.firstForm.disable();
      this.secondForm.disable();
    } else {
      this.firstForm.enable();
      this.secondForm.enable();
    }
    this.firstForm.reset();
    this.firstForm.patchValue(this.user);
    this.firstForm.patchValue(this.user.account_id);
    this.firstForm
      .get('avatar')
      .setValue(
        'https://udify-image-loader.s3.us-west-000.backblazeb2.com/' +
          this.user.account_id.avatar.filename
      );

    this.secondForm.reset();
    this.secondForm.patchValue(this.user);
    this.secondForm.patchValue(this.user.account_id);
  }
}
