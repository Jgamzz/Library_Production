import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = '/api/books';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  criar(bookDto: any, image: File): Observable<any> {
    const formData = new FormData();
    // Converte o objeto para String JSON igual ao @RequestPart do seu Java
    formData.append('bookDto', JSON.stringify(bookDto));
    formData.append('image', image);

    return this.http.post<any>(this.apiUrl, formData, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
