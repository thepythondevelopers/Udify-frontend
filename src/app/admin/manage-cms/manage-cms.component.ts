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
import { CmsService } from '../services/cms.service';

@Component({
  selector: 'app-manage-cms',
  templateUrl: './manage-cms.component.html',
  styleUrls: ['./manage-cms.component.css'],
})
export class ManageCmsComponent implements OnInit {
  type: any = '';


  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public modelS: ModelService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    public cmsService: CmsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('type')) {
        this.type = params.type;
        this.getSectionsData();
      }
    });
  }

  getSectionsData() {
    this.api
      .post('cms-node/get-admin-cms-page/' + this.type, {})
      .subscribe((data: any) => {
        console.log('cms-node/get-admin-cms-page:: ', data);
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data.data) {
          this.cmsService[this.type] = JSON.parse(data.data);
        }
      });
  }

  saveCms() {
    this.ngxService.start();
    let params = { type: this.type, data: this.cmsService[this.type] };
    this.api.post('cms-node/create-update-cms', params).subscribe(
      (data: any) => {
        console.log('cms-node/create-update-cms:: ', data);
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }

        if (data.message) {
          this.api.showToast('success', data.message);
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }
}
