import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NzModalService } from 'ng-zorro-antd/modal';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth/auth.service';
declare var $: any;
declare var Swal: any;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  isVisible: boolean = false;
  // url: any = 'https://system.udify.io/api/';
  // fileUrl: any = 'https://system.udify.io/';

  // url: any = 'https://udifyapi.pamsar.com/';
  // fileUrl: any = 'https://udifyapi.pamsar.com/';

  url: any = environment.url;
  fileUrl: any = environment.fileurl;

  loaderType = 'square-jelly-box';
  loaderColor = '#46bfa8';
  httpOptions: any;
  isUserOrders: boolean = false;
  isManualProducts: boolean = false;
  // authS: any;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NzModalService,
    private authS: AuthService,
    private cookieService: CookieService,
    private injector: Injector
  ) {
    // this.authS = this.injector.get(AuthService);
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };
  }

  fromNow(date: any) {
    return moment(date).fromNow();
  }

  showToast(status: any, message: any) {
    this.toastr[status](message, '', {
      timeOut: 6000,
      progressBar: true,
      closeButton: true,
    });
  }

  showSwal(status: any, message: any) {
    Swal.fire({
      title: status,
      text: message,
      icon: status.toLowerCase(),
      confirmButtonText: 'Ok'
    })
  }

  showLoader() {
    this.isVisible = true;
  }

  get(endpoint: any, data: any) {
    console.log("profile end point::",endpoint);
    console.log("data from get profile::",data);
    return this.http.get(this.url + endpoint, { params: data });
  }

  post(endpoint: any, data: any) {
    return this.http.post(this.url + endpoint, data);
  }

  delete(endpoint: any, data: any) {
    return this.http.delete(this.url + endpoint, data);
  }

  getByUrl(url: any, data: any) {
    console.log('GET data:: ', data);
    return this.http.get(url, { params: data });
  }
}
