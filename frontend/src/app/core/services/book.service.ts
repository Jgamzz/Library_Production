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

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  criar(bookDto: any, image: File): Observable<any> {
    const formData = new FormData();
    
    // Transforma o objeto bookDto em um Blob application/json para bater com o @RequestPart do Java
    const jsonBlob = new Blob([JSON.stringify(bookDto)], { type: 'application/json' });
    formData.append('bookDto', jsonBlob);
    
    if (image && image.size > 0) {
      formData.append('image', image);
    }

    return this.http.post<any>(this.apiUrl, formData, { headers: this.getHeaders() });
  }

  // 🎯 ADICIONADO: Método PUT que estava faltando e travando a tela de detalhes!
  atualizar(id: number, bookDto: any, image: File): Observable<any> {
    const formData = new FormData();
    
    const jsonBlob = new Blob([JSON.stringify(bookDto)], { type: 'application/json' });
    formData.append('bookDto', jsonBlob);
    
    // Envia a imagem apenas se um novo arquivo foi selecionado no input
    if (image && image.size > 0) {
      formData.append('image', image);
    }

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}