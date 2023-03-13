import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public api: ApiService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // account_id: ['5', [Validators.required]],
      notification_email_list: ['0', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  register() {
    if (this.registerForm.valid) {
      this.ngxService.start();

      console.log('Register Form Value:: ', this.registerForm.value);
      // this.auth.post('auth/signup', this.registerForm.value).subscribe(
      this.auth.post('authentication-node/user-sign-up', this.registerForm.value).subscribe(
        (res) => {
          this.ngxService.stop();
          console.log('Register res:: ', res);
          this.auth.showToast('success', 'Sign Up Successfully.');
          this.router.navigateByUrl('/signin');
        },
        (err) => {
          this.ngxService.stop();
          console.log('Register err:: ', err);
          // if(Array.isArray(err.error)) {
          //   for (let i = 0; i < err.error.error.length; i++) {
          //     this.auth.showToast('error', err.error.error[i].msg);
          //   }
          // } else {
          //   this.auth.showToast('error', err.error.error);
          // }
        }
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  signup() {
    this.router.navigateByUrl('/signup');
  }
}
