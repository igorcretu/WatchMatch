import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ApiService } from '../../../core/services/api.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'wm-no-match',
  standalone: true,
  imports: [PosterComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="no-match">
      <div class="content">
        <wm-icon name="film" [size]="52" style="color:var(--wm-text-mute)"></wm-icon>
        <h1 class="headline">No match this time.</h1>
        <p class="sub">You swiped through all the films without a mutual like. Here are the closest calls:</p>

        @if (closest().length > 0) {
          <div class="closest-list">
            @for (m of closest(); track m.id) {
              <div class="closest-card">
                <div class="closest-poster">
                  <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster>
                </div>
                <div class="closest-info">
                  <div class="closest-title">{{ m.title }}</div>
                  <div class="closest-meta">{{ m.year }} · {{ m.runtime }}m</div>
                  <div class="score-badge">Almost matched</div>
                </div>
              </div>
            }
          </div>
        }

        <div class="actions">
          <button class="btn-primary" (click)="tryAgain()">Try again →</button>
          <button class="btn-secondary" (click)="router.navigate(['/'])">Go home</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .no-match { width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); display: flex; align-items: center; justify-content: center; overflow-y: auto; }
    .content { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 32px; text-align: center; max-width: 380px; width: 100%; }
    .headline { font-family: var(--wm-f-serif); font-size: 36px; letter-spacing: -0.02em; font-weight: 400; }
    .sub { color: var(--wm-text-dim); font-size: 15px; line-height: 1.5; }
    .closest-list { display: flex; flex-direction: column; gap: 10px; width: 100%; }
    .closest-card { background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 16px; padding: 14px; display: flex; gap: 14px; align-items: center; text-align: left; }
    .closest-poster { width: 60px; height: 88px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
    .closest-title { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
    .closest-meta { font-size: 12px; color: var(--wm-text-mute); margin-bottom: 8px; }
    .score-badge { display: inline-block; padding: 3px 8px; border-radius: 4px; background: var(--wm-amber-soft); color: var(--wm-amber); font-size: 10px; font-family: var(--wm-f-mono); }
    .actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }
    .btn-primary { width: 100%; height: 52px; background: var(--wm-amber); color: var(--wm-bg); border: none; border-radius: var(--wm-r-pill); font-size: 16px; font-weight: 600; cursor: pointer; }
    .btn-secondary { width: 100%; height: 52px; background: transparent; color: var(--wm-text); border: 1px solid var(--wm-line-strong); border-radius: var(--wm-r-pill); font-size: 15px; cursor: pointer; }
  `],
})
export class NoMatchComponent implements OnInit {
  private api   = inject(ApiService);
  private route = inject(ActivatedRoute);
  closest = signal<Movie[]>([]);

  constructor(public router: Router) {}

  ngOnInit(): void {
    const sid = this.route.snapshot.paramMap.get('id') ?? '';
    this.api.getAlmostMatched(sid).subscribe(movies => this.closest.set(movies));
  }

  tryAgain(): void {
    const u = this.route.snapshot.paramMap.get('id');
    this.api.createSession().subscribe(session =>
      this.router.navigate(['/session', session.id, 'filters'])
    );
  }
}
