import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { GoogleAuthService } from './google-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private googleAuthService = inject(GoogleAuthService);
  private _isLoggedIn = computed(() => !!this.googleAuthService.getProfile());

  public login(): void {
    this.googleAuthService.login();
  }

  public logout(): void {
    this.googleAuthService.logout();
  }

  public isUserLoggedIn(): boolean {
    return this._isLoggedIn();
  }
}
