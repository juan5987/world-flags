import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'accessToken';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenStore {
  readonly #accessToken = signal<string | null>(this.readFromStorage());

  public readonly token = this.#accessToken.asReadonly();

  public set(accessToken: string): void {
    this.#accessToken.set(accessToken);
    localStorage.setItem(STORAGE_KEY, accessToken);
  }

  public clear(): void {
    this.#accessToken.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private readFromStorage(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }
}
