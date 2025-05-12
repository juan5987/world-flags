import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isLoggedIn = false;

  constructor() { }

  public login() {
    this.isLoggedIn = true;
  }

  public logout() {
    this.isLoggedIn = false;
  }

  public isUserLoggedIn() {
    return this.isLoggedIn;
  }
}
