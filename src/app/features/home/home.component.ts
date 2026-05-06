import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PosterComponent } from '../../shared/components/poster/poster.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TabBarComponent } from '../../layout/tab-bar/tab-bar.component';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { QueueItem } from '../../core/models/movie.model';

@Component({
  selector: 'wm-home',
  standalone: true,
  imports: [PosterComponent, AvatarComponent, IconComponent, TabBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home">
      <div class="scroll-area">
        <header class="top-bar">
          <div class="top-bar__row">
            <div class="greeting">
              <wm-avatar [name]="user()?.name || '?'" [hue]="user()?.hue || 30" [size]="32"></wm-avatar>
              <div>
                <div class="label">EVENING, {{ (user()?.name || '').toUpperCase() }}</div>
                <div class="greeting-sub">{{ dayLabel }} · what'll it be?</div>
              </div>
            </div>
            <div class="bell-wrap">
              <wm-icon name="bell" [size]="20"></wm-icon>
              <div class="bell-dot"></div>
            </div>
          </div>
        </header>

        <!-- Hero CTA -->
        <div class="hero-wrap">
          <div class="hero-card">
            <div class="hero-glow"></div>
            <div class="hero-content">
              <div class="hero-label">TONIGHT{{ user()?.partner_id ? ' WITH YOUR PARTNER' : '' }}</div>
              <h2 class="hero-headline">Pick something<br>you'll <em>both</em> love.</h2>
              <div class="hero-pair">
                <wm-avatar [name]="user()?.name || '?'" [hue]="user()?.hue || 30" [size]="28"></wm-avatar>
                @if (user()?.partner_id) {
                  <wm-avatar name="Partner" [hue]="340" [size]="28" style="margin-left:-10px"></wm-avatar>
                }
              </div>
              <button class="btn-primary" (click)="startSession()">Start a session →</button>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="quick-grid">
          <div class="quick-card" (click)="router.navigate(['/group/new'])">
            <wm-icon name="users" [size]="18" style="color:var(--wm-amber)"></wm-icon>
            <div class="quick-label">Group night</div>
            <div class="quick-sub">3+ people</div>
          </div>
          <div class="quick-card" (click)="router.navigate(['/solo'])">
            <wm-icon name="user" [size]="18" style="color:var(--wm-amber)"></wm-icon>
            <div class="quick-label">Solo mode</div>
            <div class="quick-sub">Just for you</div>
          </div>
        </div>

        <!-- Queue preview -->
        <div class="section-header">
          <div>
            <div class="label">QUEUE</div>
            <h3 class="section-title">Up next to watch</h3>
          </div>
          <button class="see-all" (click)="router.navigate(['/library/queue'])">See all</button>
        </div>

        @if (queueItems().length > 0) {
          <div class="poster-row">
            @for (item of queueItems(); track item.id) {
              <div class="poster-item" (click)="router.navigate(['/library/queue'])">
                <div class="poster-wrap">
                  <wm-poster [title]="item.movie.title" [year]="item.movie.year"
                    [hue]="item.movie.hue" [variant]="item.movie.variant" [posterPath]="item.movie.poster_path"></wm-poster>
                </div>
                <div class="poster-title">{{ item.movie.title }}</div>
                <div class="poster-meta">{{ item.movie.providers[0] }} · {{ item.movie.runtime }}m</div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-queue">
            <wm-icon name="bookmark" [size]="28" style="color:var(--wm-text-mute)"></wm-icon>
            <span>Your queue is empty — start swiping!</span>
          </div>
        }

        <div style="height:120px"></div>
      </div>
      <wm-tab-bar active="home"></wm-tab-bar>
    </div>
  `,
  styles: [`
    .home { position: relative; width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); overflow: hidden; }
    .scroll-area { height: 100%; overflow-y: auto; }
    .top-bar { padding: 8px 20px 14px; }
    .top-bar__row { display: flex; align-items: center; justify-content: space-between; min-height: 32px; }
    .greeting { display: flex; align-items: center; gap: 10px; }
    .label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; color: var(--wm-text-mute); }
    .greeting-sub { font-size: 13px; color: var(--wm-text-dim); margin-top: 1px; }
    .bell-wrap { position: relative; color: var(--wm-text); }
    .bell-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; border-radius: 50%; background: var(--wm-amber); }
    .hero-wrap { padding: 0 20px; }
    .hero-card { background: linear-gradient(135deg, var(--wm-bg3) 0%, var(--wm-bg2) 100%); border: 1px solid var(--wm-line-strong); border-radius: 24px; padding: 22px; position: relative; overflow: hidden; }
    .hero-glow { position: absolute; top: -40px; right: -40px; width: 180px; height: 180px; border-radius: 50%; background: var(--wm-amber-soft); filter: blur(40px); }
    .hero-content { position: relative; }
    .hero-label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.2em; color: var(--wm-amber); margin-bottom: 8px; }
    .hero-headline { font-family: var(--wm-f-serif); font-size: 30px; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 18px; font-weight: 400; }
    .hero-headline em { color: var(--wm-amber); font-style: italic; }
    .hero-pair { display: flex; align-items: center; margin-bottom: 16px; }
    .btn-primary { background: var(--wm-amber); color: var(--wm-bg); border: none; height: 48px; border-radius: var(--wm-r-pill); width: 100%; font-size: 15px; font-weight: 600; cursor: pointer; }
    .quick-grid { padding: 20px 20px 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .quick-card { background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 14px; padding: 14px; cursor: pointer; }
    .quick-label { font-size: 14px; font-weight: 500; margin: 10px 0 2px; }
    .quick-sub { font-size: 11px; color: var(--wm-text-mute); }
    .section-header { padding: 20px 20px 12px; display: flex; align-items: flex-end; justify-content: space-between; }
    .section-title { font-family: var(--wm-f-serif); font-size: 22px; margin-top: 2px; font-weight: 400; }
    .see-all { background: none; border: none; color: var(--wm-amber); font-size: 12px; cursor: pointer; }
    .poster-row { display: flex; gap: 12px; padding: 0 20px; overflow-x: auto; }
    .poster-item { width: 124px; flex-shrink: 0; cursor: pointer; }
    .poster-wrap { aspect-ratio: 2/3; border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
    .poster-title { font-size: 12px; font-weight: 500; line-height: 1.25; }
    .poster-meta { font-size: 11px; color: var(--wm-text-mute); margin-top: 2px; }
    .empty-queue { display: flex; align-items: center; gap: 10px; padding: 16px 20px; color: var(--wm-text-mute); font-size: 13px; }
    .section-pad { padding: 24px 20px 12px; }
    .leaving-card { background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 14px; padding: 12px; display: flex; gap: 12px; align-items: center; margin-top: 8px; }
    .leaving-poster { width: 56px; height: 80px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
    .leaving-info { flex: 1; min-width: 0; }
    .leaving-title { font-size: 14px; font-weight: 500; margin-bottom: 2px; }
    .leaving-sub { font-size: 12px; color: var(--wm-text-dim); margin-bottom: 6px; }
    .expires-badge { display: inline-block; padding: 3px 8px; border-radius: 4px; background: var(--wm-pass-soft); color: var(--wm-pass); font-size: 10px; font-family: var(--wm-f-mono); }
  `],
})
export class HomeComponent implements OnInit {
  private api  = inject(ApiService);
  private auth = inject(AuthService);
  readonly user = this.auth.currentUser;

  queueItems = signal<QueueItem[]>([]);

  readonly dayLabel = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.api.getQueue().subscribe(q => this.queueItems.set(q.filter(i => !i.watched).slice(0, 5)));
  }

  startSession(): void {
    this.router.navigate(['/session/new']);
  }
}
