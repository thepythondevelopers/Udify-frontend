import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let isAuthenticated: boolean = this.authService.isVendorLogin();
    if (!isAuthenticated) {
      this.router.navigate(['/vendor/login']);
    }
    let isImpersonated: any = this.authService.getSession('impersonate');
    if(isImpersonated) {
      console.log('Impersonted:: ', isImpersonated);
      return false;
    }
    return isAuthenticated;
  }
  
}
