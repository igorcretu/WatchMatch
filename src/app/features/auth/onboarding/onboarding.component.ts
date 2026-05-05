import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { Movie } from '../../../core/models/movie.model';

type PosterItem = Pick<Movie, 'id' | 'title' | 'year' | 'hue' | 'variant'>;

const ALL_POSTERS: PosterItem[] = [
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
  { id: 'm13', title: 'Red Meridian',         year: 2023, hue: 5,   variant: 'spotlight' },
  { id: 'm14', title: 'The Coldframe',        year: 2020, hue: 195, variant: 'stripes'   },
  { id: 'm15', title: 'Minor Planets',        year: 2024, hue: 150, variant: 'halftone'  },
  { id: 'm16', title: 'Sweet Catastrophe',    year: 2021, hue: 330, variant: 'bars'      },
  { id: 'm17', title: 'August Protocol',      year: 2019, hue: 55,  variant: 'gradient'  },
  { id: 'm18', title: 'Dust & Signal',        year: 2022, hue: 270, variant: 'spotlight' },
];

@Component({
  selector: 'wm-onboarding',
  standalone: true,
  imports: [PosterComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="landing">

      <!-- Animated poster backdrop -->
      <div class="backdrop" aria-hidden="true">
        <div class="col col-a">
          @for (m of col1; track m.id) {
            <div class="poster-wrap">
              <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster>
            </div>
          }
        </div>
        <div class="col col-b">
          @for (m of col2; track m.id) {
            <div class="poster-wrap">
              <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster>
            </div>
          }
        </div>
        <div class="col col-c">
          @for (m of col3; track m.id) {
            <div class="poster-wrap">
              <wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster>
            </div>
          }
        </div>
        <div class="backdrop-fade-top"></div>
        <div class="backdrop-fade-bot"></div>
      </div>

      <!-- CTA panel -->
      <div class="panel">
        <wm-logo variant="lockup" [size]="30"></wm-logo>

        <div class="copy">
          <h1 class="headline">Stop arguing.<br>Start <em>watching</em>.</h1>
          <p class="sub">Two people. Two filter sets. One swipe deck.<br>The first film you both like wins.</p>
        </div>

        <div class="actions">
          <button class="btn-primary" (click)="router.navigate(['/auth/register'])">
            Create account
          </button>
          <button class="btn-secondary" (click)="router.navigate(['/auth/login'])">
            Sign in
          </button>
        </div>

        <p class="legal">Free to use. No ads. Just movies.</p>
      </div>

    </div>
  `,
  styles: [`
    .landing {
      position: relative;
      width: 100%;
      height: 100dvh;
      background: var(--wm-bg);
      color: var(--wm-text);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    /* ── Backdrop ── */
    .backdrop {
      position: absolute;
      inset: 0;
      display: flex;
      gap: 8px;
      padding: 0 8px;
      pointer-events: none;
    }

    .col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Each column scrolls upward; col-b starts halfway through so columns feel offset */
    .col-a { animation: scroll-up 28s linear infinite; }
    .col-b { animation: scroll-up 24s linear infinite; margin-top: -48%; }
    .col-c { animation: scroll-up 32s linear infinite; margin-top: -24%; }

    @keyframes scroll-up {
      from { transform: translateY(0); }
      to   { transform: translateY(-50%); }
    }

    .poster-wrap {
      flex-shrink: 0;
      aspect-ratio: 2 / 3;
      border-radius: 8px;
      overflow: hidden;
      opacity: 0.72;
    }

    .backdrop-fade-top {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 35%;
      background: linear-gradient(180deg, var(--wm-bg) 0%, transparent 100%);
    }

    .backdrop-fade-bot {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 70%;
      background: linear-gradient(0deg, var(--wm-bg) 30%, transparent 100%);
    }

    /* ── Panel ── */
    .panel {
      position: relative;
      z-index: 1;
      padding: 0 24px 44px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .copy { display: flex; flex-direction: column; gap: 12px; }

    .headline {
      font-family: var(--wm-f-serif);
      font-size: 48px;
      line-height: 1.0;
      letter-spacing: -0.025em;
      font-weight: 400;
      margin: 0;
    }

    .headline em {
      color: var(--wm-amber);
      font-style: italic;
    }

    .sub {
      color: var(--wm-text-dim);
      font-size: 15px;
      line-height: 1.55;
      margin: 0;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .btn-primary {
      height: 54px;
      background: var(--wm-amber);
      color: var(--wm-bg);
      border: none;
      border-radius: var(--wm-r-pill);
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.01em;
      transition: opacity 0.15s;
    }

    .btn-primary:active { opacity: 0.85; }

    .btn-secondary {
      height: 54px;
      background: transparent;
      color: var(--wm-text);
      border: 1.5px solid var(--wm-line-strong);
      border-radius: var(--wm-r-pill);
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s;
    }

    .btn-secondary:active { border-color: var(--wm-amber); color: var(--wm-amber); }

    .legal {
      text-align: center;
      font-size: 11px;
      color: var(--wm-text-mute);
      letter-spacing: 0.04em;
      margin: 0;
    }
  `],
})
export class OnboardingComponent {
  constructor(public router: Router) {}

  col1 = [...ALL_POSTERS.slice(0, 6),  ...ALL_POSTERS.slice(0, 6)];
  col2 = [...ALL_POSTERS.slice(6, 12), ...ALL_POSTERS.slice(6, 12)];
  col3 = [...ALL_POSTERS.slice(12),    ...ALL_POSTERS.slice(12)];
}
