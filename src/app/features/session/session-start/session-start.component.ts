import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'wm-session-start',
  standalone: true,
  imports: [IconComponent, AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="start">
      <header class="top">
        <button class="btn-ghost" (click)="router.navigate(['/'])"><wm-icon name="back" [size]="18"></wm-icon></button>
        <div class="mono-label">NEW SESSION</div>
        <div style="width:34px"></div>
      </header>

      <div class="content">
        <h1 class="headline">What are we<br><em>watching</em> tonight?</h1>

        <div class="type-grid">
          <div class="type-card" [class.type-card--active]="type === 'movie'" (click)="type = 'movie'">
            <wm-icon name="film" [size]="28" style="color:var(--wm-amber)"></wm-icon>
            <div class="type-label">Movie</div>
          </div>
          <div class="type-card" [class.type-card--active]="type === 'series'" (click)="type = 'series'">
            <wm-icon name="tv" [size]="28" style="color:var(--wm-amber)"></wm-icon>
            <div class="type-label">TV Series</div>
          </div>
          <div class="type-card type-card--wide" [class.type-card--active]="type === 'both'" (click)="type = 'both'">
            <wm-icon name="spark" [size]="24" style="color:var(--wm-amber)"></wm-icon>
            <div class="type-label">Either — surprise us</div>
          </div>
        </div>

        <div class="partner-row">
          <div class="partner-card">
            <wm-avatar [name]="user()?.name || '?'" [hue]="user()?.hue || 30" [size]="40"></wm-avatar>
            <div>
              <div class="partner-name">{{ user()?.name }}</div>
              <div class="partner-ready">Ready to swipe</div>
            </div>
          </div>
          @if (user()?.partner_id) {
            <wm-icon name="plus" [size]="16" style="color:var(--wm-text-mute)"></wm-icon>
            <div class="partner-card">
              <wm-avatar name="Partner" [hue]="340" [size]="40"></wm-avatar>
              <div>
                <div class="partner-name">Partner</div>
                <div class="partner-ready">Ready to swipe</div>
              </div>
            </div>
          }
        </div>

        @if (error()) {
          <div class="error-msg">{{ error() }}</div>
        }

        <button class="btn-primary" (click)="start()" [disabled]="loading()">
          {{ loading() ? 'Starting…' : 'Start session →' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .start { width: 100%; min-height: 100vh; background: var(--wm-bg); color: var(--wm-text); }
    .top { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
    .btn-ghost { background: none; border: none; color: var(--wm-text); cursor: pointer; padding: 8px; }
    .mono-label { font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--wm-text-mute); }
    .content { padding: 16px 24px; display: flex; flex-direction: column; gap: 24px; }
    .headline { font-family: var(--wm-f-serif); font-size: 40px; line-height: 1.05; letter-spacing: -0.02em; font-weight: 400; }
    .headline em { color: var(--wm-amber); font-style: italic; }
    .type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .type-card { background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; cursor: pointer; transition: all 0.15s; }
    .type-card--wide { grid-column: 1 / -1; flex-direction: row; align-items: center; }
    .type-card--active { background: var(--wm-amber-soft); border-color: var(--wm-amber-line); }
    .type-label { font-size: 14px; font-weight: 500; }
    .partner-row { display: flex; align-items: center; gap: 16px; }
    .partner-card { flex: 1; background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 14px; padding: 16px; display: flex; gap: 12px; align-items: center; }
    .partner-name { font-size: 14px; font-weight: 500; }
    .partner-ready { font-size: 12px; color: var(--wm-like); margin-top: 2px; }
    .error-msg { color: var(--wm-pass); font-size: 13px; background: var(--wm-pass-soft); border-radius: var(--wm-r-sm); padding: 10px 14px; }
    .btn-primary { width: 100%; height: 52px; background: var(--wm-amber); color: var(--wm-bg); border: none; border-radius: var(--wm-r-pill); font-size: 16px; font-weight: 600; cursor: pointer; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `],
})
export class SessionStartComponent {
  private api  = inject(ApiService);
  private auth = inject(AuthService);
  readonly user = this.auth.currentUser;
  type: 'movie' | 'series' | 'both' = 'movie';
  loading = signal(false);
  error   = signal('');

  constructor(public router: Router) {}

  start(): void {
    this.loading.set(true);
    this.api.createSession({
      partnerId:   this.user()?.partner_id ?? null,
      contentType: this.type,
    }).subscribe({
      next: session => this.router.navigate(['/session', session.id, 'filters']),
      error: () => {
        this.error.set('Could not start session. Is the API reachable?');
        this.loading.set(false);
      },
    });
  }
}
