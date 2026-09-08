import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

/** Custom validator: password must have 1 uppercase + 1 number */
function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  if (!hasUpper || !hasNumber) {
    return { weakPassword: true };
  }
  return null;
}

/** Custom validator: user must be at least 18 years old */
function minAge18Validator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const dob = new Date(control.value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  const isOldEnough = age > 18 || (age === 18 && (m > 0 || today.getDate() >= dob.getDate()));
  return isOldEnough ? null : { underage: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  form = this.fb.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/),
      ],
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    dateOfBirth: ['', [Validators.required, minAge18Validator]],
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  f(name: string) {
    return this.form.get(name)!;
  }

  isInvalid(name: string): boolean {
    const ctrl = this.f(name);
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { firstName, lastName, email, password, phoneNumber, dateOfBirth } = this.form.value;

    const result = this.authService.registerUser({
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      password: password!,
      phoneNumber: phoneNumber!,
      dateOfBirth: dateOfBirth!,
    });

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message + ' Redirecting to login...');
      this.form.reset();
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }, 1200);
    } else {
      this.errorMessage.set(result.message);
    }
  }
}

