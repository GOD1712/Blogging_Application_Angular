import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../common/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  addComment(comment: Comment, postId: number, userId: number, token: string): Observable<Comment> {
    const url = `${this.baseUrl}/post/${postId}/user/${userId}/comment`;
    const headers = new HttpHeaders({ 'content-type': 'application/json', 'Authorization': `Bearer ${token}` });
    return this.httpClient.post<Comment>(url, comment, { headers: headers });
  }
}
