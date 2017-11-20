import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthGuardLayout implements CanActivate {

    constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) { }

    canActivate() {
        if (!this.auth.loggedIn) {
            this.router.navigate(['/login']);
        }
        return this.auth.loggedIn;
    }

}
