import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { Movie } from '../../../core/models/movie.model';

const PREVIEW_MOVIES: Pick<Movie, 'id' | 'title' | 'year' | 'hue' | 'variant'>[] = [
  { id: 'm01', title: 'The Quiet Engine',     year: 2023, hue: 28,  variant: 'gradient'  },
  { id: 'm02', title: 'Velvet Static',        year: 2021, hue: 350, variant: 'spotlight' },
  { id: 'm03', title: 'North of Memory',      year: 2024, hue: 220, variant: 'halftone'  },
  { id: 'm04', title: 'Bring The House Down', year: 2022, hue: 18,  variant: 'bars'      },
  { id: 'm05', title: 'Ash Garden',           year: 2020, hue: 40,  variant: 'gradient'  },
  { id: 'm06', title: 'The Last Telephone',   year: 2019, hue: 280, variant: 'stripes'   },
  { id: 'm07', title: 'Fluorescence',         year: 2024, hue: 180, variant: 'spotlight' },
  { id: 'm08', title: 'Catch the Moonshade',  year: 2018, hue: 60,  variant: 'gradient'  },
  { id: 'm09', title: 'Concrete Lullaby',     year: 2023, hue: 320, variant: 'halftone'  },
  { id: 'm10', title: 'Hotel Pacific',        year: 2025, hue: 200, variant: 'spotlight' },
  { id: 'm11', title: 'How to Lose a War',    year: 2017, hue: 100, variant: 'bars'      },
  { id: 'm12', title: 'Glassland',            year: 2022, hue: 240, variant: 'gradient'  },
];

@Component({
  selector: 'wm-onboarding',
  standalone: true,
  imports: [PosterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="onboarding">
      <div class="hero">
        <div class="collage">
          @for (m of movies; track m.id) {
            <div class="collage-item">
              <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster>
            </div>
          }
        </div>
        <div class="hero-fade"></div>
      </div>

      <div class="cta">
        <div class="brand">WATCHMATCH</div>
        <h1 class="headline">Stop arguing.<br>Start <em>watching</em>.</h1>
        <p class="sub">Two people. Two filter sets. One swipe deck. The first thing you both like wins.</p>

        <div class="actions">
          <button class="btn-primary" (click)="router.navigate(['/auth/register'])">Create account</button>
          <button class="btn-secondary" (click)="router.navigate(['/auth/login'])">Sign in</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding { position: relative; width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); overflow: hidden; }
    .hero { position: absolute; top: 44px; left: 0; right: 0; height: 360px; overflow: hidden; }
    .collage {
      position: absolute; inset: 0;
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 12px;
      transform: rotate(-8deg) scale(1.4) translate(-10%, -8%);
    }
    .collage-item { aspect-ratio: 2/3; border-radius: 6px; overflow: hidden; opacity: 0.85; }
    .hero-fade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,9,8,0.8) 0%, transparent 30%, var(--wm-bg) 90%); }
    .cta { position: absolute; left: 24px; right: 24px; bottom: 40px; display: flex; flex-direction: column; gap: 18px; }
    .brand { font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.3em; color: var(--wm-amber); }
    .headline { font-family: var(--wm-f-serif); font-size: 44px; line-height: 1.0; letter-spacing: -0.02em; font-weight: 400; }
    .headline em { color: var(--wm-amber); font-style: italic; }
    .sub { color: var(--wm-text-dim); font-size: 15px; line-height: 1.5; }
    .actions { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
    .btn-primary { background: var(--wm-amber); color: var(--wm-bg); border: none; height: 52px; border-radius: 26px; font-size: 15px; font-weight: 600; cursor: pointer; }
    .btn-secondary { background: transparent; color: var(--wm-text); border: 1px solid var(--wm-line-strong); height: 52px; border-radius: 26px; font-size: 15px; font-weight: 500; cursor: pointer; }
  `],
})
export class OnboardingComponent {
  movies = PREVIEW_MOVIES;
  constructor(public router: Router) {}
}
