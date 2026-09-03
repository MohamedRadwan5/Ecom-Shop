import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  form = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
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

    const { identifier, password, rememberMe } = this.form.value;

    const result = this.authService.loginUser(
      identifier!,
      password!,
      rememberMe ?? false
    );

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
      // Can redirect or display success state
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
