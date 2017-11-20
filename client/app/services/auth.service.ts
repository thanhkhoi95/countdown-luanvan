import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

import { UserService } from '../services/user.service';

@Injectable()
export class AuthService {
    loggedIn = false;
    isAdmin = false;
    isStaff = false;
    isTable = false;
    isKitchen = false;

    jwtHelper: JwtHelper = new JwtHelper();

    currentUser = { _id: '', username: '', role: '' };

    constructor(private userService: UserService,
        private router: Router) {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = this.decodeUserFromToken(token);
            this.setCurrentUser(decodedUser);
        }
    }

    login(emailAndPassword) {
        return this.userService.login(emailAndPassword).map(
            res => {
                localStorage.setItem('token', res.data.token);
                const decodedUser = this.decodeUserFromToken(res.data.token);
                this.setCurrentUser(decodedUser);
                return this.loggedIn;
            }
            );
    }

    logout() {
        localStorage.removeItem('token');
        this.loggedIn = false;
        this.isAdmin = false;
        this.currentUser = { _id: '', username: '', role: '' };
        this.router.navigate(['/login']);
    }

    decodeUserFromToken(token) {
        return this.jwtHelper.decodeToken(token);
    }

    setCurrentUser(decodedUser) {
        this.loggedIn = true;
        this.currentUser._id = decodedUser._id;
        this.currentUser.username = decodedUser.username;
        this.currentUser.role = decodedUser.role;
        decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
        decodedUser.role === 'staff' ? this.isStaff = true : this.isStaff = false;
        decodedUser.role === 'table' ? this.isTable = true : this.isTable = false;
        decodedUser.role === 'kitchen' ? this.isKitchen = true : this.isKitchen = false;
        delete decodedUser.role;
    }

}
