import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ImagesListComponent } from './images-list';
import { ImageService } from './images.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
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

const mockImages = [
  {
    id: '1',
    title: 'Test Image',
    description: 'desc',
    url: 'http://localhost:3000/images/1/file',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'No URL',
    description: 'desc',
    url: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class MockImageService {
  getImages() {
    return of({ data: mockImages, total: 2 });
  }
  deleteImage(id: string) {
    return of({});
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ImagesListComponent', () => {
  let component: ImagesListComponent;
  let fixture: ComponentFixture<ImagesListComponent>;
  let imageService: ImageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
        ImagesListComponent,
      ],
      declarations: [],
      providers: [
        { provide: ImageService, useClass: MockImageService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagesListComponent);
    component = fixture.componentInstance;
    imageService = TestBed.inject(ImageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render images and fallback for missing URL', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('img').length).toBe(1);
    expect(compiled.textContent).toContain('Imagem não disponível');
  });

  it('should call deleteImage and refresh list', fakeAsync(() => {
    spyOn(imageService, 'deleteImage').and.returnValue(of({}));
    spyOn(component, 'loadImages');
    component.deleteImage('1');
    tick();
    expect(imageService.deleteImage).toHaveBeenCalledWith('1');
    expect(component.loadImages).toHaveBeenCalled();
  }));

  it('should navigate to upload page', () => {
    component.goToUpload();
    expect(router.navigate).toHaveBeenCalledWith(['/upload']);
  });

  it('should handle image error', () => {
    const event = { target: { src: 'badsrc' } };
    spyOn(console, 'error');
    component.onImageError(event, mockImages[0]);
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle image load', () => {
    const event = { target: { src: 'goodsrc' } };
    spyOn(console, 'log');
    component.onImageLoad(event, mockImages[0]);
    expect(console.log).toHaveBeenCalled();
  });

  it('should return correct image URL', () => {
    expect(component.getImageUrl(mockImages[0])).toBe(mockImages[0].url);
    expect(component.getImageUrl(mockImages[1])).toBe('');
  });

  it('should handle error loading images', fakeAsync(() => {
    spyOn(imageService, 'getImages').and.returnValue(
      throwError(() => new Error('fail'))
    );
    component.loadImages();
    tick();
    expect(component.images.length).toBe(0);
    expect(component.total).toBe(0);
  }));
});
