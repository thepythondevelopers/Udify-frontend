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

declare var Quill: any;
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  planForm: FormGroup;
  id: any = '';
  quill: any;
  plan: any = {};
  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public modelS: ModelService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {
    this.planForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      type: ['', [Validators.required]],
      // time_period: ['', [Validators.required]],
      // time_period_type: ['', [Validators.required]],
      features: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.quill = new Quill('#editor', {
      theme: 'snow',
    });
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('id')) {
        this.id = params.id;
        this.getPlans();
        console.log('Route:: ', this.id);
      }
    });
  }

  getPlans() {
    this.ngxService.start();
    this.api.post('stripe-node/get-plan-admin', {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.length) {
          console.log('data:: ', data);
          let pln: any = data.find((x: any) => x.app_id == this.id);
          if(pln) {
            this.plan = pln;
            this.planForm.patchValue(this.plan);
            const value = pln.features;
            const delta = this.quill.clipboard.convert(value);
  
            this.quill.setContents(delta, 'silent');
          }
        } else {
          this.plan = {};
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.plan = {};
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  submitForm() {
    var html = this.quill.root.innerHTML;
    console.log(html);
    if(html == '<p><br></p>') {
      this.planForm.markAllAsTouched();
    } else {
      this.planForm.get('features').setValue(html);
    }
    if (this.planForm.valid) {

      this.ngxService.start();
      let url: any = '';
      if (!this.id.length) {
        url = 'stripe-node/create-plan/';
      } else {
        url = 'stripe-node/update-plan/'+this.id;
        delete this.planForm.value.price;
      }

      this.api.post(url, this.planForm.value).subscribe(
        (data: any) => {
          this.ngxService.stop();
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.router.navigateByUrl('/admin/plans');
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
    } else {
      this.planForm.markAllAsTouched();
    }
  }
}
