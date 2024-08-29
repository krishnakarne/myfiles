import { Injectable } from '@angular/core';
import { TokenClaims } from './tokenClaims.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string = '';
  claims: TokenClaims = {
    nameID: '',
    exp: 0,
    firstName: 'no user',
    lastName: 'no user',
    email: 'no user',
    afkReplyTime: 0,
    afkCheckTime: 0
  };
  timer: any = null;

  setToken(token: string) {
    if (token && token.trim() !== '') {
      this.token = token;
      localStorage.setItem('token', token);
      this.claims = this.parseJwt(token);
      console.log('Token set in localStorage:', token);
    } else {
      console.warn('Invalid token, not setting or clearing localStorage.');
    }
  }

  getToken() {
    if (this.token) {
      return this.token;
    } else {
      return localStorage.getItem('token');
    }
  }

  parseJwt(token: string): TokenClaims | null {
    try {
      return JSON.parse(this.b64DecodeUnicode(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch (ex) {
      console.error('Error parsing token:', ex);
      return null;
    }
  }

  private b64DecodeUnicode(str: string): string {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  getClaims() {
    if (this.token) {
      return this.parseJwt(this.token);
    } else if (localStorage.getItem('token')) {
      return this.parseJwt(localStorage.getItem('token')!);
    } else {
      return this.claims;
    }
  }

  login() {
    window.location.href = 'https://sso-service.apps.sov01.sov.dev.mx1.paas.cloudcenter.corp/saml/login';
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem('token');
    const currentPath = window.location.pathname;
    localStorage.setItem('path', currentPath);
    window.location.href = '/login';
  }
}
