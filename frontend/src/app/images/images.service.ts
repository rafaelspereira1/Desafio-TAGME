import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageService {
  constructor(private http: HttpClient) {}

  uploadImage(base64: string): Observable<any> {
    // Backend expects { title, description, square } and image file
    // For demo, send base64 as 'image' field
    return this.http.post('/images', {
      title: 'Imagem enviada',
      description: '',
      square: true,
      image: base64,
    });
  }

  getImages(params: {
    page: number;
    limit: number;
    filter?: string;
    orderBy?: string;
    order?: string;
  }): Observable<any> {
    return this.http.get('/images', { params });
  }

  deleteImage(id: string): Observable<any> {
    return this.http.delete(`/images/${id}`);
  }

  // ... will implement CRUD, filter, order, paginate methods
}
