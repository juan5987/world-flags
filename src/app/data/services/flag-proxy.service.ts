import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlagProxyService {
  constructor(private http: HttpClient) {}

  getFlagAsBase64(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      switchMap((blob: Blob) => {
        return from(
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          })
        );
      })
    );
  }
}
