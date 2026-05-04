import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  name: string;
  email: string;
  hue: number;
  partner_id: string | null;
}

const TOKEN_KEY = 'wm_token';
const USER_KEY  = 'wm_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);
  private base   = environment.apiUrl;

  private _token   = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private _profile = signal<TokenResponse | null>(
    JSON.parse(localStorage.getItem(USER_KEY) ?? 'null')
  );

  readonly token       = this._token.asReadonly();
  readonly profile     = this._profile.asReadonly();
  readonly isLoggedIn  = computed(() => !!this._token());
  readonly currentUser = computed(() => this._profile());

  register(name: string, email: string, password: string, hue = 30): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.base}/auth/register`, { name, email, password, hue })
      .pipe(tap(res => this._store(res)));
  }

  login(email: string, password: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.base}/auth/login`, { email, password })
      .pipe(tap(res => this._store(res)));
  }

  pairWithPartner(partnerEmail: string): Observable<unknown> {
    return this.http.post(`${this.base}/auth/pair`, { partner_email: partnerEmail }).pipe(
      tap((res: any) => {
        const profile = this._profile();
        if (profile) {
          const updated = { ...profile, partner_id: res.partner_id };
          this._profile.set(updated);
          localStorage.setItem(USER_KEY, JSON.stringify(updated));
        }
      })
    );
  }

  logout(): void {
    this._token.set(null);
    this._profile.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/auth/onboarding']);
  }

  private _store(res: TokenResponse): void {
    this._token.set(res.access_token);
    this._profile.set(res);
    localStorage.setItem(TOKEN_KEY, res.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(res));
  }
}
