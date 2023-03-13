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
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css'],
})
export class ForgetComponent implements OnInit {
  forgotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public api: ApiService,
    private ngxService: NgxUiLoaderService
  ) {
    this.forgotForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  continue() {
    if (this.forgotForm.valid) {
      this.ngxService.start();
      console.log('Forgot Form Value:: ', this.forgotForm.value);
      this.auth
        .post('authentication-node/forget-password', this.forgotForm.value)
        .subscribe(
          (res: any) => {
            if (res.error) {
              this.auth.showToast('error', res.error);
            } else {
              this.auth.showToast('success', res.message);
              this.forgotForm.reset();
              // this.router.navigateByUrl('/vendor/login/');
              // let url = res.url.split('/');
              // let token = url[url.length - 1];
              // this.router.navigateByUrl('/vendor/reset-password/' + token);
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
      this.forgotForm.markAllAsTouched();
    }
  }
}
