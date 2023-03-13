import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '../../auth/auth.service';
import {
  Router,
  NavigationStart,
  Event as NavigationEvent,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: any = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public api: ApiService,
    private ngxService: NgxUiLoaderService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    let url = this.router.url.split('/');
    this.token = url[url.length - 1];
  }

  continue() {
    if (this.resetForm.valid) {
      let val: any = this.resetForm.value;
      if(val.password !== val.confirmPassword) {
        console.log('coming here');
        this.auth.showToast('error', 'Your password and confirm password does not match.');
        return false;
      }
      this.ngxService.start();
      console.log('Reset Form Value:: ', this.resetForm.value);
      this.auth
        .post(
          'authentication-node/change-password/' + this.token,
          this.resetForm.value
        )
        .subscribe(
          (res: any) => {
            this.ngxService.stop();
            console.log('Login res:: ', res);
            this.auth.showToast('success', res.message);
            this.router.navigateByUrl('/vendor/login');
          },
          (err) => {
            this.ngxService.stop();
            console.log('Login err:: ', err);
            this.auth.showToast('error', err.error.error);
          }
        );
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
