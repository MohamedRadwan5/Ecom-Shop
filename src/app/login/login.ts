import { Component, inject, signal, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showPassword = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  ngOnInit(): void {
    const registered = this.route.snapshot.queryParamMap.get('registered');
    const reset = this.route.snapshot.queryParamMap.get('reset');

    if (registered === 'true') {
      this.successMessage.set('Account registered successfully! Please log in.');
      this.autoDismissSuccess();
    } else if (reset === 'true') {
      this.successMessage.set('Password reset successfully! Please log in with your new password.');
      this.autoDismissSuccess();
    }
  }

  private autoDismissSuccess(): void {
    setTimeout(() => {
      this.successMessage.set('');
    }, 4000);
  }

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

  this.router.navigate(['/home']);

} else {

  this.errorMessage.set(result.message);

}
  }
}
