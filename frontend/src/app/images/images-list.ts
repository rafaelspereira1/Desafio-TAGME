import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageService } from './images.service';

@Component({
  selector: 'app-images-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './images-list.html',
  styleUrls: ['./images-list.scss'],
})
export class ImagesListComponent implements OnInit {
  filterTitle = '';
  orderBy = 'createdAt';
  order = 'desc';
  images: any[] = [];
  displayedColumns = ['preview', 'title', 'createdAt', 'actions'];
  total = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(private imageService: ImageService, private router: Router) {}

  ngOnInit(): void {
    this.loadImages();
  }

  goToUpload(): void {
    this.router.navigate(['/upload']);
  }

  loadImages(): void {
    this.imageService
      .getImages({
        page: this.pageIndex + 1,
        limit: this.pageSize,
        filter: this.filterTitle,
        orderBy: this.orderBy,
        order: this.order,
      })
      .subscribe({
        next: (res: any) => {
          console.log('Full images response:', res);
          // Use 'data' property as per backend spec
          this.images = res.data || [];
          this.total = res.total || this.images.length;
          console.log('Images array:', this.images);
        },
        error: (error) => {
          console.error('Error loading images:', error);
          this.images = [];
          this.total = 0;
        },
      });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadImages();
  }

  deleteImage(id: string): void {
    this.imageService.deleteImage(id).subscribe(() => {
      this.loadImages();
    });
  }

  getImageUrl(image: any): string {
    // Use the 'url' property and prepend base URL if needed
    const url = image.url;
    if (!url) {
      console.warn('No image URL found for image:', image);
      return '';
    }
    // If already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If url starts with '/images/', use backend base URL
    if (url.startsWith('/images/')) {
      return `http://localhost:3000${url}`;
    }
    // Otherwise, fallback to base URL + '/' + url
    return `http://localhost:3000/images/${image.id}/file`;
  }

  onImageError(event: any, image: any): void {
    console.error('Image failed to load:', {
      event,
      image,
      src: event.target.src,
    });
  }

  onImageLoad(event: any, image: any): void {
    console.log('Image loaded successfully:', { image, src: event.target.src });
  }
}
