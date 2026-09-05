import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

/** Custom validator: password must have 1 uppercase + 1 number */
function strongPasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value: string = control.value ?? '';
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  if (!hasUpper || !hasNumber) {
    return { weakPassword: true };
  }
  return null;
}

/** Custom group validator: newPassword and confirmPassword must match */
function matchPasswordsValidator(
  group: AbstractControl
): ValidationErrors | null {
  const newPass = group.get('newPassword')?.value;
  const confirmPass = group.get('confirmPassword')?.value;
  if (newPass && confirmPass && newPass !== confirmPass) {
    return { mismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  form = this.fb.group(
    {
      identifier: ['', [Validators.required]],
      newPassword: [
        '',
        [Validators.required, Validators.minLength(8), strongPasswordValidator],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchPasswordsValidator }
  );

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  f(name: string) {
    return this.form.get(name)!;
  }

  isInvalid(name: string): boolean {
    const ctrl = this.f(name);
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  isMismatch(): boolean {
    const confirmCtrl = this.f('confirmPassword');
    return (
      this.form.hasError('mismatch') &&
      (confirmCtrl.dirty || confirmCtrl.touched)
    );
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { identifier, newPassword } = this.form.value;

    const result = this.authService.resetPassword(identifier!, newPassword!);

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { reset: 'true' } });
      }, 1500);
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
