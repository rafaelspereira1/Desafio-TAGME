import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImage(
    imageData: string,
    title: string = 'Imagem enviada',
    description: string = ''
  ): Observable<any> {
    try {
      console.log('Original image data input:', {
        type: typeof imageData,
        length: imageData.length,
        preview: imageData.substring(0, 100),
        startsWithData: imageData.startsWith('data:'),
        startsWithBlob: imageData.startsWith('blob:'),
        hasComma: imageData.includes(','),
      });

      if (imageData.startsWith('blob:')) {
        console.log('Detected blob URL, fetching blob data...');
        return new Observable((observer) => {
          fetch(imageData)
            .then((response) => response.blob())
            .then((blob) => {
              console.log('Blob fetched successfully:', {
                size: blob.size,
                type: blob.type,
              });

              const formData = new FormData();
              formData.append('file', blob, 'image.png');
              formData.append('title', title);
              formData.append('description', description);
              formData.append('square', 'true');

              this.http.post(`${this.baseUrl}/images`, formData).subscribe({
                next: (result) => observer.next(result),
                error: (error) => observer.error(error),
                complete: () => observer.complete(),
              });
            })
            .catch((error) => {
              console.error('Error fetching blob:', error);
              observer.error(error);
            });
        });
      }

      let base64Data = imageData;

      if (base64Data.startsWith('data:')) {
        const base64Parts = base64Data.split(',');
        if (base64Parts.length > 1) {
          base64Data = base64Parts[1];
        }
      }

      console.log('Processed base64 data:', {
        length: base64Data.length,
        preview: base64Data.substring(0, 50),
        isValidBase64Chars: /^[A-Za-z0-9+/]*={0,2}$/.test(base64Data),
      });

      if (!base64Data || base64Data.length === 0) {
        throw new Error('Empty base64 data');
      }

      base64Data = base64Data.replace(/\s/g, '');

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      console.log('Blob created successfully:', {
        size: blob.size,
        type: blob.type,
      });

      const formData = new FormData();
      formData.append('file', blob, 'image.png');
      formData.append('title', title);
      formData.append('description', description);
      formData.append('square', 'true');

      return this.http.post(`${this.baseUrl}/images`, formData);
    } catch (error) {
      console.error('Error processing image data:', error);
      console.log('Failed image data details:', {
        input: imageData,
        length: imageData?.length,
        preview: imageData?.substring(0, 100),
      });
      throw error;
    }
  }

  getImages(params: {
    page: number;
    limit: number;
    filter?: string;
    orderBy?: string;
    order?: string;
  }): Observable<any> {
    return this.http.get(`${this.baseUrl}/images`, { params: params as any });
  }

  deleteImage(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/images/${id}`);
  }
}
