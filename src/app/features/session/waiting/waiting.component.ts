import { Component, inject, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'wm-waiting',
  standalone: true,
  imports: [AvatarComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="waiting">
      <header class="top">
        <button class="btn-ghost" (click)="back()"><wm-icon name="back" [size]="18"></wm-icon></button>
        <div class="mono-label">WAITING</div>
        <div style="width:34px"></div>
      </header>

      <div class="content">
        <div class="headline-wrap">
          <h1 class="headline">Waiting for<br><em>your partner</em>…</h1>
          <p class="sub">They're setting their filters. This usually takes 30 seconds.</p>
        </div>

        <div class="pair-display">
          <div class="pair-user">
            <wm-avatar [name]="user()?.name || '?'" [hue]="user()?.hue || 30" [size]="64"></wm-avatar>
            <div class="pair-name">{{ user()?.name }}</div>
            <div class="pair-status pair-status--ready">
              <wm-icon name="check" [size]="12"></wm-icon> Ready
            </div>
          </div>
          <div class="pair-divider">
            <div class="pulse-ring"></div>
            <wm-icon name="spark" [size]="20" style="color:var(--wm-amber)"></wm-icon>
          </div>
          <div class="pair-user">
            <wm-avatar name="Partner" [hue]="340" [size]="64"></wm-avatar>
            <div class="pair-name">Partner</div>
            <div class="pair-status" [class.pair-status--ready]="partnerReady()" [class.pair-status--waiting]="!partnerReady()">
              {{ partnerReady() ? 'Ready' : 'Filtering…' }}
            </div>
          </div>
        </div>

        <button class="btn-secondary" (click)="proceed()">Start anyway →</button>
      </div>
    </div>
  `,
  styles: [`
    .waiting { width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); display: flex; flex-direction: column; }
    .top { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
    .btn-ghost { background: none; border: none; color: var(--wm-text); cursor: pointer; padding: 8px; }
    .mono-label { font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--wm-text-mute); }
    .content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; gap: 48px; }
    .headline-wrap { text-align: center; }
    .headline { font-family: var(--wm-f-serif); font-size: 36px; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 12px; font-weight: 400; }
    .headline em { color: var(--wm-amber); font-style: italic; }
    .sub { color: var(--wm-text-dim); font-size: 14px; line-height: 1.5; }
    .pair-display { display: flex; align-items: center; gap: 24px; }
    .pair-user { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .pair-name { font-size: 15px; font-weight: 500; }
    .pair-status { display: flex; align-items: center; gap: 4px; font-size: 12px; font-family: var(--wm-f-mono); border-radius: var(--wm-r-pill); padding: 4px 10px; }
    .pair-status--ready { background: var(--wm-like-soft); color: var(--wm-like); }
    .pair-status--waiting { background: var(--wm-amber-soft); color: var(--wm-amber); }
    .pair-divider { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .pulse-ring {
      width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--wm-amber-line);
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.4; } }
    .btn-secondary {
      background: transparent; color: var(--wm-text); border: 1px solid var(--wm-line-strong);
      height: 52px; width: 220px; border-radius: var(--wm-r-pill); font-size: 15px; font-weight: 500; cursor: pointer;
    }
  `],
})
export class WaitingComponent implements OnInit, OnDestroy {
  private api   = inject(ApiService);
  private auth  = inject(AuthService);
  private route = inject(ActivatedRoute);
  readonly user  = this.auth.currentUser;
  partnerReady   = signal(false);

  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(public router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.proceed(); return; }

    // Check immediately — for solo sessions the status is already 'active'
    this.api.getSession(id).subscribe(session => {
      if (session.status !== 'waiting') { this.proceed(); return; }

      // Poll every 3s up to 60s
      let ticks = 0;
      this.timerId = setInterval(() => {
        this.api.getSession(id).subscribe(s => {
          if (s.status !== 'waiting' || ++ticks >= 20) {
            this.partnerReady.set(s.status !== 'waiting');
            this.clearTimer();
            this.proceed();
          }
        });
      }, 3000);
    });
  }

  ngOnDestroy(): void { this.clearTimer(); }

  proceed(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.clearTimer();
    this.router.navigate(['/session', id, 'swipe']);
  }

  back(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/session', id, 'filters']);
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
