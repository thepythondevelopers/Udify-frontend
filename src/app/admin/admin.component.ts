import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../services/api.service';
import { EventService } from '../services/event.service';
import { ModelService } from '../services/model.service';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isCollapsed: boolean = false;
  shopiFyStores: any = [];
  selectedStore: any = 'all';
  user: any = {};
  constructor(
    public api: ApiService,
    private auth: AuthService,
    private router: Router,
    private eventS: EventService,
    private modelS: ModelService,
    private ngxService: NgxUiLoaderService
  ) {
    this.user = this.auth.getAuthUser();
  }

  ngOnInit(): void {
  }
  
  logout() {
    this.auth.logout();
  }
}
