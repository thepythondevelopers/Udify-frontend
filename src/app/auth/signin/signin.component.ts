import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '../auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  Router,
  NavigationStart,
  Event as NavigationEvent,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
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

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEvent) => {
        if (event) {
          if (event['url'] == '/admin/login') {
            this.adminLogin = true;
          } else {
            this.adminLogin = false;
          }
        } else {
          this.adminLogin = false;
        }
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
      if(this.adminLogin) {
        params.role= 'admin';
      }
      // this.auth.post('auth/login', this.loginForm.value).subscribe(
      this.auth.post(this.adminLogin ? 'authentication-node/admin-sign-in' : 'authentication-node/user-sign-in', params).subscribe(
        (res: any) => {
          console.log('Login res:: ', res);
          if (res.user) {
            // this.auth.showToast('success', 'Logged In Successfully.');
            this.auth.setAuthStatus(res);
            if(this.adminLogin) {
              // if(res.user.access_group && res.user.access_group == 'admin') {
                this.router.navigateByUrl('/admin');
              // } else {
              //   this.router.navigateByUrl('/dashboard');
              // }
            } else {
              this.router.navigateByUrl('/dashboard');
            }
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
    this.router.navigateByUrl('/signup');
  }
}
