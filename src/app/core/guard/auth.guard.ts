import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor (private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = sessionStorage.getItem('token')

    if (token) {
      if (token.split('.').length === 3) {
        if (this.jwtHelper.isTokenExpired(token)) {
          this.router.navigate(['/login'])
          return false
        } else {
          return true
        }
      } else {
        return false;
      }
    } else {
      this.router.navigate(['/login'])
      return false
    }

  }

}
