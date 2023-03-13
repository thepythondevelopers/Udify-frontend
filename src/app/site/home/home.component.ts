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
import { CmsService } from 'src/app/admin/services/cms.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  pricingTab: any = 'basic';
  contactForm: FormGroup;
  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public modelS: ModelService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    public cmsService: CmsService
  ) {
    this.contactForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      supplier: ['', [Validators.required]],
      state: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getSectionsData();
  }

  getSectionsData() {
    this.api.post('cms-node/get-cms-page/home', {}).subscribe((data: any) => {
      console.log("sections data::",data);
      if(data){
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data.data) {
          this.cmsService.home = JSON.parse(data.data);
        }
      }
    });
  }

  login() {
    this.router.navigateByUrl('/signin');
  }

  contactUs() {
    if (this.contactForm.valid) {
      this.ngxService.start();
      this.api.post('get-in-touch-node/get-in-touch', this.contactForm.value).subscribe(
        (data: any) => {
          this.ngxService.stop();
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.contactForm.reset();
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
