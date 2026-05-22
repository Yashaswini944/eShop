import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, UrlTree, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && user.role === 'Admin') {
          return true;
        } else {
          if (!user) {
            this.router.navigate(['/account/login']);
          } else {
            this.router.navigate(['/']);
          }
          return false;
        }
      })
    );
  }
}