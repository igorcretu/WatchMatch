import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Movie } from '../../../core/models/movie.model';

const DEEP_LINKS: Record<string, string> = {
  'Netflix':     'https://www.netflix.com',
  'Max':         'https://www.max.com',
  'Disney+':     'https://www.disneyplus.com',
  'Prime Video': 'https://www.amazon.com/gp/video',
  'Apple TV+':   'https://tv.apple.com',
  'Hulu':        'https://www.hulu.com',
  'Showtime':    'https://www.sho.com',
  'Peacock':     'https://www.peacocktv.com',
  'Mubi':        'https://mubi.com',
  'Paramount+':  'https://www.paramountplus.com',
};

@Component({
  selector: 'wm-match',
  standalone: true,
  imports: [PosterComponent, AvatarComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (movie(); as m) {
      <div class="match">
        <div class="bg-poster">
          <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant" [posterPath]="m.poster_path"></wm-poster>
          <div class="bg-overlay"></div>
        </div>

        <div class="match-content">
          <div class="match-label">IT'S A MATCH</div>

          <div class="match-poster">
            <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant" [posterPath]="m.poster_path"></wm-poster>
          </div>

          <h1 class="match-title">{{ m.title }}</h1>
          <div class="match-meta">
            {{ m.year }} · {{ m.runtime }}m ·
            <wm-icon name="star" [size]="12" style="color:var(--wm-amber)"></wm-icon> {{ m.rating }}
          </div>

          <div class="match-pair">
            <div class="match-avatar">
              <wm-avatar [name]="user()?.name || '?'" [hue]="user()?.hue || 30" [size]="44"></wm-avatar>
              <div class="match-heart"><wm-icon name="heart" [size]="12" style="color:var(--wm-like)"></wm-icon></div>
            </div>
            <div class="match-plus">+</div>
            <div class="match-avatar">
              <wm-avatar name="Partner" [hue]="340" [size]="44"></wm-avatar>
              <div class="match-heart"><wm-icon name="heart" [size]="12" style="color:var(--wm-like)"></wm-icon></div>
            </div>
          </div>

          <div class="match-actions">
            @if (m.providers[0]) {
              <a class="btn-watch" [href]="watchUrl(m)" target="_blank" rel="noopener">
                <wm-icon name="play" [size]="18"></wm-icon> Watch on {{ m.providers[0] }}
              </a>
            }
            <button class="btn-queue" (click)="addToQueue(m)">
              <wm-icon name="bookmark" [size]="16"></wm-icon> Save to queue
            </button>
            <button class="btn-continue" (click)="keepSwiping()">Keep swiping →</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .match { position: relative; width: 100%; height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .bg-poster { position: absolute; inset: -20px; filter: blur(30px); transform: scale(1.1); }
    .bg-overlay { position: absolute; inset: 0; background: rgba(10,9,8,0.72); }
    .match-content {
      position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;
      gap: 20px; padding: 24px; text-align: center; color: var(--wm-text);
    }
    .match-label {
      font-family: var(--wm-f-mono); font-size: 12px; letter-spacing: 0.3em;
      color: var(--wm-amber); border: 1px solid var(--wm-amber-line);
      padding: 6px 16px; border-radius: var(--wm-r-pill); background: var(--wm-amber-soft);
    }
    .match-poster { width: 160px; height: 240px; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
    .match-title { font-family: var(--wm-f-serif); font-size: 36px; letter-spacing: -0.02em; font-weight: 400; }
    .match-meta { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--wm-text-dim); }
    .match-pair { display: flex; align-items: center; gap: 20px; }
    .match-avatar { position: relative; }
    .match-heart {
      position: absolute; bottom: -2px; right: -2px; width: 20px; height: 20px; border-radius: 50%;
      background: var(--wm-bg2); display: flex; align-items: center; justify-content: center;
    }
    .match-plus { font-family: var(--wm-f-serif); font-size: 24px; color: var(--wm-amber); }
    .match-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 300px; }
    .btn-watch {
      height: 52px; background: var(--wm-amber); color: var(--wm-bg); border: none;
      border-radius: var(--wm-r-pill); font-size: 15px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;
    }
    .btn-queue {
      height: 48px; background: transparent; color: var(--wm-text); border: 1px solid var(--wm-amber-line);
      border-radius: var(--wm-r-pill); font-size: 14px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-continue {
      height: 48px; background: transparent; color: var(--wm-text-dim); border: 1px solid var(--wm-line);
      border-radius: var(--wm-r-pill); font-size: 14px; cursor: pointer;
    }
  `],
})
export class MatchComponent implements OnInit {
  private api   = inject(ApiService);
  private auth  = inject(AuthService);
  private route = inject(ActivatedRoute);
  movie = signal<Movie | null>(null);
  readonly user = this.auth.currentUser;

  constructor(public router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('movieId') ?? '';
    this.api.getMovie(id).subscribe(m => this.movie.set(m));
  }

  watchUrl(m: Movie): string {
    return DEEP_LINKS[m.providers[0]] ?? `https://www.google.com/search?q=watch+${encodeURIComponent(m.title)}`;
  }

  addToQueue(m: Movie): void {
    // The backend already added it to queue on like; this is just navigation confirmation
    this.router.navigate(['/library/queue']);
  }

  keepSwiping(): void {
    const sid = this.route.snapshot.paramMap.get('id') ?? '';
    this.router.navigate(['/session', sid, 'swipe']);
  }
}
