import { Injectable } from '@angular/core';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
}

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
  messages?: ContactMessage[];
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
    localStorage.setItem('ecom_current_user', JSON.stringify(sessionData));
    if (!rememberMe) {
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

  /** Reset password for a user matching identifier (email or username) */
  resetPassword(
    identifier: string,
    newPassword: string
  ): { success: boolean; message: string } {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();

    const userIndex = users.findIndex(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        `${u.firstName} ${u.lastName}`.toLowerCase() === cleanId ||
        u.firstName.toLowerCase() === cleanId
    );

    if (userIndex === -1) {
      return {
        success: false,
        message: 'No account found matching that email or username.',
      };
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users, null, 2));

    return {
      success: true,
      message: 'Password reset successfully! You can now log in.',
    };
  }

  /** Get full user details for current session */
  getFullCurrentUser(): User | null {
    const session = this.getCurrentUser();
    if (!session || !session.email) return null;
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === session.email.toLowerCase()) || null;
  }

  /** Update profile data for an existing user */
  updateUserProfile(
    email: string,
    updatedData: Partial<User>
  ): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    if (index === -1) {
      const newUser: User = {
        id: crypto.randomUUID(),
        firstName: updatedData.firstName || 'User',
        lastName: updatedData.lastName || 'Guest',
        email: email,
        password: updatedData.password || 'Password123',
        phoneNumber: updatedData.phoneNumber || '01000000000',
        dateOfBirth: updatedData.dateOfBirth || '2000-01-01',
        registeredAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users, null, 2));
      const sessionData = { id: newUser.id, email: newUser.email, name: `${newUser.firstName} ${newUser.lastName}` };
      localStorage.setItem('ecom_current_user', JSON.stringify(sessionData));
      return { success: true, message: 'Profile saved successfully!', user: newUser };
    }

    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users, null, 2));

    const updatedUser = users[index];
    const sessionData = { id: updatedUser.id, email: updatedUser.email, name: `${updatedUser.firstName} ${updatedUser.lastName}` };
    localStorage.setItem('ecom_current_user', JSON.stringify(sessionData));

    return { success: true, message: 'Personal information updated successfully!', user: updatedUser };
  }

  /** Save contact message to the user's data in JSON localStorage (ecom_users) */
  saveContactMessage(msg: { name: string; email: string; phone?: string; message: string }): { success: boolean; message: string } {
    const contactMsg: ContactMessage = {
      id: crypto.randomUUID(),
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      message: msg.message,
      date: new Date().toISOString(),
    };

    const users = this.getUsers();
    const currentUser = this.getCurrentUser();
    const targetEmail = currentUser?.email || msg.email;

    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === targetEmail.toLowerCase()
    );

    if (userIndex !== -1) {
      if (!users[userIndex].messages) {
        users[userIndex].messages = [];
      }
      users[userIndex].messages!.push(contactMsg);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users, null, 2));
    } else {
      const guestMessages: ContactMessage[] = JSON.parse(
        localStorage.getItem('ecom_contact_messages') || '[]'
      );
      guestMessages.push(contactMsg);
      localStorage.setItem('ecom_contact_messages', JSON.stringify(guestMessages, null, 2));
    }

    return { success: true, message: 'Message stored in user file successfully.' };
  }

  /** Logout current user */
  logout(): void {
    localStorage.removeItem('ecom_current_user');
    sessionStorage.removeItem('ecom_current_user');
  }
}

