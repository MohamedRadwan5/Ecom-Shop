import { Component, inject, signal, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.css',
})
export class PersonalInfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  successMessage = signal('');
  errorMessage = signal('');
  isEditing = signal(false);
  isLoading = signal(false);

  form = this.fb.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/),
      ],
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    dateOfBirth: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const fullUser = this.authService.getFullCurrentUser();
    const session = this.authService.getCurrentUser();

    if (fullUser) {
      this.currentUser.set(fullUser);
      this.form.patchValue({
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        email: fullUser.email,
        phoneNumber: fullUser.phoneNumber || '',
        dateOfBirth: fullUser.dateOfBirth || '',
      });
    } else if (session) {
      const names = (session.name || '').split(' ');
      const userObj: User = {
        id: session.id,
        firstName: names[0] || 'User',
        lastName: names.slice(1).join(' ') || 'Account',
        email: session.email || 'user@ecom.com',
        password: '',
        phoneNumber: '01000000000',
        dateOfBirth: '2000-01-01',
        registeredAt: new Date().toISOString(),
      };
      this.currentUser.set(userObj);
      this.form.patchValue({
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        phoneNumber: userObj.phoneNumber,
        dateOfBirth: userObj.dateOfBirth,
      });
    } else {
      // Default guest user profile for demonstration
      const guestUser: User = {
        id: 'guest-1',
        firstName: 'Mohamed',
        lastName: 'Radwan',
        email: 'mohamed@example.com',
        password: '',
        phoneNumber: '01012345678',
        dateOfBirth: '1998-05-15',
        registeredAt: new Date().toISOString(),
      };
      this.currentUser.set(guestUser);
      this.form.patchValue({
        firstName: guestUser.firstName,
        lastName: guestUser.lastName,
        email: guestUser.email,
        phoneNumber: guestUser.phoneNumber,
        dateOfBirth: guestUser.dateOfBirth,
      });
    }
  }

  toggleEdit(): void {
    this.isEditing.update((v) => !v);
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
    this.successMessage.set('');
    this.errorMessage.set('');

    const val = this.form.value;

    const result = this.authService.updateUserProfile(val.email!, {
      firstName: val.firstName!,
      lastName: val.lastName!,
      email: val.email!,
      phoneNumber: val.phoneNumber!,
      dateOfBirth: val.dateOfBirth!,
    });

    this.isLoading.set(false);

    if (result.success) {
      this.successMessage.set(result.message);
      this.isEditing.set(false);
      if (result.user) {
        this.currentUser.set(result.user);
      }
      setTimeout(() => {
        this.successMessage.set('');
      }, 3500);
    } else {
      this.errorMessage.set(result.message);
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
