import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { TabBarComponent } from '../../../layout/tab-bar/tab-bar.component';
import { ApiService } from '../../../core/services/api.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'wm-disliked',
  standalone: true,
  imports: [PosterComponent, IconComponent, TabBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="disliked-screen">
      <div class="scroll">
        <header class="top-bar">
          <button class="btn-back" (click)="router.navigate(['/profile'])">
            <wm-icon name="back" [size]="18"></wm-icon>
          </button>
          <div>
            <div class="label">LIBRARY</div>
            <h1 class="page-title">Hidden films</h1>
          </div>
          <div style="width:36px"></div>
        </header>
        <p class="page-sub">Films you passed or hid — restore any time.</p>

        <div class="list">
          @for (m of movies(); track m.id) {
            <div class="list-item">
              <div class="item-poster">
                <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster>
              </div>
              <div class="item-info">
                <div class="item-title">{{ m.title }}</div>
                <div class="item-meta">{{ m.year }} · {{ m.runtime }}m</div>
                <div class="item-genres">{{ m.genres.slice(0, 2).join(' · ') }}</div>
              </div>
              <button class="undo-btn" (click)="restore(m)" title="Restore">
                <wm-icon name="plus" [size]="16"></wm-icon>
              </button>
            </div>
          }
          @empty {
            <div class="empty">
              <wm-icon name="check" [size]="48" style="color:var(--wm-like)"></wm-icon>
              <p>No hidden films.<br>Films you pass or hide will appear here.</p>
            </div>
          }
        </div>
        <div style="height:120px"></div>
      </div>
      <wm-tab-bar active="me"></wm-tab-bar>
    </div>
  `,
  styles: [`
    .disliked-screen { position: relative; width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); overflow: hidden; }
    .scroll { height: 100%; overflow-y: auto; }
    .top-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px 8px; }
    .btn-back { background: none; border: none; color: var(--wm-text); cursor: pointer; padding: 8px; }
    .label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; color: var(--wm-text-mute); }
    .page-title { font-family: var(--wm-f-serif); font-size: 30px; letter-spacing: -0.02em; font-weight: 400; }
    .page-sub { font-size: 13px; color: var(--wm-text-dim); padding: 0 20px 16px; }
    .list { padding: 0 20px; display: flex; flex-direction: column; gap: 10px; }
    .list-item { display: flex; align-items: center; gap: 14px; background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 14px; padding: 12px; }
    .item-poster { width: 44px; height: 66px; border-radius: 6px; overflow: hidden; flex-shrink: 0; opacity: 0.6; }
    .item-info { flex: 1; min-width: 0; }
    .item-title { font-size: 14px; font-weight: 500; margin-bottom: 3px; color: var(--wm-text-dim); }
    .item-meta { font-size: 12px; color: var(--wm-text-mute); }
    .item-genres { font-size: 11px; color: var(--wm-text-faint); margin-top: 3px; }
    .undo-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--wm-amber-line); background: var(--wm-amber-soft); display: flex; align-items: center; justify-content: center; color: var(--wm-amber); cursor: pointer; flex-shrink: 0; }
    .undo-btn:hover { background: var(--wm-amber); color: var(--wm-bg); }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 60px 20px; text-align: center; color: var(--wm-text-mute); }
  `],
})
export class DislikedComponent implements OnInit {
  private api = inject(ApiService);
  movies = signal<Movie[]>([]);

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.api.getDisliked().subscribe(m => this.movies.set(m));
  }

  restore(movie: Movie): void {
    this.api.undoDislike(movie.id).subscribe(() => {
      this.movies.update(list => list.filter(m => m.id !== movie.id));
    });
  }
}
