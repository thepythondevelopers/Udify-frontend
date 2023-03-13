import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '../../auth/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  Router,
  NavigationStart,
  Event as NavigationEvent,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  rememberMe: boolean = false;
  adminLogin: boolean = false;
  au: boolean=false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public api: ApiService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (
      localStorage.getItem('rememberMe') &&
      localStorage.getItem('rememberMe') != null
    ) {
      this.rememberMe = true;
      if (
        localStorage.getItem('rememberMeUser') &&
        localStorage.getItem('rememberMeUser') != null
      ) {
        this.loginForm.patchValue(
          JSON.parse(localStorage.getItem('rememberMeUser'))
        );
      }
    }
  }

  angle_down(){
    this.au=!this.au;
  }

  angle_up(){
    this.au=!this.au;
  }

  login() {
    if (this.loginForm.valid) {
      console.log('Login Form Value:: ', this.loginForm.value);
      if (this.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem(
          'rememberMeUser',
          JSON.stringify(this.loginForm.value)
        );
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberMeUser');
      }
      this.ngxService.start();
      let params: any = this.loginForm.value;
      params.role = 'vendor';
      this.auth.post('authentication-node/supplier-sign-in', params).subscribe(
        (res: any) => {
          console.log('Login res:: ', res);
          if (res.user) {
            this.auth.setAuthStatus(res);
            this.router.navigateByUrl('/vendor');
          } else {
            this.auth.showToast('error', res.error);
          }
          this.ngxService.stop();
        },
        (err) => {
          this.ngxService.stop();
          console.log('Login err:: ', err);
          this.auth.showToast('error', err.error.error);
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  signup() {
    this.router.navigateByUrl('/vendor/register');
  }
}
