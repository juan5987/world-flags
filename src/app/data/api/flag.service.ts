import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Flag } from '../../models/flag.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FlagService {
  readonly #http = inject(HttpClient);

  public getAllFlags(): Observable<Flag[]> {
    return this.#http.get<Flag[]>('api/flags');
  }

  public getFlagsByLevel(level: number): Observable<Flag[]> {
    return this.#http.get<Flag[]>(`api/flags?level=${level}`);
  }
}
