import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Flag } from "../../models/flag.model";

@Injectable({
    providedIn: 'root'
})
export class FlagService {

    constructor(private http: HttpClient) {}

    getAllFlags() {
        return this.http.get<Flag[]>('api/flags');
    }
}

