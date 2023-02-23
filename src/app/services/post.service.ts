import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../common/api-response';
import { Post } from '../common/post';
import { PostResponse } from '../common/post-response';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  fetchAllPosts(pageNumber: number, pageSize: number, sortBy: string, sortDir: string): Observable<PostResponse> {
    const url = `${this.baseUrl}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
    return this.httpClient.get<PostResponse>(url);
  }

  searchPosts(keyword: string, pageNumber: number, pageSize: number): Observable<PostResponse> {
    const url = `${this.baseUrl}/keyword/${keyword}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.httpClient.get<PostResponse>(url);
  }

  fetchPostsByCategory(categoryId: number, pageNumber: number, pageSize: number): Observable<PostResponse> {
    const url = `${this.baseUrl}/category/${categoryId}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.httpClient.get<PostResponse>(url);
  }

  fetchPostById(postId: number): Observable<Post> {
    const url = `${this.baseUrl}/posts/${postId}`;
    return this.httpClient.get<Post>(url);
  }

  fetchPostsByUser(userId: number, pageNumber: number, pageSize: number): Observable<PostResponse> {
    const url = `${this.baseUrl}/user/${userId}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.httpClient.get<PostResponse>(url);
  }

  createPost(userId: number, categoryId: number, post: Post, token: string): Observable<Post> {
    const url = `${this.baseUrl}/user/${userId}/category/${categoryId}/posts`;
    const headers = new HttpHeaders({ 'content-type': 'application/json', 'Authorization': `Bearer ${token}` });
    return this.httpClient.post<Post>(url, post, { headers: headers });
  }

  uploadImage(postId: number, uploadedImage: File, token: string): Observable<Post> {
    const url = `${this.baseUrl}/post/image/upload/${postId}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const imageFormData = new FormData();
    imageFormData.append('image', uploadedImage);
    return this.httpClient.post<Post>(url, imageFormData, { headers: headers });
  }

  deletePost(postId: number, token: string): Observable<ApiResponse> {
    const headers = new HttpHeaders({ 'content-type': 'application/json', 'Authorization': `Bearer ${token}` });
    const url = `${this.baseUrl}/posts/${postId}`;
    return this.httpClient.delete<ApiResponse>(url, { headers: headers });
  }

  updatePost(postId: number, updatedPost: Post, token: string): Observable<Post> {
    const headers = new HttpHeaders({ 'content-type': 'application/json', 'Authorization': `Bearer ${token}` });
    const url = `${this.baseUrl}/posts/${postId}`;
    return this.httpClient.put<Post>(url, updatedPost, { headers: headers });
  }
}
