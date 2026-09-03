import { Injectable } from '@angular/core';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  optInNewsletter?: boolean;
  registerOnNewsletter?: boolean;
  registeredAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'ecom_users';

  /** Get all registered users from localStorage */
  getUsers(): User[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /** Check if email already exists */
  emailExists(email: string): boolean {
    return this.getUsers().some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  /** Register a new user and save to localStorage */
  registerUser(
    formData: Omit<User, 'id' | 'registeredAt'>
  ): { success: boolean; message: string } {
    if (this.emailExists(formData.email)) {
      return { success: false, message: 'Email already registered.' };
    }

    const newUser: User = {
      ...formData,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
    };

    const users = this.getUsers();
    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users, null, 2));

    return { success: true, message: 'Account created successfully!' };
  }

  /** Login a user by email/username and password */
  loginUser(
    identifier: string,
    password: string,
    rememberMe: boolean = false
  ): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();

    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanId ||
         `${u.firstName} ${u.lastName}`.toLowerCase() === cleanId ||
         u.firstName.toLowerCase() === cleanId) &&
        u.password === password
    );

    if (!user) {
      return {
        success: false,
        message: 'Invalid username/email or password.',
      };
    }

    const sessionData = { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}` };
    if (rememberMe) {
      localStorage.setItem('ecom_current_user', JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem('ecom_current_user', JSON.stringify(sessionData));
    }

    return {
      success: true,
      message: 'Login successful!',
      user,
    };
  }

  /** Get currently logged-in user */
  getCurrentUser() {
    const session = sessionStorage.getItem('ecom_current_user');
    if (session) return JSON.parse(session);
    const local = localStorage.getItem('ecom_current_user');
    return local ? JSON.parse(local) : null;
  }

  /** Download all users data as users.json */
  downloadUsersJson(): void {
    const users = this.getUsers();
    const json = JSON.stringify(users, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  /** Logout current user */
  logout(): void {
    localStorage.removeItem('ecom_current_user');
    sessionStorage.removeItem('ecom_current_user');
  }
}

