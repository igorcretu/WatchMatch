import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TabBarComponent } from '../../layout/tab-bar/tab-bar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'wm-profile',
  standalone: true,
  imports: [AvatarComponent, IconComponent, TabBarComponent],
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
            @for (s of settings; track s.label) {
              <div class="settings-item" (click)="s.action()">
                <wm-icon [name]="s.icon" [size]="18" style="color:var(--wm-amber)"></wm-icon>
                <div class="settings-label">{{ s.label }}</div>
                <wm-icon name="chevR" [size]="14" style="color:var(--wm-text-mute)"></wm-icon>
              </div>
            }
          </div>
        }

        <button class="sign-out" (click)="signOut()">Sign out</button>
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
    .sign-out { display: block; margin: 24px auto; background: none; border: 1px solid var(--wm-pass); color: var(--wm-pass); height: 44px; border-radius: var(--wm-r-pill); padding: 0 32px; font-size: 14px; cursor: pointer; }
  `],
})
export class ProfileComponent {
  private auth = inject(AuthService);
  readonly user = this.auth.currentUser;

  settings = [
    { label: 'Streaming services', icon: 'play' as const, action: () => {} },
    { label: 'Notifications',      icon: 'bell' as const, action: () => {} },
    { label: 'Privacy',            icon: 'cog' as const,  action: () => {} },
    { label: 'Region & language',  icon: 'filter' as const, action: () => {} },
    { label: 'Statistics',         icon: 'trophy' as const, action: () => this.router.navigate(['/library/stats']) },
    { label: 'Disliked films',     icon: 'x' as const,    action: () => this.router.navigate(['/library/disliked']) },
  ];

  constructor(public router: Router) {}

  signOut(): void { this.auth.logout(); }
}
