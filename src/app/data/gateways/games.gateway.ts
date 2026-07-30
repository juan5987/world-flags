import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatedGame, EndGameResult } from '../../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GamesGateway {
  readonly #http = inject(HttpClient);

  public createGame(): Observable<CreatedGame> {
    return this.#http.post<CreatedGame>('api/games', {});
  }

  public endGame(id: string, score: number): Observable<EndGameResult> {
    return this.#http.post<EndGameResult>(`api/games/${id}/end`, { score });
  }
}
