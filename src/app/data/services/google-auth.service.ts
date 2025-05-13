import { computed, inject, Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../config/auth-config';
import { AuthService } from './auth.service';
import { UserService } from '../api/user.service';

@Injectable({
  providedIn: 'root'
})

export class GoogleAuthService {
  public showUsernameModal = computed(() => this.getProfile()?.name === null);

  #oAuthService = inject(OAuthService);
  #profile = signal<any>(null);
  #userService = inject(UserService);
  
  constructor() {
    this.initConfiguration();
  }

  private initConfiguration() {
    this.#oAuthService.configure(authConfig);
    this.#oAuthService.setupAutomaticSilentRefresh();
    this.#oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {

      if (this.#oAuthService.hasValidIdToken()) {
        this.#profile.set(this.#oAuthService.getIdentityClaims());
      }
    });
  }

  public login() {
    this.#oAuthService.initImplicitFlow();
  }

  public logout() {
    this.#oAuthService.revokeTokenAndLogout();
    this.#oAuthService.logOut();
    this.#profile.set(null);
  }

  public getProfile() {
    return this.#profile();
  }

  public createUser(username: string) {
    this.#userService.createUser({
      userId: this.getProfile()?.sub,
      bestScore: 0,
      bestScoreDate: new Date(),
      username: username,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      googleId: this.getProfile()?.sub,
      email: this.getProfile()?.email,
    });
  }
}
