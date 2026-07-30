import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OAuthService } from 'angular-oauth2-oidc';
import { getAuthConfig } from '../../config/auth-config';
import { AuthResponse } from '../../models/auth.model';
import { User } from '../../models/user.model';
import { UserService } from '../api/user.service';
import { AuthGateway } from '../gateways/auth.gateway';
import { AuthTokenStore } from './auth-token-store';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  #oAuthService = inject(OAuthService);
  #userService = inject(UserService);
  #authGateway = inject(AuthGateway);
  #authTokenStore = inject(AuthTokenStore);
  #destroyRef = inject(DestroyRef);

  public user = signal<User | null>(null);
  public showUsernameModal = signal(false);

  constructor() {
    this.initConfiguration();
  }

  public initAfterRedirect() {
    console.log('👉 initAfterRedirect called');
    const idToken = this.#oAuthService.getIdToken();
    console.log('idToken:', idToken?.substring(0, 20) + '...');

    this.#authGateway
      .exchangeGoogleIdToken(idToken)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response: AuthResponse) => {
          this.#authTokenStore.set(response.accessToken);
          this.user.set(response.user);
          // Le serveur assigne toujours un username (name/email Google) à l'upsert.
          // Le modal ne s'affiche que si l'utilisateur n'en a pas encore choisi un.
          this.showUsernameModal.set(!response.user.username);
        },
        error: (error) => {
          console.error('GoogleAuthService - Error exchanging id_token:', error);
          this.showUsernameModal.set(true);
        },
      });
  }

  public login() {
    this.#oAuthService.initImplicitFlow();
  }

  public logout() {
    // logOut() nettoie le stockage local de façon synchrone et fiable.
    // On évite revokeTokenAndLogout() (async, peu robuste avec Google OIDC)
    // pour garantir que l'utilisateur est déconnecté de l'app quoi qu'il arrive.
    this.#oAuthService.logOut();
    this.#authTokenStore.clear();
    this.user.set(null);
    this.showUsernameModal.set(false);
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
      .pipe(takeUntilDestroyed(this.#destroyRef))
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
    const config = getAuthConfig();
    console.log('GoogleAuthService - initConfiguration started');
    this.#oAuthService.configure(config);

    const idTokenFromUrl = this.extractIdTokenFromUrl();
    if (idTokenFromUrl) {
      console.log('✅ Found id_token in URL fragment, using it directly');
      this.#authGateway
        .exchangeGoogleIdToken(idTokenFromUrl)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (response: AuthResponse) => {
            console.log('✅ Backend exchange successful');
            this.#authTokenStore.set(response.accessToken);
            this.user.set(response.user);
            this.showUsernameModal.set(!response.user.username);
            window.history.replaceState(null, '', window.location.pathname);
          },
          error: (error) => {
            console.error('GoogleAuthService - Error exchanging id_token:', error);
            this.showUsernameModal.set(true);
          },
        });
    } else {
      this.#oAuthService
        .loadDiscoveryDocumentAndTryLogin()
        .then(() => {
          if (this.#oAuthService.hasValidIdToken()) {
            this.initAfterRedirect();
            this.#oAuthService.setupAutomaticSilentRefresh();
          }
        })
        .catch((err) => {
          console.error('GoogleAuthService - loadDiscoveryDocumentAndTryLogin failed:', err);
        });
    }
  }

  private extractIdTokenFromUrl(): string | null {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    return params.get('id_token');
  }
}
