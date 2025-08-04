import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ImageService } from './images.service';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-images-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    ImageCropperComponent,
  ],
  templateUrl: './images-upload.html',
  styleUrls: ['./images-upload.scss'],
})
export class ImagesUploadComponent {
  imageChangedEvent: any = '';
  croppedImage: string | null = null;
  loading = false;

  constructor(
    private imageService: ImageService,
    private snackBar: MatSnackBar
  ) {}

  onFileChange(event: any): void {
    this.imageChangedEvent = event;
    this.croppedImage = null;
  }

  onImageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64 ?? null;
  }

  uploadImage(): void {
    if (!this.croppedImage) return;
    this.loading = true;
    this.imageService.uploadImage(this.croppedImage).subscribe({
      next: () => {
        this.snackBar.open('Imagem enviada com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.imageChangedEvent = '';
        this.croppedImage = null;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao enviar imagem.', 'Fechar', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }
}
