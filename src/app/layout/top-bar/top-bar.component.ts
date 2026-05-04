import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'wm-top-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top-bar">
      <div class="top-bar__row">
        <div class="top-bar__leading">
          <ng-content select="[leading]"></ng-content>
        </div>
        <div class="top-bar__trailing">
          <ng-content select="[trailing]"></ng-content>
        </div>
      </div>
      @if (title) {
        <h1 class="top-bar__title">{{ title }}</h1>
      }
      @if (sub) {
        <p class="top-bar__sub">{{ sub }}</p>
      }
    </header>
  `,
  styles: [`
    .top-bar { padding: 8px 20px 14px; display: flex; flex-direction: column; gap: 4px; }
    .top-bar__row {
      display: flex; align-items: center; justify-content: space-between; min-height: 32px;
    }
    .top-bar__leading, .top-bar__trailing { display: flex; align-items: center; gap: 10px; }
    .top-bar__title {
      font-family: var(--wm-f-serif); font-size: 36px; line-height: 1.05;
      letter-spacing: -0.02em; margin-top: 6px; font-weight: 400;
    }
    .top-bar__sub {
      font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.16em;
      text-transform: uppercase; color: var(--wm-text-mute); margin-top: 2px;
    }
  `],
})
export class TopBarComponent {
  @Input() title = '';
  @Input() sub = '';
}
