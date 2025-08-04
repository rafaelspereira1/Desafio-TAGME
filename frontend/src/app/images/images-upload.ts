import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
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
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ImageCropperComponent,
  ],
  templateUrl: './images-upload.html',
  styleUrls: ['./images-upload.scss'],
})
export class ImagesUploadComponent {
  imageChangedEvent: any = '';
  croppedImage: string | null = null;
  imageTitle: string = '';
  imageDescription: string = '';
  loading = false;

  constructor(
    private imageService: ImageService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  goToList(): void {
    this.router.navigate(['/']);
  }

  onFileChange(event: any): void {
    this.imageChangedEvent = event;
    this.croppedImage = null;
    console.log('File selected:', event.target.files[0]?.name);
  }

  onImageCropped(event: ImageCroppedEvent): void {
    // Try different properties that might contain the base64 data
    this.croppedImage = event.base64 || event.objectUrl || null;
    console.log('Image cropped:', {
      event: event,
      hasBase64: !!event.base64,
      hasObjectUrl: !!event.objectUrl,
      base64Preview: event.base64?.substring(0, 50) + '...',
      croppedImageLength: this.croppedImage?.length,
      title: this.imageTitle,
      buttonShouldBeEnabled: !!(
        this.croppedImage &&
        this.imageTitle &&
        !this.loading
      ),
    });
  }

  onImageLoaded(): void {
    console.log('Image loaded in cropper');
  }

  onCropperReady(): void {
    console.log('Cropper ready');
  }

  onLoadImageFailed(): void {
    console.log('Load image failed');
  }

  uploadImage(): void {
    if (!this.croppedImage || !this.imageTitle) return;
    this.loading = true;

    console.log('Uploading image with data:', {
      title: this.imageTitle,
      description: this.imageDescription,
      imageType: typeof this.croppedImage,
      imagePreview: this.croppedImage.substring(0, 50) + '...',
    });

    this.imageService
      .uploadImage(this.croppedImage, this.imageTitle, this.imageDescription)
      .subscribe({
        next: () => {
          this.snackBar.open('Imagem enviada com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.resetForm();
          this.loading = false;
          // Navigate back to list after successful upload
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.snackBar.open('Erro ao enviar imagem.', 'Fechar', {
            duration: 3000,
          });
          this.loading = false;
        },
      });
  }

  private resetForm(): void {
    this.imageChangedEvent = '';
    this.croppedImage = null;
    this.imageTitle = '';
    this.imageDescription = '';
  }
}
