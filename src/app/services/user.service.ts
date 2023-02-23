import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../common/api-response';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = `${environment.apiUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  registerUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.baseUrl}/`, user);
  }

  fetchUserByUsername(username: string): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/username/${username}`);
  }

  fetchUserById(userId: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}/${userId}`);
  }

  deleteUser(userId: number, token: string): Observable<ApiResponse> {
    const headers = new HttpHeaders({ 'content-type': 'application/json', 'Authorization': `Bearer ${token}` });
    return this.httpClient.delete<ApiResponse>(`${this.baseUrl}/${userId}`, { headers: headers });
  }

  changePassword(username: string, password: string): Observable<User> {
    const url = `${this.baseUrl}/change-password`;
    return this.httpClient.put<User>(url, { username: username, password: password });
  }

  updateUser(userId: number, user: User, token: string): Observable<User> {
    const headers = new HttpHeaders({ 'content-type': 'application/json', 'Authorization': `Bearer ${token}` });
    const url = `${this.baseUrl}/${userId}`;
    return this.httpClient.put<User>(url, user, { headers: headers });
  }
}
