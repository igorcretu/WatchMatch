import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { TabBarComponent } from '../../../layout/tab-bar/tab-bar.component';
import { ApiService } from '../../../core/services/api.service';
import { QueueItem } from '../../../core/models/movie.model';

@Component({
  selector: 'wm-queue',
  standalone: true,
  imports: [PosterComponent, IconComponent, TabBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="queue-screen">
      <div class="scroll">
        <header class="top-bar">
          <div class="label">QUEUE</div>
          <h1 class="page-title">Watchlist</h1>
          <p class="page-sub">{{ items().length }} films to watch</p>
        </header>

        <div class="list">
          @for (item of items(); track item.id; let i = $index) {
            <div class="list-item">
              <div class="item-index">{{ i + 1 }}</div>
              <div class="item-poster">
                <wm-poster [title]="item.movie.title" [year]="item.movie.year"
                  [hue]="item.movie.hue" [variant]="item.movie.variant" [posterPath]="item.movie.poster_path"></wm-poster>
              </div>
              <div class="item-info">
                <div class="item-title">{{ item.movie.title }}</div>
                <div class="item-meta">{{ item.movie.year }} · {{ item.movie.runtime }}m</div>
                <div class="item-service">{{ item.movie.providers[0] }}</div>
              </div>
              <button class="watch-btn" (click)="markWatched(item)" [disabled]="item.watched">
                <wm-icon name="check" [size]="14"></wm-icon>
              </button>
            </div>
          }
          @empty {
            <div class="empty">
              <wm-icon name="bookmark" [size]="48" style="color:var(--wm-text-mute)"></wm-icon>
              <p>Your queue is empty.<br>Start swiping to add films!</p>
              <button class="btn-primary" (click)="router.navigate(['/session/new'])">Start a session</button>
            </div>
          }
        </div>
        <div style="height:120px"></div>
      </div>
      <wm-tab-bar active="queue"></wm-tab-bar>
    </div>
  `,
  styles: [`
    .queue-screen { position: relative; width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); overflow: hidden; }
    .scroll { height: 100%; overflow-y: auto; }
    .top-bar { padding: 16px 20px 20px; }
    .label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; color: var(--wm-text-mute); }
    .page-title { font-family: var(--wm-f-serif); font-size: 36px; letter-spacing: -0.02em; margin: 4px 0; font-weight: 400; }
    .page-sub { font-size: 14px; color: var(--wm-text-dim); }
    .list { padding: 0 20px; display: flex; flex-direction: column; gap: 12px; }
    .list-item { display: flex; align-items: center; gap: 14px; background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 14px; padding: 12px; }
    .item-index { font-family: var(--wm-f-mono); font-size: 12px; color: var(--wm-text-faint); width: 20px; text-align: center; flex-shrink: 0; }
    .item-poster { width: 48px; height: 72px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
    .item-info { flex: 1; min-width: 0; }
    .item-title { font-size: 14px; font-weight: 500; margin-bottom: 3px; }
    .item-meta { font-size: 12px; color: var(--wm-text-mute); }
    .item-service { font-size: 11px; color: var(--wm-amber); margin-top: 4px; font-family: var(--wm-f-mono); }
    .watch-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--wm-line); background: transparent; display: flex; align-items: center; justify-content: center; color: var(--wm-text-mute); cursor: pointer; flex-shrink: 0; }
    .watch-btn:hover:not(:disabled) { background: var(--wm-like-soft); color: var(--wm-like); border-color: var(--wm-like); }
    .watch-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 60px 20px; text-align: center; color: var(--wm-text-mute); }
    .btn-primary { background: var(--wm-amber); color: var(--wm-bg); border: none; height: 48px; border-radius: var(--wm-r-pill); padding: 0 32px; font-size: 15px; font-weight: 600; cursor: pointer; }
  `],
})
export class QueueComponent implements OnInit {
  private api = inject(ApiService);
  items = signal<QueueItem[]>([]);

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.api.getQueue().subscribe(q => this.items.set(q.filter(i => !i.watched)));
  }

  markWatched(item: QueueItem): void {
    this.api.markWatched(item.movie_id).subscribe(() => {
      this.items.update(list => list.filter(i => i.id !== item.id));
    });
  }
}
