import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PosterComponent } from '../../shared/components/poster/poster.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ApiService } from '../../core/services/api.service';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'wm-solo',
  standalone: true,
  imports: [PosterComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="solo-screen">
      <header class="top">
        <button class="btn-ghost" (click)="router.navigate(['/'])"><wm-icon name="back" [size]="18"></wm-icon></button>
        <div class="mono-label">SOLO MODE</div>
        <div style="width:34px"></div>
      </header>
      <div class="content">
        <h1 class="headline">Just for<br><em>you</em>.</h1>
        <p class="sub">Swipe through picks tuned to your taste. No partner needed tonight.</p>

        <div class="picks-grid">
          @for (m of picks(); track m.id) {
            <div class="pick" (click)="router.navigate(['/session/new'])">
              <div class="pick-poster">
                <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster>
              </div>
              <div class="pick-title">{{ m.title }}</div>
              <div class="pick-meta">{{ m.providers[0] }} · {{ m.runtime }}m</div>
            </div>
          }
        </div>

        <button class="btn-primary" (click)="router.navigate(['/session/new'])">Start solo session →</button>
      </div>
    </div>
  `,
  styles: [`
    .solo-screen { width: 100%; min-height: 100vh; background: var(--wm-bg); color: var(--wm-text); }
    .top { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
    .btn-ghost { background: none; border: none; color: var(--wm-text); cursor: pointer; padding: 8px; }
    .mono-label { font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--wm-text-mute); }
    .content { padding: 16px 24px; display: flex; flex-direction: column; gap: 24px; }
    .headline { font-family: var(--wm-f-serif); font-size: 40px; line-height: 1.05; letter-spacing: -0.02em; font-weight: 400; }
    .headline em { color: var(--wm-amber); font-style: italic; }
    .sub { font-size: 15px; color: var(--wm-text-dim); line-height: 1.5; }
    .picks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .pick { cursor: pointer; }
    .pick-poster { aspect-ratio: 2/3; border-radius: 12px; overflow: hidden; margin-bottom: 8px; }
    .pick-title { font-size: 13px; font-weight: 500; line-height: 1.3; }
    .pick-meta { font-size: 11px; color: var(--wm-text-mute); margin-top: 2px; }
    .btn-primary { height: 52px; background: var(--wm-amber); color: var(--wm-bg); border: none; border-radius: var(--wm-r-pill); font-size: 16px; font-weight: 600; cursor: pointer; }
  `],
})
export class SoloComponent implements OnInit {
  private api = inject(ApiService);
  picks = signal<Movie[]>([]);

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.api.getMovies().subscribe(movies => this.picks.set(movies.slice(0, 6)));
  }
}
