import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  private oAuthService = inject(OAuthService); // import OAuthService when created

  private router = inject(Router);

  profile = signal<any>(null);

  constructor() {

    this.initConfiguration();

  }

  initConfiguration() {

    this.oAuthService.configure(authConfig);

    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {

      if (this.oAuthService.hasValidIdToken()) {

        this.profile.set(this.oAuthService.getIdentityClaims());

      }

    });

  }

  login() {

    this.oAuthService.initImplicitFlow();

  }

  logout() {

    this.oAuthService.revokeTokenAndLogout();

    this.oAuthService.logOut();

    this.profile.set(null);

  }

  getProfile() {

    return this.profile();

  }

}
