import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Mark_Interlock — the primary WatchMatch brand mark.
 * Two W chevrons meeting at a centre dot (the screen between two viewers).
 * Built on a 64-unit grid as defined in brand-marks.jsx.
 *
 * variant="mark"    → icon only (square, use for favicons / avatars / tab bar)
 * variant="lockup"  → icon + "WatchMatch" wordmark side by side (use for headers)
 */
@Component({
  selector: 'wm-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="logo" [class.logo--lockup]="variant === 'lockup'" [style.gap.px]="size * 0.32">
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64" fill="none"
           xmlns="http://www.w3.org/2000/svg" [attr.aria-hidden]="variant === 'lockup'">
        <path d="M 6 14 L 16 50 L 22 32 L 28 50 L 32 38"
              [attr.stroke]="amber" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 32 26 L 36 14 L 42 32 L 48 14 L 58 50"
              [attr.stroke]="amber" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.92"/>
        <circle cx="32" cy="32" r="3" [attr.fill]="amber"/>
      </svg>
      @if (variant === 'lockup') {
        <span class="wordmark" [style.font-size.px]="size * 0.85" [style.color]="fg">WatchMatch</span>
      }
    </div>
  `,
  styles: [`
    .logo {
      display: inline-flex;
      align-items: center;
    }
    .logo--lockup {
      gap: inherit;
    }
    .wordmark {
      font-family: "Instrument Serif", Georgia, serif;
      line-height: 1.0;
      letter-spacing: -0.02em;
      font-weight: 400;
    }
    svg { flex-shrink: 0; display: block; }
  `],
})
export class LogoComponent {
  @Input() variant: 'mark' | 'lockup' = 'mark';
  @Input() size   = 32;
  @Input() amber  = 'oklch(0.78 0.15 70)';
  @Input() fg     = '#f5efe4';
}
