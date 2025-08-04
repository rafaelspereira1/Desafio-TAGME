import { Component } from '@angular/core';
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
export class ImagesListComponent {
  filterTitle = '';
  orderBy = 'createdAt';
  order = 'desc';
  images: any[] = [];
  displayedColumns = ['preview', 'title', 'createdAt', 'actions'];
  total = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(private imageService: ImageService) {
    this.loadImages();
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
      .subscribe((res: any) => {
        this.images = res.items || [];
        this.total = res.total || 0;
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
}
