import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TabBarComponent } from '../../layout/tab-bar/tab-bar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'wm-profile',
  standalone: true,
  imports: [AvatarComponent, IconComponent, TabBarComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile-screen">
      <div class="scroll">
        <header class="top-bar">
          <div class="label">PROFILE</div>
        </header>

        @if (user(); as u) {
          <div class="user-section">
            <wm-avatar [name]="u.name" [hue]="u.hue" [size]="80"></wm-avatar>
            <h1 class="user-name">{{ u.name }}</h1>
            <p class="user-email">{{ u.email }}</p>
            @if (u.partner_id) {
              <div class="partner-chip">
                <wm-avatar name="Partner" [hue]="340" [size]="22"></wm-avatar>
                <span>Paired with a partner</span>
              </div>
            } @else {
              <button class="pair-link" (click)="router.navigate(['/auth/pair'])">
                <wm-icon name="plus" [size]="14"></wm-icon> Pair with someone
              </button>
            }
          </div>

          <div class="settings-list">
            <div class="settings-item" (click)="router.navigate(['/library/stats'])">
              <wm-icon name="trophy" [size]="18" style="color:var(--wm-amber)"></wm-icon>
              <div class="settings-label">Statistics</div>
              <wm-icon name="chevR" [size]="14" style="color:var(--wm-text-mute)"></wm-icon>
            </div>
            <div class="settings-item" (click)="router.navigate(['/library/disliked'])">
              <wm-icon name="x" [size]="18" style="color:var(--wm-amber)"></wm-icon>
              <div class="settings-label">Disliked films</div>
              <wm-icon name="chevR" [size]="14" style="color:var(--wm-text-mute)"></wm-icon>
            </div>
            <div class="settings-item" (click)="toggleTheme()">
              <wm-icon name="spark" [size]="18" style="color:var(--wm-amber)"></wm-icon>
              <div class="settings-label">Theme: {{ (u.theme ?? 'dark') === 'dark' ? 'Dark' : 'Light' }}</div>
              <div class="theme-toggle" [class.theme-toggle--light]="(u.theme ?? 'dark') === 'light'"></div>
            </div>
          </div>

          @if (showDeleteConfirm()) {
            <div class="delete-card">
              <p class="delete-warning">Enter your password to confirm account deletion. This cannot be undone.</p>
              <input class="field-input" type="password" [(ngModel)]="deletePassword" placeholder="Your password">
              @if (deleteError()) { <div class="error-msg">{{ deleteError() }}</div> }
              <div class="delete-actions">
                <button class="btn-cancel" (click)="showDeleteConfirm.set(false)">Cancel</button>
                <button class="btn-delete-confirm" (click)="confirmDelete()" [disabled]="!deletePassword || deleting()">
                  {{ deleting() ? 'Deleting…' : 'Delete account' }}
                </button>
              </div>
            </div>
          }
        }

        <button class="sign-out" (click)="signOut()">Sign out</button>
        <button class="delete-account" (click)="showDeleteConfirm.set(true)">Delete account</button>
        <div style="height:120px"></div>
      </div>
      <wm-tab-bar active="me"></wm-tab-bar>
    </div>
  `,
  styles: [`
    .profile-screen { position: relative; width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); overflow: hidden; }
    .scroll { height: 100%; overflow-y: auto; }
    .top-bar { padding: 16px 20px 0; }
    .label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; color: var(--wm-text-mute); }
    .user-section { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px 20px 32px; }
    .user-name { font-family: var(--wm-f-serif); font-size: 32px; letter-spacing: -0.02em; font-weight: 400; }
    .user-email { font-size: 14px; color: var(--wm-text-dim); }
    .partner-chip { display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: var(--wm-amber-soft); border: 1px solid var(--wm-amber-line); border-radius: var(--wm-r-pill); font-size: 13px; color: var(--wm-amber); }
    .pair-link { display: flex; align-items: center; gap: 6px; background: none; border: 1px solid var(--wm-line); border-radius: var(--wm-r-pill); padding: 8px 16px; color: var(--wm-amber); font-size: 13px; cursor: pointer; }
    .settings-list { padding: 0 20px; display: flex; flex-direction: column; }
    .settings-item { display: flex; align-items: center; gap: 14px; padding: 18px 0; border-bottom: 1px solid var(--wm-line); cursor: pointer; }
    .settings-label { flex: 1; font-size: 15px; }
    .theme-toggle { width: 36px; height: 20px; border-radius: 10px; background: var(--wm-bg4); border: 1px solid var(--wm-line); transition: background 0.2s; }
    .theme-toggle--light { background: var(--wm-amber); }
    .delete-card { margin: 16px 20px; background: var(--wm-bg2); border: 1px solid var(--wm-pass); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
    .delete-warning { font-size: 13px; color: var(--wm-text-dim); line-height: 1.5; }
    .field-input { background: var(--wm-bg); border: 1px solid var(--wm-line); border-radius: var(--wm-r-md); padding: 12px 14px; color: var(--wm-text); font-size: 14px; outline: none; width: 100%; box-sizing: border-box; }
    .field-input:focus { border-color: var(--wm-amber-line); }
    .error-msg { color: var(--wm-pass); font-size: 13px; background: var(--wm-pass-soft); border-radius: var(--wm-r-sm); padding: 8px 12px; }
    .delete-actions { display: flex; gap: 10px; }
    .btn-cancel { flex: 1; height: 40px; background: transparent; color: var(--wm-text-dim); border: 1px solid var(--wm-line); border-radius: var(--wm-r-pill); font-size: 13px; cursor: pointer; }
    .btn-delete-confirm { flex: 1; height: 40px; background: var(--wm-pass); color: #fff; border: none; border-radius: var(--wm-r-pill); font-size: 13px; font-weight: 600; cursor: pointer; }
    .btn-delete-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
    .sign-out { display: block; margin: 24px auto 8px; background: none; border: 1px solid var(--wm-pass); color: var(--wm-pass); height: 44px; border-radius: var(--wm-r-pill); padding: 0 32px; font-size: 14px; cursor: pointer; }
    .delete-account { display: block; margin: 0 auto; background: none; border: none; color: var(--wm-text-mute); font-size: 12px; cursor: pointer; text-decoration: underline; padding: 8px; }
  `],
})
export class ProfileComponent {
  private auth = inject(AuthService);
  readonly user = this.auth.currentUser;

  showDeleteConfirm = signal(false);
  deletePassword    = '';
  deleting          = signal(false);
  deleteError       = signal('');

  constructor(public router: Router) {}

  toggleTheme(): void {
    const current = this.user()?.theme ?? 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.auth.updateTheme(next).subscribe();
  }

  confirmDelete(): void {
    this.deleting.set(true);
    this.deleteError.set('');
    this.auth.deleteAccount(this.deletePassword).subscribe({
      next: () => {},
      error: (e) => {
        this.deleteError.set(e.error?.detail ?? 'Wrong password.');
        this.deleting.set(false);
      },
    });
  }

  signOut(): void { this.auth.logout(); }
}
