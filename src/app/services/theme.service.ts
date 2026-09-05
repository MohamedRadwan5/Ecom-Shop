import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageKey = 'ecom_theme';
  isDarkMode = signal<boolean>(this.loadInitialTheme());

  constructor() {
    effect(() => {
      const dark = this.isDarkMode();
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
        if (dark) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark-theme');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark-theme');
        }
      }
    });
  }

  private loadInitialTheme(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const saved = localStorage.getItem(this.storageKey);
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
  }
}
