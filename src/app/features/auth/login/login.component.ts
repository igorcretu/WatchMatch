import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'wm-login',
  standalone: true,
  imports: [FormsModule, IconComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="auth-screen">
      <header class="top">
        <button class="btn-ghost" (click)="router.navigate(['/auth/onboarding'])">
          <wm-icon name="back" [size]="18"></wm-icon>
        </button>
        <div class="mono-label">SIGN IN</div>
        <div style="width:34px"></div>
      </header>

      <div class="content">
        <wm-logo variant="lockup" [size]="26"></wm-logo>
        <h1 class="headline">Good to have<br>you <em>back</em>.</h1>

        <form class="form" (ngSubmit)="submit()">
          <div class="field">
            <label class="field-label">Email</label>
            <input class="field-input" type="email" [(ngModel)]="email" name="email"
              placeholder="igor@example.com" autocomplete="email" required>
          </div>
          <div class="field">
            <label class="field-label">Password</label>
            <input class="field-input" type="password" [(ngModel)]="password" name="password"
              placeholder="••••••••" autocomplete="current-password" required>
          </div>

          @if (error()) {
            <div class="error-msg">{{ error() }}</div>
          }

          <button class="btn-primary" type="submit" [disabled]="loading()">
            {{ loading() ? 'Signing in…' : 'Sign in →' }}
          </button>
        </form>

        <p class="register-link">
          No account yet?
          <button class="link" (click)="router.navigate(['/auth/register'])">Create one</button>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-screen { width: 100%; min-height: 100vh; background: var(--wm-bg); color: var(--wm-text); }
    .top { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
    .btn-ghost { background: none; border: none; color: var(--wm-text); cursor: pointer; padding: 8px; }
    .mono-label { font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--wm-text-mute); }
    .content { padding: 16px 24px; display: flex; flex-direction: column; gap: 24px; }
    .headline { font-family: var(--wm-f-serif); font-size: 40px; line-height: 1.05; letter-spacing: -0.02em; font-weight: 400; }
    .headline em { color: var(--wm-amber); font-style: italic; }
    .form { display: flex; flex-direction: column; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--wm-text-mute); }
    .field-input {
      background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: var(--wm-r-md);
      padding: 14px 16px; color: var(--wm-text); font-size: 15px; outline: none; transition: border-color 0.15s;
    }
    .field-input:focus { border-color: var(--wm-amber-line); }
    .field-input::placeholder { color: var(--wm-text-mute); }
    .error-msg { color: var(--wm-pass); font-size: 13px; background: var(--wm-pass-soft); border-radius: var(--wm-r-sm); padding: 10px 14px; }
    .btn-primary { height: 52px; background: var(--wm-amber); color: var(--wm-bg); border: none; border-radius: var(--wm-r-pill); font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 8px; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .register-link { text-align: center; font-size: 13px; color: var(--wm-text-mute); }
    .link { background: none; border: none; color: var(--wm-amber); cursor: pointer; font-size: 13px; }
  `],
})
export class LoginComponent {
  private auth = inject(AuthService);
  email    = '';
  password = '';
  loading  = signal(false);
  error    = signal('');

  constructor(public router: Router) {}

  submit(): void {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => {
        this.error.set(e.error?.detail ?? 'Invalid email or password.');
        this.loading.set(false);
      },
    });
  }
}
