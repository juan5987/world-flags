import { computed, inject, Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../../config/auth-config';
import { UserService } from '../api/user.service';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  readonly #showUsernameModal = signal(false);
  readonly showUsernameModal = computed(() => this.#showUsernameModal());
  #oAuthService = inject(OAuthService);
  #profile = signal<any>(null);
  #userService = inject(UserService);
  #username = signal<string>('');
  readonly username = computed(() => this.#username());
  #bestScore = signal<number>(0);
  readonly bestScore = computed(() => this.#bestScore());

  constructor() {
    this.initConfiguration();
  }

  public initAfterRedirect() {
    this.#oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.#oAuthService.hasValidIdToken()) {
        const claims = this.#oAuthService.getIdentityClaims();
        this.#profile.set(claims);

        this.#userService.getUserByGoogleId(this.#profile()?.sub).subscribe({
          next: (user: User | null) => {
            if (user) {
              console.log('GoogleAuthService - User found');
              this.#showUsernameModal.set(false);
              this.#username.set(user.username);
              this.#bestScore.set(user.bestScore);
            } else {
              console.log(
                'GoogleAuthService - First time login, user must create a username'
              );
              this.#showUsernameModal.set(true);
            }
          },
          error: (error) => {
            console.error('GoogleAuthService - Error fetching user:', error);
            this.#showUsernameModal.set(true);
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
    this.#profile.set(null);
  }

  public getProfile() {
    return this.#profile();
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
    this.#showUsernameModal.set(value);
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
}
