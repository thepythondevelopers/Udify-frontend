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
  selector: 'app-add-knowledgebase',
  templateUrl: './add-knowledgebase.component.html',
  styleUrls: ['./add-knowledgebase.component.css'],
})
export class AddKnowledgebaseComponent implements OnInit {
  addForm: FormGroup;
  id: any = '';
  knowledge: any = {};
  quill: any;

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public modelS: ModelService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {
    this.addForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.quill = new Quill('#editor', {
      theme: 'snow',
    });
    this.route.params.subscribe((params: any) => {
      if (params && params.hasOwnProperty('id')) {
        this.id = params.id;
        this.getknowledges();
        console.log('Route:: ', this.id);
      }
    });
  }

  getknowledges() {
    this.ngxService.start();
    // this.api.post('knowledgebase-node/get-base/'+this.id, {}).subscribe(
    // this.api.post('knowledgebase-node/get-base', {}).subscribe(
    this.api.post('knowledgebase-node/get-base-id/' + this.id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data._id) {
          console.log('data:: ', data);
          this.knowledge = data;
          this.addForm.patchValue(this.knowledge);

          const value = data.description;
          const delta = this.quill.clipboard.convert(value);

          this.quill.setContents(delta, 'silent');
        } else {
          this.knowledge = {};
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.knowledge = [];
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  submitForm() {
    var html = this.quill.root.innerHTML;
    console.log(html);
    if(html == '<p><br></p>') {
      this.addForm.markAllAsTouched();
    } else {
      this.addForm.get('description').setValue(html);
    }

    if (this.addForm.valid) {
      this.ngxService.start();
      let url: any = '';
      if (!this.id.length) {
        url = 'knowledgebase-node/create-base/';
      } else {
        url = 'knowledgebase-node/update-base/' + this.id;
      }

      this.api.post(url, this.addForm.value).subscribe(
        (data: any) => {
          this.ngxService.stop();
          if (data.hasOwnProperty('error')) {
            this.api.showToast('error', data.error);
            return false;
          }
          if (data && data.message) {
            this.api.showToast('success', data.message);
            this.router.navigateByUrl('/admin/knowledgebase');
          }
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.api.showToast('error', err.error.error);
        }
      );
    } else {
      this.addForm.markAllAsTouched();
    }
  }
}
