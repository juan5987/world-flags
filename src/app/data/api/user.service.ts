import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { User } from "../../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    public getUser(id: string): Observable<User> {
        return this.http.get<User>(`api/users/${id}`);
    }

    public getUserByGoogleId(googleId: string): Observable<User | null> {
        return this.http.get<User[]>(`api/users?userId=${googleId}`).pipe(
            map(users => users[0] || null)
        );
    }

    public createUser(user: User): Observable<User> {
        return this.http.post<User>(`api/users`, user);
    }

    public updateUser(user: User): Observable<User> {
        return this.http.put<User>(`api/users/${user.userId}`, user);
    }

    public deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`api/users/${id}`);
    }

    public getTop10Users(): Observable<User[]> {
        return this.http.get<User[]>(`api/users/top-10`);
    }
}