import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { MatIconModule } from '@angular/material/icon';
import { SiteModule } from './site/site.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppHttpInterceptor } from './AppHttpInterceptor';
import { LoaderComponent } from './shared/loader/loader.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { PaymentComponent } from './shared/payment/payment.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminModule } from './admin/admin.module';
import { CookieService } from 'ngx-cookie-service';
import { VendorModule } from './vendor/vendor.module';
import { ChargeComponent } from './shared/charge/charge.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    PaymentComponent,
    PageNotFoundComponent,
    ChargeComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'udify-session',
      headerName: 'udify12'
    }),
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    SiteModule,
    AuthModule,
    SharedModule,
    DashboardModule,
    AdminModule,
    VendorModule
  ],
  providers: [
    CookieService,
    {
      // provide: NZ_I18N,
      // useValue: en_US,
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
    { provide: NZ_I18N, useValue: en_US },
    // { provide: 'XSRF-TOKEN', useValue: 'IntcInVzZXJcIjogXCJjZDBhNjdhYTRiNTk0NmRmODFhNDhjYzYzMTAwZDRhYlwifSI.FYuhtQ.eOGQMLONBv4BwnkgFmNi376d9H0; Path=/; Expires=Thu, 15 Jun 2023 17:20:09 GMT' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
