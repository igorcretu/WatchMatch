import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'wm-stat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat">
      <div class="label">{{ label }}</div>
      <div class="value" [style.color]="accent || 'var(--wm-text)'">{{ value }}</div>
    </div>
  `,
  styles: [`
    .label {
      font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.16em;
      text-transform: uppercase; color: var(--wm-text-mute); margin-bottom: 6px;
    }
    .value { font-family: var(--wm-f-serif); font-size: 32px; line-height: 1; }
  `],
})
export class StatComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() accent = '';
}
