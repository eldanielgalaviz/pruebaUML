import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  errorMessage: string = '';
  loading = false;

  // Opciones de roles disponibles
  roles = [
    { value: UserRole.ALUMNO, label: 'Alumno' },
    { value: UserRole.JEFE_GRUPO, label: 'Jefe de Grupo' },
    { value: UserRole.PROFESOR, label: 'Profesor' },
    { value: UserRole.CHECADOR, label: 'Checador' },
    { value: UserRole.ADMINISTRADOR, label: 'Administrador' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      rol: [UserRole.ALUMNO, Validators.required] // Por defecto alumno
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formData = this.registerForm.value;
    console.log('Datos a enviar:', formData);
    
    // Asegurar que fechaNacimiento esté en formato correcto
    if (formData.fechaNacimiento) {
      formData.fechaNacimiento = new Date(formData.fechaNacimiento).toISOString().split('T')[0];
    }
    
    this.http.post<any>('http://localhost:3005/api/auth/register', formData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        alert('Usuario registrado exitosamente');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Error durante el registro:', error);
        
        if (error.error && error.error.message) {
          if (Array.isArray(error.error.message)) {
            this.errorMessage = error.error.message.join(', ');
          } else {
            this.errorMessage = error.error.message;
          }
        } else {
          this.errorMessage = 'Error durante el registro.';
        }
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}