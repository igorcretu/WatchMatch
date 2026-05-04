import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TabBarComponent } from '../../../layout/tab-bar/tab-bar.component';
import { StatComponent } from '../../../shared/components/stat/stat.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'wm-stats',
  standalone: true,
  imports: [TabBarComponent, StatComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stats-screen">
      <div class="scroll">
        <header class="top-bar">
          <div class="label">STATS</div>
          <h1 class="page-title">Your taste<br>together</h1>
        </header>

        <div class="stats-grid">
          <wm-stat label="Films matched"     [value]="matchCount()"></wm-stat>
          <wm-stat label="Total swipes"      [value]="matchCount() * 4"></wm-stat>
          <wm-stat label="Watched together"  [value]="watchedCount()"></wm-stat>
          <wm-stat label="Agreement rate"    value="—" accent="var(--wm-amber)"></wm-stat>
        </div>

        <div class="section">
          <div class="section-title">Top genres together</div>
          @for (g of topGenres; track g.genre) {
            <div class="genre-row">
              <div class="genre-name">{{ g.genre }}</div>
              <div class="genre-bar-wrap">
                <div class="genre-bar" [style.width.%]="g.pct"></div>
              </div>
              <div class="genre-pct">{{ g.pct }}%</div>
            </div>
          }
        </div>

        <div class="section">
          <div class="section-title">Fun facts</div>
          <div class="fact-card">
            <wm-icon name="trophy" [size]="20" style="color:var(--wm-amber)"></wm-icon>
            <p>You've matched <strong>{{ matchCount() }} films</strong> together!</p>
          </div>
          <div class="fact-card">
            <wm-icon name="spark" [size]="20" style="color:var(--wm-amber)"></wm-icon>
            <p>You've watched <strong>{{ watchedCount() }}</strong> of them already.</p>
          </div>
        </div>
        <div style="height:120px"></div>
      </div>
      <wm-tab-bar active="history"></wm-tab-bar>
    </div>
  `,
  styles: [`
    .stats-screen { position: relative; width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); overflow: hidden; }
    .scroll { height: 100%; overflow-y: auto; }
    .top-bar { padding: 16px 20px 20px; }
    .label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; color: var(--wm-text-mute); }
    .page-title { font-family: var(--wm-f-serif); font-size: 36px; letter-spacing: -0.02em; margin: 4px 0; font-weight: 400; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 0 20px 32px; }
    .section { padding: 0 20px 28px; }
    .section-title { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--wm-text-mute); margin-bottom: 16px; }
    .genre-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .genre-name { width: 80px; font-size: 13px; flex-shrink: 0; }
    .genre-bar-wrap { flex: 1; height: 4px; background: var(--wm-bg4); border-radius: 2px; }
    .genre-bar { height: 100%; background: var(--wm-amber); border-radius: 2px; transition: width 0.5s ease; }
    .genre-pct { font-family: var(--wm-f-mono); font-size: 11px; color: var(--wm-text-mute); width: 32px; text-align: right; }
    .fact-card { background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 14px; padding: 16px; display: flex; gap: 12px; align-items: flex-start; margin-bottom: 10px; }
    .fact-card p { font-size: 14px; line-height: 1.5; color: var(--wm-text-dim); }
    .fact-card strong { color: var(--wm-text); }
  `],
})
export class StatsComponent implements OnInit {
  private api = inject(ApiService);
  matchCount   = signal(0);
  watchedCount = signal(0);

  topGenres = [
    { genre: 'Drama',    pct: 82 }, { genre: 'Comedy',  pct: 68 },
    { genre: 'Thriller', pct: 55 }, { genre: 'Sci-Fi',  pct: 44 },
    { genre: 'Romance',  pct: 38 },
  ];

  ngOnInit(): void {
    this.api.getQueue().subscribe(q => this.matchCount.set(q.length));
    this.api.getHistory().subscribe(h => this.watchedCount.set(h.length));
  }
}
