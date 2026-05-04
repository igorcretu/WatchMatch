import {
  Component, inject, signal, computed, HostListener,
  ChangeDetectionStrategy, OnInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Movie } from '../../../core/models/movie.model';

const SWIPE_THRESHOLD = 100;
const MATCH_EVERY_N   = 4;

type SwipeAction = 'like' | 'pass' | 'super' | 'skip' | 'hide' | 'seen';

@Component({
  selector: 'wm-swipe',
  standalone: true,
  imports: [CdkDrag, PosterComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="swipe-screen" tabindex="0" (keydown)="onKey($event)">
      <!-- Top bar -->
      <header class="top">
        <div class="progress-wrap">
          <div class="mono-label">{{ deckIndex() + 1 }} / {{ movies().length }}</div>
          <div class="progress-bar"><div class="progress-fill" [style.width.%]="progressPct()"></div></div>
        </div>
        <div class="partner-status">
          <wm-icon name="users" [size]="16" style="color:var(--wm-amber)"></wm-icon>
          <span class="mono-label">{{ likeCount() }} liked this session</span>
        </div>
      </header>

      <!-- Card deck -->
      <div class="deck" [attr.aria-label]="'Swipe deck. ' + (currentMovie() ? currentMovie()!.title : 'Loading')">
        @if (loading()) {
          <div class="loading">
            <div class="pulse"></div>
            <span class="mono-label">Loading deck…</span>
          </div>
        } @else if (currentMovie(); as movie) {
          <!-- Back card -->
          @if (nextMovie(); as next) {
            <div class="card card--back">
              <div class="card-poster">
                <wm-poster [title]="next.title" [year]="next.year" [hue]="next.hue" [variant]="next.variant"></wm-poster>
              </div>
            </div>
          }

          <!-- Active card -->
          <div class="card card--front"
               cdkDrag (cdkDragMoved)="onDragMove($event)" (cdkDragEnded)="onDragEnd($event)"
               [style.transform]="cardTransform()" [style.opacity]="dragging() ? 0.95 : 1">

            <div class="feedback feedback--like" [style.opacity]="likeOpacity()">
              <div class="feedback-label">LIKE</div>
            </div>
            <div class="feedback feedback--pass" [style.opacity]="passOpacity()">
              <div class="feedback-label">PASS</div>
            </div>

            <div class="card-poster">
              <wm-poster [title]="movie.title" [year]="movie.year" [hue]="movie.hue" [variant]="movie.variant"></wm-poster>
              <div class="poster-fade"></div>
            </div>

            <div class="card-info">
              <div class="card-meta">
                <span class="rating"><wm-icon name="star" [size]="12" style="color:var(--wm-amber)"></wm-icon> {{ movie.rating }}</span>
                <span class="dot">·</span><span>{{ movie.runtime }}m</span>
                <span class="dot">·</span><span>{{ movie.year }}</span>
              </div>
              <h2 class="card-title">{{ movie.title }}</h2>
              <p class="card-synopsis">{{ movie.synopsis }}</p>
              <div class="card-genres">
                @for (g of movie.genres; track g) { <span class="genre-tag">{{ g }}</span> }
                <span class="genre-tag genre-tag--service">{{ movie.providers[0] }}</span>
              </div>
            </div>

            <!-- Overflow menu -->
            <div class="overflow-menu" [class.open]="menuOpen()">
              <button class="overflow-toggle" (click)="menuOpen.update(v => !v)" aria-label="More options">
                <wm-icon name="chevD" [size]="14"></wm-icon>
              </button>
              @if (menuOpen()) {
                <div class="menu-items">
                  <button class="menu-item" (click)="doAction('skip', movie)">
                    <wm-icon name="chevR" [size]="14"></wm-icon> Skip for now
                  </button>
                  <button class="menu-item" (click)="doAction('seen', movie)">
                    <wm-icon name="check" [size]="14"></wm-icon> Already seen
                  </button>
                  <button class="menu-item menu-item--danger" (click)="doAction('hide', movie)">
                    <wm-icon name="x" [size]="14"></wm-icon> Hide forever
                  </button>
                  <button class="menu-item" (click)="openDetail(movie); menuOpen.set(false)">
                    <wm-icon name="search" [size]="14"></wm-icon> More info
                  </button>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="empty">
            <wm-icon name="film" [size]="48" style="color:var(--wm-text-mute)"></wm-icon>
            <p>No more cards in this session.</p>
            <button class="btn-primary" (click)="router.navigate(['/session', sessionId, 'no-match'])">See results</button>
          </div>
        }
      </div>

      <!-- Action buttons -->
      <div class="actions" role="group" aria-label="Swipe actions">
        <button class="action-btn action-btn--pass"  (click)="doAction('pass',  currentMovie()!)" aria-label="Pass (←)">
          <wm-icon name="x" [size]="28"></wm-icon>
        </button>
        <button class="action-btn action-btn--skip"  (click)="doAction('skip',  currentMovie()!)" aria-label="Maybe (↓)">
          <wm-icon name="chevD" [size]="20"></wm-icon>
        </button>
        <button class="action-btn action-btn--super" (click)="doAction('super', currentMovie()!)" aria-label="Super like (↑)">
          <wm-icon name="star" [size]="22"></wm-icon>
        </button>
        <button class="action-btn action-btn--like"  (click)="doAction('like',  currentMovie()!)" aria-label="Like (→)">
          <wm-icon name="heart" [size]="28"></wm-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .swipe-screen { width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); display: flex; flex-direction: column; outline: none; overflow: hidden; }
    .top { padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
    .mono-label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; color: var(--wm-text-mute); }
    .progress-wrap { display: flex; flex-direction: column; gap: 6px; }
    .progress-bar { width: 120px; height: 2px; background: var(--wm-bg4); border-radius: 1px; }
    .progress-fill { height: 100%; background: var(--wm-amber); border-radius: 1px; transition: width 0.3s; }
    .partner-status { display: flex; align-items: center; gap: 8px; }

    .deck { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; padding: 8px 16px 0; }
    .card {
      position: absolute; width: 100%; max-width: 360px;
      background: var(--wm-bg3); border: 1px solid var(--wm-line); border-radius: 20px;
      overflow: hidden; display: flex; flex-direction: column;
      height: calc(100vh - 200px); max-height: 560px;
      user-select: none; touch-action: none;
    }
    .card--back { transform: scale(0.95) translateY(12px); z-index: 0; }
    .card--front { z-index: 1; cursor: grab; }
    .card--front:active { cursor: grabbing; }

    .feedback { position: absolute; inset: 0; z-index: 10; display: flex; align-items: center; justify-content: center; pointer-events: none; border-radius: 20px; }
    .feedback--like { background: var(--wm-like-soft); }
    .feedback--pass { background: var(--wm-pass-soft); }
    .feedback-label { font-family: var(--wm-f-serif); font-size: 48px; font-weight: 400; }
    .feedback--like .feedback-label { color: var(--wm-like); }
    .feedback--pass .feedback-label { color: var(--wm-pass); }

    .card-poster { flex: 1; position: relative; min-height: 0; }
    .poster-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(transparent, var(--wm-bg3)); }
    .card-info { padding: 16px 18px 14px; flex-shrink: 0; }
    .card-meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--wm-text-dim); margin-bottom: 6px; }
    .rating { display: flex; align-items: center; gap: 4px; }
    .dot { color: var(--wm-text-faint); }
    .card-title { font-family: var(--wm-f-serif); font-size: 26px; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 8px; font-weight: 400; }
    .card-synopsis { font-size: 13px; color: var(--wm-text-dim); line-height: 1.45; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-genres { display: flex; flex-wrap: wrap; gap: 6px; }
    .genre-tag { padding: 3px 10px; border-radius: var(--wm-r-pill); border: 1px solid var(--wm-line); font-size: 11px; color: var(--wm-text-mute); font-family: var(--wm-f-mono); }
    .genre-tag--service { border-color: var(--wm-amber-line); color: var(--wm-amber); background: var(--wm-amber-soft); }

    .overflow-menu { position: absolute; top: 12px; right: 12px; z-index: 20; }
    .overflow-toggle { width: 32px; height: 32px; background: rgba(28,25,22,0.7); border: 1px solid var(--wm-line); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--wm-text); cursor: pointer; }
    .menu-items { position: absolute; top: 40px; right: 0; background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: var(--wm-r-md); overflow: hidden; min-width: 160px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
    .menu-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 16px; background: none; border: none; border-bottom: 1px solid var(--wm-line); color: var(--wm-text-dim); font-size: 13px; cursor: pointer; text-align: left; }
    .menu-item:last-child { border-bottom: none; }
    .menu-item:hover { background: var(--wm-bg3); color: var(--wm-text); }
    .menu-item--danger { color: var(--wm-pass); }

    .actions { flex-shrink: 0; display: flex; justify-content: center; align-items: center; gap: 16px; padding: 16px 0 28px; }
    .action-btn { width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--wm-line); background: var(--wm-bg2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
    .action-btn--pass  { color: var(--wm-pass);  border-color: var(--wm-pass);  width: 64px; height: 64px; }
    .action-btn--like  { color: var(--wm-like);  border-color: var(--wm-like);  width: 64px; height: 64px; }
    .action-btn--super { color: var(--wm-amber); border-color: var(--wm-amber-line); }
    .action-btn--skip  { color: var(--wm-text-dim); }
    .action-btn:hover { transform: scale(1.08); }
    .action-btn:active { transform: scale(0.95); }

    .loading { display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--wm-text-mute); }
    .pulse { width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--wm-amber-line); animation: pulse 1.5s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.2);opacity:0.4} }

    .empty { display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--wm-text-mute); text-align: center; }
    .btn-primary { background: var(--wm-amber); color: var(--wm-bg); border: none; height: 48px; border-radius: var(--wm-r-pill); padding: 0 32px; font-size: 15px; font-weight: 600; cursor: pointer; }
  `],
})
export class SwipeComponent implements OnInit {
  private api   = inject(ApiService);
  private auth  = inject(AuthService);
  private route = inject(ActivatedRoute);

  movies    = signal<Movie[]>([]);
  loading   = signal(true);
  sessionId = '';

  deckIndex  = signal(0);
  likeCount  = signal(0);
  dragging   = signal(false);
  dragX      = signal(0);
  menuOpen   = signal(false);
  skipped    = signal<Movie[]>([]); // deferred cards

  currentMovie = computed(() => this.movies()[this.deckIndex()] ?? null);
  nextMovie    = computed(() => this.movies()[this.deckIndex() + 1] ?? null);
  progressPct  = computed(() => (this.deckIndex() / Math.max(this.movies().length, 1)) * 100);
  likeOpacity  = computed(() => Math.max(0, Math.min(1,  this.dragX() / SWIPE_THRESHOLD)));
  passOpacity  = computed(() => Math.max(0, Math.min(1, -this.dragX() / SWIPE_THRESHOLD)));
  cardTransform = computed(() => {
    if (!this.dragging()) return '';
    const dx = this.dragX(), rot = dx * 0.04;
    return `translateX(${dx}px) rotate(${rot}deg)`;
  });

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('id') ?? '';
    this.api.getMovies().subscribe(movies => {
      this.movies.set(movies);
      this.loading.set(false);
    });
  }

  onDragMove(event: CdkDragMove): void {
    this.dragging.set(true);
    this.dragX.set(event.distance.x);
  }

  onDragEnd(event: CdkDragEnd): void {
    const dx = event.distance.x;
    event.source.reset();
    this.dragging.set(false);
    this.dragX.set(0);
    const movie = this.currentMovie();
    if (!movie) return;
    if (dx > SWIPE_THRESHOLD)  this.doAction('like', movie);
    else if (dx < -SWIPE_THRESHOLD) this.doAction('pass', movie);
  }

  @HostListener('keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    const movie = this.currentMovie();
    if (!movie) return;
    if (e.key === 'ArrowRight') this.doAction('like',  movie);
    else if (e.key === 'ArrowLeft')  this.doAction('pass',  movie);
    else if (e.key === 'ArrowUp')    this.doAction('super', movie);
    else if (e.key === 'ArrowDown')  this.doAction('skip',  movie);
  }

  doAction(action: SwipeAction, movie: Movie | null): void {
    if (!movie) return;
    this.menuOpen.set(false);

    if (action === 'skip') {
      // Move card to end of deck
      this.movies.update(list => {
        const rest = list.filter((_, i) => i !== this.deckIndex());
        return [...rest, movie];
      });
      return;
    }

    this.api.recordSwipe(this.sessionId, { movie_id: movie.id, action }).subscribe(result => {
      if (result.matched && result.movie) {
        this.deckIndex.update(i => i + 1);
        this.router.navigate(['/session', this.sessionId, 'match', result.movie!.id]);
        return;
      }
      if (action === 'like' || action === 'super') {
        this.likeCount.update(n => n + 1);
      }
      this.deckIndex.update(i => i + 1);
    });
  }

  openDetail(movie: Movie): void {
    this.router.navigate(['/session', this.sessionId, 'card', movie.id]);
  }
}
