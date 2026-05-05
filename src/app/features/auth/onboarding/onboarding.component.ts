import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { PosterComponent } from '../../../shared/components/poster/poster.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { Movie } from '../../../core/models/movie.model';

type PosterItem = Pick<Movie, 'id' | 'title' | 'year' | 'hue' | 'variant'>;

const ALL_POSTERS: PosterItem[] = [
  { id: 'm01', title: 'Inception',                         year: 2010, hue: 220, variant: 'halftone'  },
  { id: 'm02', title: 'Parasite',                          year: 2019, hue: 120, variant: 'spotlight' },
  { id: 'm03', title: 'Interstellar',                      year: 2014, hue: 200, variant: 'gradient'  },
  { id: 'm04', title: 'La La Land',                        year: 2016, hue: 280, variant: 'spotlight' },
  { id: 'm05', title: 'The Dark Knight',                   year: 2008, hue: 210, variant: 'gradient'  },
  { id: 'm06', title: 'Everything Everywhere All at Once', year: 2022, hue: 350, variant: 'bars'      },
  { id: 'm07', title: 'Her',                               year: 2013, hue: 25,  variant: 'gradient'  },
  { id: 'm08', title: 'Get Out',                           year: 2017, hue: 140, variant: 'gradient'  },
  { id: 'm09', title: 'Knives Out',                        year: 2019, hue: 40,  variant: 'halftone'  },
  { id: 'm10', title: 'The Grand Budapest Hotel',          year: 2014, hue: 330, variant: 'spotlight' },
  { id: 'm11', title: 'Mad Max: Fury Road',                year: 2015, hue: 30,  variant: 'bars'      },
  { id: 'm12', title: 'Whiplash',                          year: 2014, hue: 10,  variant: 'gradient'  },
  { id: 'm13', title: 'Moonlight',                         year: 2016, hue: 200, variant: 'spotlight' },
  { id: 'm14', title: 'Spirited Away',                     year: 2001, hue: 180, variant: 'gradient'  },
  { id: 'm15', title: 'Portrait of a Lady on Fire',        year: 2019, hue: 20,  variant: 'stripes'   },
  { id: 'm16', title: 'Hereditary',                        year: 2018, hue: 55,  variant: 'halftone'  },
];

const STEPS = [
  { n: '01', title: 'Set your filters', body: 'Each of you picks genres, streaming services, release years — independently.' },
  { n: '02', title: 'Swipe the deck',   body: 'You both swipe through the same shared queue. Like it, pass, or skip.' },
  { n: '03', title: 'Watch together',   body: 'The first film you both swipe right on is the winner. No arguments.' },
];

const FEATURES = [
  { icon: 'filter', label: 'Smart filters',   desc: 'Genre, year, runtime, and streaming service — filter by both your libraries.' },
  { icon: 'sync',   label: 'Real-time sync',  desc: 'Swipe from different rooms. Match the moment you both agree.' },
  { icon: 'heart',  label: 'Watchlist',        desc: 'Liked it but not tonight? Save to your shared queue for later.' },
];

@Component({
  selector: 'wm-onboarding',
  standalone: true,
  imports: [PosterComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lp">

      <!-- ── HERO ── -->
      <section class="hero">

        <!-- Poster backdrop (left on desktop, full on mobile) -->
        <div class="backdrop" aria-hidden="true">
          <div class="col col-a">
            @for (m of col1; track m.id) {
              <div class="pw"><wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster></div>
            }
          </div>
          <div class="col col-b">
            @for (m of col2; track m.id) {
              <div class="pw"><wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster></div>
            }
          </div>
          <div class="col col-c">
            @for (m of col3; track m.id) {
              <div class="pw"><wm-poster [title]="m.title" [year]="m.year" [hue]="m.hue" [variant]="m.variant"></wm-poster></div>
            }
          </div>
          <div class="fade-top"></div>
          <div class="fade-bot"></div>
          <div class="fade-right"></div>
        </div>

        <!-- CTA panel -->
        <div class="hero-cta">
          <wm-logo variant="lockup" [size]="30"></wm-logo>
          <div class="hero-copy">
            <h1 class="headline">Stop arguing.<br>Start <em>watching</em>.</h1>
            <p class="sub">Two people. One shared swipe deck.<br>The first film you both like wins.</p>
          </div>
          <div class="actions">
            <button class="btn-primary" (click)="router.navigate(['/auth/register'])">Create account</button>
            <button class="btn-ghost-pill" (click)="router.navigate(['/auth/login'])">Sign in</button>
          </div>
          <div class="scroll-hint" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </div>

      </section>

      <!-- ── HOW IT WORKS ── -->
      <section class="section how">
        <div class="inner">
          <p class="section-label">How it works</p>
          <h2 class="section-title">Three steps to movie night</h2>
          <div class="steps">
            @for (s of steps; track s.n) {
              <div class="step">
                <div class="step-num">{{ s.n }}</div>
                <div class="step-text">
                  <div class="step-title">{{ s.title }}</div>
                  <div class="step-body">{{ s.body }}</div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ── FEATURES ── -->
      <section class="section features">
        <div class="inner">
          <p class="section-label">Built for two</p>
          <h2 class="section-title">Everything you need,<br>nothing you don't</h2>
          <div class="feature-grid">
            @for (f of features; track f.icon) {
              <div class="feature-card">
                <div class="feature-icon">
                  @if (f.icon === 'filter') {
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                    </svg>
                  }
                  @if (f.icon === 'sync') {
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                    </svg>
                  }
                  @if (f.icon === 'heart') {
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                  }
                </div>
                <div class="feature-label">{{ f.label }}</div>
                <div class="feature-desc">{{ f.desc }}</div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ── FINAL CTA ── -->
      <section class="section cta-final">
        <div class="inner cta-inner">
          <wm-logo variant="mark" [size]="48"></wm-logo>
          <h2 class="cta-headline">Ready to watch something<br><em>together</em>?</h2>
          <button class="btn-primary btn-cta" (click)="router.navigate(['/auth/register'])">
            Get started — it's free
          </button>
          <p class="signin-nudge">
            Already have an account?
            <button class="link" (click)="router.navigate(['/auth/login'])">Sign in</button>
          </p>
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* ── Root ── */
    .lp {
      width: 100%;
      background: var(--wm-bg);
      color: var(--wm-text);
      overflow-x: hidden;
    }

    /* ── HERO ── */
    .hero {
      position: relative;
      height: 100dvh;
      min-height: 600px;
      overflow: hidden;
    }

    /* Mobile: backdrop fills full hero, CTA overlays at bottom */
    .backdrop {
      position: absolute;
      inset: 0;
      display: flex;
      gap: 8px;
      padding: 0 8px;
    }

    .col {
      flex: 1;
      max-width: 120px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
    }

    /* Mobile animation speeds */
    .col-a { animation: scroll-up 30s linear infinite; }
    .col-b { animation: scroll-up 26s linear infinite; margin-top: -52%; }
    .col-c { animation: scroll-up 34s linear infinite; margin-top: -28%; }

    @keyframes scroll-up {
      from { transform: translateY(0); }
      to   { transform: translateY(-50%); }
    }

    .pw {
      flex-shrink: 0;
      aspect-ratio: 2 / 3;
      border-radius: 8px;
      overflow: hidden;
      opacity: 0.72;
    }

    .fade-top {
      position: absolute; top: 0; left: 0; right: 0; height: 25%;
      background: linear-gradient(180deg, var(--wm-bg) 0%, transparent 100%);
    }
    .fade-bot {
      position: absolute; bottom: 0; left: 0; right: 0; height: 68%;
      background: linear-gradient(0deg, var(--wm-bg) 25%, transparent 100%);
    }
    .fade-right { display: none; }

    /* Mobile CTA: anchored to bottom */
    .hero-cta {
      position: absolute;
      left: 0; right: 0; bottom: 0;
      z-index: 1;
      padding: 0 24px 44px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .hero-copy { display: flex; flex-direction: column; gap: 12px; }

    .headline {
      font-family: var(--wm-f-serif);
      font-size: clamp(40px, 10vw, 56px);
      line-height: 1.0;
      letter-spacing: -0.025em;
      font-weight: 400;
      margin: 0;
    }
    .headline em { color: var(--wm-amber); font-style: italic; }

    .sub {
      color: var(--wm-text-dim);
      font-size: 15px;
      line-height: 1.6;
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
      transition: opacity 0.15s;
    }
    .btn-primary:active { opacity: 0.82; }

    .btn-ghost-pill {
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
    .btn-ghost-pill:active { border-color: var(--wm-amber); color: var(--wm-amber); }

    .scroll-hint {
      display: flex;
      justify-content: center;
      color: var(--wm-text-mute);
      animation: bob 2.4s ease-in-out infinite;
    }
    @keyframes bob {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(5px); }
    }

    /* ── Shared section styles ── */
    .section {
      border-top: 1px solid var(--wm-line);
      padding: 72px 24px 64px;
    }
    .inner {
      max-width: 880px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .section-label {
      font-family: var(--wm-f-mono);
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--wm-amber);
      margin: 0;
    }
    .section-title {
      font-family: var(--wm-f-serif);
      font-size: clamp(28px, 5vw, 38px);
      font-weight: 400;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin: -16px 0 0;
    }

    /* ── How it works ── */
    .steps { display: flex; flex-direction: column; }

    .step {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      padding: 20px 0;
      border-bottom: 1px solid var(--wm-line);
    }
    .step:first-child { border-top: 1px solid var(--wm-line); }
    .step-num {
      font-family: var(--wm-f-mono);
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--wm-amber);
      padding-top: 3px;
      flex-shrink: 0;
      width: 28px;
    }
    .step-text { display: flex; flex-direction: column; gap: 4px; }
    .step-title { font-size: 16px; font-weight: 600; }
    .step-body { font-size: 14px; line-height: 1.55; color: var(--wm-text-dim); }

    /* ── Features ── */
    .features { background: var(--wm-bg2); }

    .feature-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .feature-card {
      background: var(--wm-bg3);
      border: 1px solid var(--wm-line);
      border-radius: var(--wm-r-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .feature-icon {
      width: 44px; height: 44px;
      background: var(--wm-amber-soft);
      border-radius: var(--wm-r-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--wm-amber);
    }
    .feature-label { font-size: 16px; font-weight: 600; }
    .feature-desc  { font-size: 14px; line-height: 1.55; color: var(--wm-text-dim); }

    /* ── Final CTA ── */
    .cta-inner {
      align-items: center;
      text-align: center;
    }
    .cta-headline {
      font-family: var(--wm-f-serif);
      font-size: clamp(30px, 6vw, 44px);
      font-weight: 400;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .cta-headline em { color: var(--wm-amber); font-style: italic; }
    .btn-cta { width: 100%; max-width: 280px; height: 56px; font-size: 16px; }
    .signin-nudge { font-size: 13px; color: var(--wm-text-mute); margin: 0; }
    .link {
      background: none; border: none;
      color: var(--wm-amber); font-size: 13px; cursor: pointer; padding: 0;
    }

    /* ── DESKTOP (≥768px) ── */
    @media (min-width: 768px) {

      /* Hero: left panel (fixed-width posters) + right panel (CTA) */
      .hero { display: flex; align-items: stretch; }

      /* Backdrop becomes a fixed-width left column so poster dimensions
         never change with viewport — this keeps animation speed identical
         on all screen sizes */
      .backdrop {
        position: relative;
        width: auto;
        flex-shrink: 0;
        inset: auto;
      }

      /* Fix column width so poster height is always ~165px regardless of screen */
      .col {
        flex: none;
        width: 110px;
      }

      .fade-top { display: none; }
      .fade-bot { display: none; }
      .fade-right {
        display: block;
        position: absolute;
        top: 0; right: 0; bottom: 0;
        width: 50%;
        background: linear-gradient(90deg, transparent 0%, var(--wm-bg) 100%);
      }

      /* CTA: right side, centered vertically */
      .hero-cta {
        position: relative;
        left: auto; right: auto; bottom: auto;
        flex: 1;
        padding: 0 56px;
        justify-content: center;
        align-items: flex-start;
      }

      /* Buttons: natural width on desktop */
      .actions { flex-direction: row; flex-wrap: wrap; gap: 12px; }
      .btn-primary, .btn-ghost-pill {
        width: auto;
        padding: 0 28px;
        flex-shrink: 0;
      }

      .scroll-hint { display: none; }

      /* Section layout */
      .section { padding: 80px 48px; }

      /* Features: 3 columns */
      .feature-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }

      /* Steps: horizontal */
      .steps { flex-direction: row; border-top: 1px solid var(--wm-line); border-bottom: 1px solid var(--wm-line); }
      .step {
        flex: 1; flex-direction: column; gap: 12px;
        padding: 24px 24px 24px 0;
        border-bottom: none; border-top: none;
        border-right: 1px solid var(--wm-line);
        margin-right: 24px;
      }
      .step:last-child { border-right: none; margin-right: 0; padding-right: 0; }
    }

    @media (min-width: 1200px) {
      .hero-cta { padding: 0 72px; max-width: 560px; }
    }
  `],
})
export class OnboardingComponent {
  constructor(public router: Router) {}

  steps    = STEPS;
  features = FEATURES;

  col1 = [...ALL_POSTERS.slice(0, 6),  ...ALL_POSTERS.slice(0, 6)];
  col2 = [...ALL_POSTERS.slice(6, 12), ...ALL_POSTERS.slice(6, 12)];
  col3 = [...ALL_POSTERS.slice(12, 16),...ALL_POSTERS.slice(12, 16)];
}
