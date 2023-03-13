import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-knowledgebase',
  templateUrl: './knowledgebase.component.html',
  styleUrls: ['./knowledgebase.component.css'],
})
export class KnowledgebaseComponent implements OnInit {
  knowledge: any = {};
  id: any = '';
  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
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
}
