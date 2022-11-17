import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ControlBienvenidaGuard implements CanActivate {
  control: string = '';

  constructor(private auth: AuthService, private routes: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.control = this.auth.getData('controlInicial')!;

    if (this.control == 'activado') {
      this.routes.navigateByUrl('acceso/login');
      return false;
    } else return true;
  }
}
