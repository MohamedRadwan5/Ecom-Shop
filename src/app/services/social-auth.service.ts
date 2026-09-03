import { Injectable } from '@angular/core';

// ================================================
// ✏️  ضع بياناتك الحقيقية هنا
// ================================================
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const FACEBOOK_APP_ID  = 'YOUR_FACEBOOK_APP_ID';

export interface SocialUser {
  provider: 'google' | 'facebook';
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  token?: string;
}

declare const google: any;
declare const FB: any;

/** Wraps a promise with a timeout — rejects after ms milliseconds */
function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), ms)
  );
  return Promise.race([promise, timeout]);
}

@Injectable({ providedIn: 'root' })
export class SocialAuthService {

  // ─────────────── GOOGLE ───────────────
  loginWithGoogle(): Promise<SocialUser> {
    // Guard: credentials not configured yet
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
      return Promise.reject(new Error('GOOGLE_NOT_CONFIGURED'));
    }
    // Guard: GSI script not loaded
    if (typeof google === 'undefined' || !google?.accounts?.oauth2) {
      return Promise.reject(new Error('GOOGLE_SDK_NOT_LOADED'));
    }

    const loginPromise = new Promise<SocialUser>((resolve, reject) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error));
            return;
          }
          try {
            const res = await fetch(
              'https://www.googleapis.com/oauth2/v3/userinfo',
              { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
            );
            const profile = await res.json();
            resolve({
              provider: 'google',
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              photoUrl: profile.picture,
              token: tokenResponse.access_token,
            });
          } catch {
            reject(new Error('Failed to fetch Google profile.'));
          }
        },
        error_callback: (err: any) => {
          reject(new Error(err?.type ?? 'Google OAuth error'));
        },
      });
      client.requestAccessToken();
    });

    return withTimeout(loginPromise);
  }

  // ─────────────── FACEBOOK ───────────────
  loginWithFacebook(): Promise<SocialUser> {
    // Guard: credentials not configured yet
    if (!FACEBOOK_APP_ID || FACEBOOK_APP_ID === 'YOUR_FACEBOOK_APP_ID') {
      return Promise.reject(new Error('FACEBOOK_NOT_CONFIGURED'));
    }
    // Guard: FB SDK not loaded
    if (typeof FB === 'undefined') {
      return Promise.reject(new Error('FACEBOOK_SDK_NOT_LOADED'));
    }

    const loginPromise = new Promise<SocialUser>((resolve, reject) => {
      FB.login(
        (response: any) => {
          if (response.authResponse) {
            FB.api('/me', { fields: 'id,name,email,picture' }, (profile: any) => {
              resolve({
                provider: 'facebook',
                id: profile.id,
                name: profile.name,
                email: profile.email ?? '',
                photoUrl: profile.picture?.data?.url,
                token: response.authResponse.accessToken,
              });
            });
          } else {
            reject(new Error('Facebook login cancelled.'));
          }
        },
        { scope: 'email,public_profile' }
      );
    });

    return withTimeout(loginPromise);
  }
}
