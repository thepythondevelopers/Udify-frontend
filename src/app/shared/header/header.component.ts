import { Component, Input, OnInit } from '@angular/core';
import {
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthGuard } from 'src/app/services/auth.guard';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() isAuth: boolean;
  currentPage: any = '/home';
  // isAuth: boolean = false;
  isAdmin: boolean = true;
  isMenu: boolean = false;
  isVendor: boolean = true;

  constructor(private router: Router, private auth: AuthService) {
    // this.router.events
    // .pipe(filter((event) => event instanceof NavigationStart))
    // .subscribe((event: NavigationEvent) => {
    //   if(event) {
    //     this.currentPage = event['url']
    //   }
    //   // this.isAuth = this.auth.getAuthStatus();
    // });
  }

  ngOnInit(): void {}

  goToDashboard() {
    let isImpersonated: boolean = this.auth.getSession('impersonate');
    if (isImpersonated) {
      this.router.navigateByUrl('/dashboard');
    }

    this.isAdmin = this.auth.isAdminLogin();
    if (this.isAdmin) {
      this.router.navigateByUrl('/admin');
    } else {
      this.isVendor = this.auth.isVendorLogin();
      if (this.isVendor) {
        this.router.navigateByUrl('/vendor');
      } else {
        this.router.navigateByUrl('/dashboard');
      }
    }
  }
}
