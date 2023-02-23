import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../common/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl: string = `${environment.apiUrl}/categories/`;

  constructor(private httpClient: HttpClient) { }

  fetchAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.baseUrl);
  }
}
