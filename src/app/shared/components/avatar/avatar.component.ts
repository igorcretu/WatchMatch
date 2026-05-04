import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'wm-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="avatar" [style]="styles">{{ initial }}</div>`,
  styles: [`
    .avatar {
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-family: var(--wm-f-serif); color: var(--wm-text);
      line-height: 1; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
    }
  `],
})
export class AvatarComponent {
  @Input() name = '?';
  @Input() hue = 30;
  @Input() size = 32;

  get initial(): string { return (this.name || '?').slice(0, 1).toUpperCase(); }
  get styles(): Record<string, string> {
    return {
      width: `${this.size}px`, height: `${this.size}px`,
      fontSize: `${this.size * 0.5}px`,
      background: `linear-gradient(135deg, oklch(0.6 0.13 ${this.hue}), oklch(0.35 0.10 ${(this.hue + 50) % 360}))`,
    };
  }
}
