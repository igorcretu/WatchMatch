import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosterVariant } from '../../../core/models/movie.model';

@Component({
  selector: 'wm-poster',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="poster" [style.background]="bg">
      <div class="grain"></div>
      <div class="vignette"></div>
      <div class="title-block">
        <div class="year">{{ year }}</div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="corner-mark">
        <svg width="14" height="14" viewBox="0 0 64 64" fill="none" opacity="0.45">
          <path d="M 6 14 L 16 50 L 22 32 L 28 50 L 32 38" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 32 26 L 36 14 L 42 32 L 48 14 L 58 50" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0.92"/>
          <circle cx="32" cy="32" r="4" fill="currentColor"/>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .poster {
      position: relative; width: 100%; height: 100%;
      overflow: hidden; border-radius: inherit;
    }
    .grain {
      position: absolute; inset: 0; opacity: 0.18; mix-blend-mode: overlay;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
    }
    .vignette {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%);
    }
    .title-block {
      position: absolute; left: 0; right: 0; bottom: 0;
      padding: 14% 8% 10%; color: var(--wm-text); font-family: var(--wm-f-mono);
    }
    .year {
      font-size: 0.62em; letter-spacing: 0.18em; opacity: 0.5;
      text-transform: uppercase; margin-bottom: 0.4em;
    }
    .title {
      font-family: var(--wm-f-serif); font-size: 1.5em; line-height: 1.0;
      letter-spacing: -0.01em; text-transform: uppercase; font-weight: 400;
    }
    .corner-mark {
      position: absolute; top: 6%; left: 6%;
      color: var(--wm-text); display: flex; align-items: center;
    }
  `],
})
export class PosterComponent {
  @Input() title = '';
  @Input() year = 0;
  @Input() hue = 30;
  @Input() variant: PosterVariant = 'gradient';

  get bg(): string {
    const h = this.hue;
    switch (this.variant) {
      case 'gradient':  return `linear-gradient(${135 + h}deg, oklch(0.30 0.12 ${h}) 0%, oklch(0.18 0.08 ${(h+40)%360}) 60%, oklch(0.10 0.04 ${(h+80)%360}) 100%)`;
      case 'stripes':   return `repeating-linear-gradient(${45+h}deg, oklch(0.22 0.08 ${h}) 0 14px, oklch(0.16 0.05 ${h}) 14px 28px)`;
      case 'spotlight': return `radial-gradient(ellipse at 30% 20%, oklch(0.50 0.14 ${h}) 0%, oklch(0.18 0.06 ${h}) 50%, oklch(0.06 0.02 ${h}) 100%)`;
      case 'halftone':  return `radial-gradient(circle at 1px 1px, oklch(0.55 0.12 ${h}) 1px, transparent 1.5px) 0 0/8px 8px, linear-gradient(180deg, oklch(0.16 0.06 ${h}), oklch(0.08 0.03 ${h}))`;
      case 'bars':      return `linear-gradient(180deg, oklch(0.40 0.13 ${h}) 0% 20%, oklch(0.20 0.08 ${h}) 20% 40%, oklch(0.50 0.14 ${(h+30)%360}) 40% 60%, oklch(0.18 0.06 ${h}) 60% 80%, oklch(0.30 0.10 ${h}) 80% 100%)`;
      default:          return `oklch(0.20 0.08 ${h})`;
    }
  }
}
