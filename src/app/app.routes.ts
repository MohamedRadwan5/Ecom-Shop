import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home').then((m) => m.HomeComponent)
  },
  {
    path: 'men',
    loadComponent: () =>
      import('./men/men').then((m) => m.MenComponent)
  },
  {
    path: 'women',
    loadComponent: () =>
      import('./women/women').then((m) => m.WomenComponent)
  },
  {
    path: 'electronics',
    loadComponent: () =>
      import('./electronics/electronics').then((m) => m.ElectronicsComponent)
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about').then((m) => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact').then((m) => m.ContactComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./product-details/product-details').then((m) => m.ProductDetailsComponent)
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout').then((m) => m.CheckoutComponent)
  },
  {
    path: 'cart',
    redirectTo: 'checkout',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register').then((m) => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then((m) => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password').then((m) => m.ForgotPasswordComponent)
  },
  {
    path: 'personal-info',
    loadComponent: () =>
      import('./personal-info/personal-info').then((m) => m.PersonalInfoComponent)
  },
  {
    path: 'profile',
    redirectTo: 'personal-info',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
