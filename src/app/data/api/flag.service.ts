import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Flag } from "../../models/flag.model";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class FlagService {

    constructor(private http: HttpClient) {}

    public getAllFlags(): Observable<Flag[]> {
        return this.http.get<Flag[]>('api/flags');
    }
}

