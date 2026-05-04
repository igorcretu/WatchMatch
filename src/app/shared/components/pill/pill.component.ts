import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPill } from '../../../core/models/movie.model';

@Component({
  selector: 'wm-pill',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="pill" [class]="'pill--' + state" (click)="clicked.emit()" type="button">
      <span class="state-dot" *ngIf="state !== 'nice'"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .pill {
      padding: 7px 13px; border-radius: 999px; display: inline-flex;
      align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;
      font-family: var(--wm-f-ui); font-size: 12px; font-weight: 500;
      letter-spacing: 0.01em; transition: all 0.15s ease;
      background: transparent; border: 1px solid var(--wm-line);
      color: var(--wm-text-dim);
    }
    .pill--nice {
      background: transparent; border-color: var(--wm-line); color: var(--wm-text-dim);
    }
    .pill--must {
      background: var(--wm-amber-soft); border-color: var(--wm-amber-line); color: var(--wm-amber);
    }
    .pill--no {
      background: var(--wm-pass-soft); border-color: var(--wm-pass); color: var(--wm-pass);
      text-decoration: line-through;
    }
    .state-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: currentColor; flex-shrink: 0;
    }
  `],
})
export class PillComponent {
  @Input() state: FilterPill['state'] = 'nice';
  @Output() clicked = new EventEmitter<void>();
}
