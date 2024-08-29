import { Component, OnInit, HostListener } from '@angular/core';
import { LoginService } from './services/login.service';
import { TokenService } from './services/token.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  private mouseActivityTimer: any;
  private inactiveTimeout: number = 20 * 60 * 60 * 1000; // 20 hours

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginService.getIsLoggedIn().subscribe((value) => {
      this.isLoggedIn = value;
      this.cd.detectChanges();
    });

    this.tokenService.getToken() ? this.tokenService.setIsLoggedIn(true) : this.tokenService.setIsLoggedIn(false);

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.startMouseActivityTimer();
    }
  }

  startMouseActivityTimer(): void {
    this.mouseActivityTimer = setTimeout(() => {
      this.openModal();
    }, this.inactiveTimeout);
  }

  resetMouseActivityTimer(): void {
    clearTimeout(this.mouseActivityTimer);
    this.startMouseActivityTimer();
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {
    if (this.isLoggedIn) {
      this.resetMouseActivityTimer();
    }
  }

  openModal(): void {
    // Open inactivity modal logic here
  }
}
----------------------------------------------------------------
  <div *ngIf="!isLoggedIn">
  <app-login></app-login>
</div>
<div *ngIf="isLoggedIn">
  <app-side-nav></app-side-nav>
  <router-outlet></router-outlet>
</div>
-----------------------------------------------------------------
  import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { TokenService } from '../services/token.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FooterComponent, CommonModule]
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  loggedin(): void {
    if (this.tokenService.getToken()) {
      this.loginService.setIsLoggedIn(true);
    } else {
      this.loginService.setIsLoggedIn(false);
      this.tokenService.login(); // Redirects to SSO login page
    }
  }

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.queryParams['token'];
    if (token) {
      this.tokenService.setToken(token);
      this.loginService.setIsLoggedIn(true);
    } else {
      this.loginService.setIsLoggedIn(false);
    }
  }
}
------------------------------------------------------------------------------------------------------------------------------------------
  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isLoggedIn: Subject<boolean> = new Subject<boolean>();

  constructor(public http: HttpClient, public router: Router) {}

  setIsLoggedIn(value: boolean): void {
    this.isLoggedIn.next(value);
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  canActivate(): boolean {
    if (this.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
------------------------------------------------------------------------------------------------------------------------------
  import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string = '';
  claims: any = {};

  setToken(token: string): void {
    if (token) {
      this.token = token;
      localStorage.setItem('token', token);
      this.claims = this.parseJwt(token);
    } else {
      clearTimeout(this.timer);
      localStorage.clear();
    }
  }

  getToken(): string | null {
    return this.token ? this.token : localStorage.getItem('token');
  }

  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  login(): void {
    window.location.href = 'https://your-sso-login-url';
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem('token');
  }

  getClaims(): any {
    return this.claims;
  }
}

  
