import { inject, Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../config/auth-config';
import { User } from '../../models/user.model';
import { UserService } from '../api/user.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  #oAuthService = inject(OAuthService);
  #userService = inject(UserService);

  public username = signal<string>('');
  public profile = signal<any>(null);
  public bestScore = signal<number>(0);
  public showUsernameModal = signal(false);

  constructor() {
    this.initConfiguration();
  }

  public initAfterRedirect() {
    this.#oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.#oAuthService.hasValidIdToken()) {
        const claims = this.#oAuthService.getIdentityClaims();
        this.profile.set(claims);

        this.#userService.getUserByGoogleId(this.profile()?.sub).subscribe({
          next: (user: User | null) => {
            if (user) {
              console.log('GoogleAuthService - User found');
              this.showUsernameModal.set(false);
              this.username.set(user.username);
              this.bestScore.set(user.bestScore);
            } else {
              console.log(
                'GoogleAuthService - First time login, user must create a username'
              );
              this.showUsernameModal.set(true);
            }
          },
          error: (error) => {
            console.error('GoogleAuthService - Error fetching user:', error);
            this.showUsernameModal.set(true);
          },
        });
      } else {
        console.error('GoogleAuthService - No valid token');
      }
    });
  }

  public login() {
    this.#oAuthService.initImplicitFlow();
  }

  public logout() {
    this.#oAuthService.revokeTokenAndLogout();
    this.#oAuthService.logOut();
    this.profile.set(null);
  }

  public getProfile() {
    return this.profile();
  }

  public createUser(username: string) {
    this.#userService
      .createUser({
        userId: this.getProfile()?.sub,
        bestScore: 0,
        bestScoreDate: new Date(),
        username: username,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        googleId: this.getProfile()?.sub,
        email: this.getProfile()?.email,
      })
      .subscribe({
        next: () => {
          this.setShowUsernameModal(false);
        },
        error: (error) => {
          console.error('GoogleAuthService - Error creating user:', error);
        },
      });
  }

  public setShowUsernameModal(value: boolean) {
    this.showUsernameModal.set(value);
  }

  private initConfiguration() {
    this.#oAuthService.configure(authConfig);
    this.#oAuthService.setupAutomaticSilentRefresh();
    this.#oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.#oAuthService.hasValidIdToken()) {
        this.profile.set(this.#oAuthService.getIdentityClaims());
      }
    });
  }
}
