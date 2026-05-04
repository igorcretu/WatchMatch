import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ApiService } from '../../../core/services/api.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'wm-card-detail',
  standalone: true,
  imports: [PosterComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (movie(); as m) {
      <div class="detail">
        <div class="hero-poster">
          <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster>
          <div class="hero-fade"></div>
          <button class="close-btn" (click)="back()"><wm-icon name="back" [size]="18"></wm-icon></button>
        </div>

        <div class="scroll-area">
          <div class="meta-row">
            <span class="rating-chip"><wm-icon name="star" [size]="12" style="color:var(--wm-amber)"></wm-icon> {{ m.rating }}</span>
            <span class="dot">·</span><span>{{ m.runtime }}m</span>
            <span class="dot">·</span><span>{{ m.year }}</span>
          </div>
          <h1 class="title">{{ m.title }}</h1>
          <div class="genres">
            @for (g of m.genres; track g) {
              <span class="genre-tag">{{ g }}</span>
            }
          </div>
          <p class="synopsis">{{ m.synopsis }}</p>

          <div class="section-label">Where to watch</div>
          <div class="providers">
            @for (p of m.providers; track p) {
              <div class="provider-chip">
                <wm-icon name="play" [size]="14" style="color:var(--wm-amber)"></wm-icon>
                <span>{{ p }}</span>
              </div>
            }
          </div>

          <div class="actions">
            <button class="btn-pass" (click)="pass()">
              <wm-icon name="x" [size]="20"></wm-icon> Pass
            </button>
            <button class="btn-like" (click)="like()">
              <wm-icon name="heart" [size]="20"></wm-icon> Like
            </button>
          </div>
          <div style="height:32px"></div>
        </div>
      </div>
    } @else if (!loading()) {
      <div class="error-state">
        <p>Could not load movie.</p>
        <button class="btn-back" (click)="back()">Go back</button>
      </div>
    }
  `,
  styles: [`
    .detail { width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); display: flex; flex-direction: column; }
    .hero-poster { height: 52vh; position: relative; flex-shrink: 0; }
    .hero-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(transparent, var(--wm-bg)); }
    .close-btn {
      position: absolute; top: 16px; left: 16px; width: 36px; height: 36px;
      background: rgba(10,9,8,0.7); border: 1px solid var(--wm-line); border-radius: 50%;
      display: flex; align-items: center; justify-content: center; color: var(--wm-text); cursor: pointer;
    }
    .scroll-area { flex: 1; overflow-y: auto; padding: 20px 24px 0; }
    .meta-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--wm-text-dim); margin-bottom: 10px; }
    .rating-chip { display: flex; align-items: center; gap: 4px; }
    .dot { color: var(--wm-text-faint); }
    .title { font-family: var(--wm-f-serif); font-size: 32px; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 14px; font-weight: 400; }
    .genres { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
    .genre-tag { padding: 4px 12px; border-radius: var(--wm-r-pill); border: 1px solid var(--wm-line); font-size: 12px; color: var(--wm-text-mute); }
    .synopsis { font-size: 15px; line-height: 1.6; color: var(--wm-text-dim); margin-bottom: 24px; }
    .section-label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--wm-text-mute); margin-bottom: 12px; }
    .providers { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
    .provider-chip { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: var(--wm-r-md); font-size: 13px; }
    .actions { display: flex; gap: 12px; }
    .btn-pass, .btn-like {
      flex: 1; height: 52px; border-radius: var(--wm-r-pill); display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px; font-weight: 600; cursor: pointer;
    }
    .btn-pass { background: var(--wm-pass-soft); color: var(--wm-pass); border: 1px solid var(--wm-pass); }
    .btn-like { background: var(--wm-like-soft); color: var(--wm-like); border: 1px solid var(--wm-like); }
    .error-state { width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: var(--wm-text-mute); }
    .btn-back { background: none; border: 1px solid var(--wm-line); border-radius: var(--wm-r-pill); padding: 10px 24px; color: var(--wm-text); cursor: pointer; }
  `],
})
export class CardDetailComponent implements OnInit {
  private api   = inject(ApiService);
  private route = inject(ActivatedRoute);
  movie   = signal<Movie | null>(null);
  loading = signal(true);

  constructor(public router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('movieId') ?? '';
    this.api.getMovie(id).subscribe({
      next:  m => { this.movie.set(m); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  back(): void { this.router.navigate(['../..'], { relativeTo: this.route }); }

  like(): void {
    const m = this.movie();
    if (!m) return;
    const sid = this.route.snapshot.paramMap.get('id') ?? '';
    this.api.recordSwipe(sid, { movie_id: m.id, action: 'like' }).subscribe(() => this.back());
  }

  pass(): void { this.back(); }
}
