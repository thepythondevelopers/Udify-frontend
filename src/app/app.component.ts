import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'udifyApp';
  showHeader: boolean = true;
  showFooter: boolean = true;
  isAuth: boolean = false;
  constructor(
    private router: Router,
    private auth: AuthService,
    public api: ApiService,
    private cookieService: CookieService
  ) {

    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationEvent) => {
        this.isAuth = this.auth.getAuthStatus();
        if (event) {
          console.log('URL:: ', event['url']);
          if (
            event['url'] == '/signin' ||
            event['url'] == '/signup' ||
            event['url'] == '/forgot-password' ||
            event['url'] == '/reset-password' ||

            event['url'] == '/admin/login' ||
            event['url'] == '/admin/forgot-password' ||

            event['url'].indexOf('reset-password') > -1 ||
            event['url'].indexOf('dashboard') > -1 ||
            event['url'].indexOf('admin') > -1 || 
            event['url'].indexOf('vendor') > -1
          ) {
            this.showHeader = false;
            this.showFooter = false;
          } else {
            this.showHeader = true;
            this.showFooter = true;
          }
          if (
            event['url'] == '/signin' ||
            event['url'] == '/signup' ||
            event['url'] == '/forgot-password' ||
            event['url'] == '/reset-password' || 

            event['url'] == '/admin/login' ||
            event['url'] == '/admin/forgot-password'
          ) {
            let isAuthenticated: boolean = this.auth.getAuthStatus();
            if (isAuthenticated) {
              this.router.navigate(['/dashboard']);
            }
          }
        } else {
          this.showHeader = true;
          this.showFooter = true;
        }
      });
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {
    let isAuthenticated: boolean = this.auth.getAuthStatus();
    if (isAuthenticated) {
      this.api.get('profile-node/get-profile', {}).subscribe(async (data: any) => {
        if (data.hasOwnProperty('error')) {
          return false;
        }
        if (data.hasOwnProperty('email')) {
          this.auth.setUser(data);
        }
      });
    }
  }
}
