import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { SharedModule } from '../shared/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [SignupComponent, SigninComponent, ForgotPasswordComponent, ResetPasswordComponent],
  entryComponents: [SignupComponent, SigninComponent, ForgotPasswordComponent],
  imports: [CommonModule, SharedModule],
  exports: [SignupComponent, SigninComponent, ForgotPasswordComponent],
})
export class AuthModule {}
