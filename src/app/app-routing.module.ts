import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BecomePartnerComponent } from './site/become-partner/become-partner.component';
import { HomeComponent } from './site/home/home.component';
import { PlansComponent } from './site/plans/plans.component';
import { SupportComponent } from './site/support/support.component';
import { AuthGuard } from './services/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddTicketComponent } from './site/add-ticket/add-ticket.component';
import { TicketComponent } from './site/ticket/ticket.component';
import { KnowledgebaseComponent } from './site/knowledgebase/knowledgebase.component';
import { LoginComponent } from './vendor/login/login.component';
import { RegisterComponent } from './vendor/register/register.component';
import { ForgetComponent } from './vendor/forget/forget.component';
import { ResetPasswordComponent as resetPasswordComponent } from './vendor/reset-password/reset-password.component';

// CLI imports router

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'become-partner', component: BecomePartnerComponent },
  { path: 'plans', component: PlansComponent },
  { path: 'plan/:type', component: PlansComponent },
  { path: 'support', component: SupportComponent },
  { path: 'support/ticket', component: AddTicketComponent },
  { path: 'support/add', component: AddTicketComponent },
  { path: 'support/edit/:id', component: AddTicketComponent },
  { path: 'support/submit-ticket', component: AddTicketComponent },
  { path: 'support/tickets', component: TicketComponent },
  { path: 'support/ticket/:id', component: TicketComponent },
  { path: 'knowledgebase/:id', component: KnowledgebaseComponent },
  // { path: 'dashboard', component: DashboardComponent },

  { path: 'admin/login', component: SigninComponent },
  { path: 'admin/forgot-password', component: ForgotPasswordComponent },
  { path: 'admin/reset-password/:token', component: ResetPasswordComponent },

  { path: 'vendor/login', component: LoginComponent },
  { path: 'vendor/register', component: RegisterComponent },
  { path: 'vendor/forgot-password', component: ForgetComponent },
  { path: 'vendor/reset-password/:token', component: resetPasswordComponent },


  // { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
