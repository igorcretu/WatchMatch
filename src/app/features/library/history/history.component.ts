import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { TabBarComponent } from '../../../layout/tab-bar/tab-bar.component';
import { ApiService } from '../../../core/services/api.service';
import { QueueItem } from '../../../core/models/movie.model';

@Component({
  selector: 'wm-history',
  standalone: true,
  imports: [PosterComponent, IconComponent, TabBarComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="history-screen">
      <div class="scroll">
        <header class="top-bar">
          <div class="label">HISTORY</div>
          <h1 class="page-title">Watched together</h1>
          <p class="page-sub">{{ items().length }} films marked as watched</p>
        </header>

        <div class="list">
          @for (item of items(); track item.id) {
            <div class="list-item">
              <div class="item-poster">
                <wm-poster [title]="item.movie.title" [year]="item.movie.year"
                  [hue]="item.movie.hue" [variant]="item.movie.variant" [posterPath]="item.movie.poster_path"></wm-poster>
              </div>
              <div class="item-info">
                <div class="item-title">{{ item.movie.title }}</div>
                <div class="item-meta">{{ item.movie.year }} · {{ item.movie.runtime }}m</div>
                <div class="watched-badge"><wm-icon name="check" [size]="10"></wm-icon> Watched</div>
                <div class="stars">
                  @for (n of [1,2,3,4,5]; track n) {
                    <button class="star-btn" [class.star-btn--active]="(item.rating ?? 0) >= n"
                      (click)="rate(item, n)">★</button>
                  }
                </div>
              </div>
            </div>
          }
          @empty {
            <div class="empty">
              <wm-icon name="list" [size]="48" style="color:var(--wm-text-mute)"></wm-icon>
              <p>Nothing watched yet.<br>Mark films from your queue!</p>
              <button class="btn-nav" (click)="router.navigate(['/library/queue'])">Go to queue →</button>
            </div>
          }
        </div>
        <div style="height:120px"></div>
      </div>
      <wm-tab-bar active="history"></wm-tab-bar>
    </div>
  `,
  styles: [`
    .history-screen { position: relative; width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); overflow: hidden; }
    .scroll { height: 100%; overflow-y: auto; }
    .top-bar { padding: 16px 20px 20px; }
    .label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; color: var(--wm-text-mute); }
    .page-title { font-family: var(--wm-f-serif); font-size: 36px; letter-spacing: -0.02em; margin: 4px 0; font-weight: 400; }
    .page-sub { font-size: 14px; color: var(--wm-text-dim); }
    .list { padding: 0 20px; display: flex; flex-direction: column; gap: 12px; }
    .list-item { display: flex; gap: 14px; background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 14px; padding: 12px; }
    .item-poster { width: 48px; height: 72px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
    .item-info { flex: 1; }
    .item-title { font-size: 14px; font-weight: 500; margin-bottom: 3px; }
    .item-meta { font-size: 12px; color: var(--wm-text-mute); margin-bottom: 6px; }
    .watched-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; background: var(--wm-like-soft); color: var(--wm-like); border-radius: var(--wm-r-pill); font-size: 10px; font-family: var(--wm-f-mono); margin-bottom: 8px; }
    .stars { display: flex; gap: 2px; }
    .star-btn { background: none; border: none; font-size: 18px; color: var(--wm-text-faint); cursor: pointer; padding: 0 2px; line-height: 1; }
    .star-btn--active { color: var(--wm-amber); }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 60px 20px; text-align: center; color: var(--wm-text-mute); }
    .btn-nav { background: none; border: 1px solid var(--wm-line); border-radius: var(--wm-r-pill); padding: 10px 20px; color: var(--wm-amber); cursor: pointer; font-size: 14px; }
  `],
})
export class HistoryComponent implements OnInit {
  private api = inject(ApiService);
  items = signal<QueueItem[]>([]);

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.api.getHistory().subscribe(items => this.items.set(items));
  }

  rate(item: QueueItem, stars: number): void {
    this.api.rateMovie(item.movie_id, stars).subscribe(() => {
      this.items.update(list => list.map(i => i.id === item.id ? { ...i, rating: stars } : i));
    });
  }
}
