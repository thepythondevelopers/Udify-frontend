import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // url: any = 'https://system.udify.io/api/';
  url: any = environment.url;
  fileUrl: any = environment.fileurl;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  showToast(status: any, message: any) {
    this.toastr[status](message, status, {
      timeOut: 6000,
      progressBar: true,
      closeButton: true,
    });
  }

  setAuthStatus(user: any) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user.user));
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  setSession(title: any, data: any) {
    sessionStorage.setItem(title, JSON.stringify(data));
  }

  getSession(title: any) {
    let session = JSON.parse(sessionStorage.getItem(title));
    if (session && session !== null) {
      return session;
    }
    return false;
  }

  removeSession(title: any) {
    sessionStorage.removeItem(title);
  }

  getAuthStatus() {
    let token: any = localStorage.getItem('token');
    if (token && token !== null) {
      return true;
    }
    return false;
  }

  isCustomerLogin() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    console.log('isCustomerLogin user:: ', user)
    if (
      user &&
      user !== null &&
      user.access_group == 'user'
    ) {
      return true;
    }
    return false;
  }

  isAdminLogin() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    if (
      user &&
      user !== null &&
      user.access_group == 'admin'
    ) {
      return true;
    }
    return false;
  }

  isVendorLogin() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    if (
      user &&
      user !== null &&
      user.access_group == "supplier"
    ) {
      return true;
    }
    return false;
  }

  getAuthToken() {
    let token: any = localStorage.getItem('token');
    if (token && token !== null) {
      return token;
    }
    return '';
  }

  getAuthUser() {
    let user: any = JSON.parse(localStorage.getItem('user'));
    if (user && user !== null) {
      return user;
    }
    return {};
  }

  logout() {
    this.http.post(this.url + "authentication-node/user-status",localStorage.getItem("token"),{}).subscribe(res=>{
      console.log("res from status::",res);
    });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }

  get(endpoint: any, data: any) {
    return this.http.get(this.url + endpoint, data);
    // return this.http.get(endpoint, data);
  }

  post(endpoint: any, data: any) {
    return this.http.post(this.url + endpoint, data);
    // return this.http.post(endpoint, data);
  }
}
