import { Component, OnInit } from '@angular/core';
import { CmsService } from 'src/app/admin/services/cms.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-become-partner',
  templateUrl: './become-partner.component.html',
  styleUrls: ['./become-partner.component.css']
})
export class BecomePartnerComponent implements OnInit {

  constructor(
    public api: ApiService,
    public cmsService: CmsService
  ) { }

  ngOnInit(): void {
    this.getSectionsData();
  }
 
  getSectionsData() {
    this.api.post('cms-node/get-cms-page/becomePartner', {}).subscribe((data: any) => {
      if(data){
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        } 
        if (data.data) {
          this.cmsService.becomePartner = JSON.parse(data.data);
        }
      }
    });
  }



}
