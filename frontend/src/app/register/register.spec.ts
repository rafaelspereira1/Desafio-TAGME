import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegisterComponent } from './register';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if passwords do not match', () => {
    component.registerForm.setValue({
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '654321',
    });
    component.onSubmit();
    expect(component.error).toBe('As senhas não coincidem');
  });

  it('should call AuthService.register and navigate on success', () => {
    component.registerForm.setValue({
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });
    authServiceSpy.register.and.returnValue(of({}));
    component.onSubmit();
    expect(authServiceSpy.register).toHaveBeenCalledWith('test@test.com', '123456');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error on register failure', () => {
    component.registerForm.setValue({
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: {} })));
    component.onSubmit();
    expect(component.error).toBe('Falha ao criar conta');
  });
});
