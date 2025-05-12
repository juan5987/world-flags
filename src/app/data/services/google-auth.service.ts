import { inject, Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../config/auth-config';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private oAuthService = inject(OAuthService);
  private profile = signal<any>(null);

  constructor() {
    this.initConfiguration();
  }

  private initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {

      if (this.oAuthService.hasValidIdToken()) {
        this.profile.set(this.oAuthService.getIdentityClaims());
      }
    });
  }

  public login() {
    this.oAuthService.initImplicitFlow();
  }

  public logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.profile.set(null);
  }

  public getProfile() {
    return this.profile();
  }
}
