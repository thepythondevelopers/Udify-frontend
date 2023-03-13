import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EventService } from 'src/app/services/event.service';
import { ModelService } from 'src/app/services/model.service';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any = [];
  userSub: any;
  searchtext: any = '';

  total: any = 0;
  page: any = 1;
  constructor(
    public api: ApiService,
    private eventS: EventService,
    private modelS: ModelService,
    private auth: AuthService,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.ngxService.start();
    let param: any = {
      // store_id: this.modelS.selectedStore,
      page: this.page
    };
    if (this.searchtext.length) {
      param.search_string = this.searchtext;
    }
    this.userSub = this.api.post('admin-node/admin/user', param).subscribe(
      async (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        console.log('data:: ', data.data);
        if (data && data.docs && data.docs.length ) {
          let rec: any = await data.docs.filter((x: any) => {
            x.status = x.deleted_at == null ? true : false;
            return x;
          });
          // this.users = data;
          // this.total = Math.ceil(parseInt(data.count) / 10);
          this.total = parseInt(data.count);
          this.users = rec;
        } else {
          this.total = 0;
          this.users = [];
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.total = 0;
        this.users = [];
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  userStatusChange(user, event) {
    console.log(user, event);
    this.ngxService.start();
    let url: any = event
      ? 'admin-node/admin/user-enable/' + user._id
      : 'admin-node/admin/user-disable/' + user._id;
    this.userSub = this.api.post(url, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        this.api.showToast(
          'success',
          `User successfully ${event ? 'enabled' : 'disabled'}.`
        );

        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        user.deleted_at = null;
        console.log('Login err:: ', err);
        this.api.showToast('error', err.error.error);
      }
    );
  }

  loginViaUser(user: any) {
    this.ngxService.start();
    this.userSub = this.api.post('admin-node/admin/user-token/' + user._id, {}).subscribe(
      (data: any) => {
        if (data.hasOwnProperty('error')) {
          this.api.showToast('error', data.error);
          return false;
        }
        if (data && data.token) {
          console.log('data:: ', data);
          this.modelS.isImpersonated = true;
          this.modelS.impersonatedToken = data.token;
          this.modelS.impersonatedUser = data.user;
          this.auth.setSession('impersonate', data);
          this.router.navigate(['/dashboard']);
        } else {
          this.modelS.isImpersonated = false;
          this.modelS.impersonatedToken = '';
          this.modelS.impersonatedUser = {};
          this.auth.removeSession('impersonate');
        }
        this.ngxService.stop();
      },
      (err) => {
        this.ngxService.stop();
        this.modelS.isImpersonated = false;
        this.modelS.impersonatedToken = '';
        this.modelS.impersonatedUser = {};
        console.log('Login err:: ', err);
        this.auth.removeSession('impersonate');
        this.api.showToast('error', err.error.error);
      }
    );
  }

  paginate(event) {
    console.log('Event:: ', event);
    this.page = event;
    this.getUsers();
  }
}
