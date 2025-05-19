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

  public user = signal<User | null>(null);
  public showUsernameModal = signal(false);

  constructor() {
    this.initConfiguration();
  }

  public initAfterRedirect() {
    this.#oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.#oAuthService.hasValidIdToken()) {
        const claims = this.#oAuthService.getIdentityClaims();

        this.#userService.getUserByGoogleId(claims['sub']).subscribe({
          next: (user: User | null) => {
            if (user) {
              console.log('GoogleAuthService - User found');
              this.user.set(user);
              this.showUsernameModal.set(false);
            } else {
              console.log(
                'GoogleAuthService - First time login, user must create a username'
              );
              this.user.set({
                userId: claims['sub'],
                googleId: claims['sub'],
                email: claims['email'],
                username: '',
                bestScore: 0,
                bestScoreDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
              } as User);
              this.showUsernameModal.set(true);
            }
          },
          error: (error) => {
            console.error('GoogleAuthService - Error fetching user:', error);
            this.showUsernameModal.set(true);
          },
        });
      }
    });
  }

  public login() {
    this.#oAuthService.initImplicitFlow();
  }

  public logout() {
    this.#oAuthService.revokeTokenAndLogout();
    this.#oAuthService.logOut();
    this.user.set(null);
    console.log('GoogleAuthService - Logged out');
  }

  public getProfile() {
    return this.user();
  }

  public createUser(username: string) {
    this.#userService
      .createUser({
        userId: this.getProfile()?.googleId || '',
        bestScore: 0,
        bestScoreDate: new Date(),
        username: username,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        googleId: this.getProfile()?.googleId || '',
        email: this.getProfile()?.email || '',
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
        this.initAfterRedirect();
      }
    });
  }
}
