import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationRequest } from '../common/authentication-request';
import { AuthenticationResponse } from '../common/authentication-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  authenticateUser(authRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.httpClient.post<AuthenticationResponse>(`${this.baseUrl}/v1/auth/login`, authRequest).pipe(
      catchError((error: any) => {
        const errorObj = {
          statusCode: error.status,
          message: error.error.message
        }
        return throwError(() => errorObj);
      })
    );
  }
}
