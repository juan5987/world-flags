import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGateway {
  readonly #http = inject(HttpClient);

  public exchangeGoogleIdToken(idToken: string): Observable<AuthResponse> {
    return this.#http.post<AuthResponse>('api/auth/google', { idToken });
  }
}
