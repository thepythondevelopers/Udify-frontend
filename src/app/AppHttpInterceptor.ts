import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { ApiService } from './services/api.service';
import { catchError, delay, finalize } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  token: string = '';
  user: any = {};
  constructor(
    private authS: AuthService,
    public api: ApiService,
    private modal: NzModalService,
    private cookieService: CookieService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.api.isVisible = true;
    this.token = this.authS.getAuthToken();
    this.user = this.authS.getAuthUser();
    let headr: any = {};
    let isImpersonated: any = this.authS.getSession('impersonate');
    console.log('Impersonted:: ', isImpersonated);
    if (isImpersonated) {
      this.token = isImpersonated.token;
    }
    if (this.token.length) {
      headr['x-access-token'] = this.token;
    }
    if (
      Object.keys(this.user).length &&
      this.user.hasOwnProperty('account_id')
    ) {
      headr['X-Udify-Account-Id'] = this.user['account_id'];
    }
    let hdr = new HttpHeaders(headr);
    const authReq = req.clone({
      headers: hdr,
    });
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.log('This is client side error');
          errorMsg = `Error: ${error.error.message}`;
        } else {
          console.log('This is server side error', error.message);
          let message: any = '';
          if (Array.isArray(error.error)) {
            for (let i = 0; i < error.error['error'].length; i++) {
              message = error.error['error'][i].msg;
            }
          } else {
            message = error.error.error;
          }
          errorMsg = `Error Code: ${error.status},  Message: ${message}`;
          if (error.statusText.toLowerCase() == 'unauthorized') {
            this.authS.logout();
            this.modal.closeAll();
          }
          // this.authS.showToast('error', errorMsg);
        }
        console.log(errorMsg);
        return throwError(error);
      }),
      // delay(5000),
      finalize(() => (this.api.isVisible = false))
    );
  }
}
