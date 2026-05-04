import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabBarComponent } from '../tab-bar/tab-bar.component';

@Component({
  selector: 'wm-mobile-shell',
  standalone: true,
  imports: [TabBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell" [class.shell--scroll]="scroll">
      <ng-content></ng-content>
      <wm-tab-bar *ngIf="showTabBar" [active]="activeTab"></wm-tab-bar>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .shell {
      width: 100%; height: 100%; background: var(--wm-bg); color: var(--wm-text);
      font-family: var(--wm-f-ui); position: relative; overflow: hidden;
    }
    .shell--scroll { overflow-y: auto; }
  `],
})
export class MobileShellComponent {
  @Input() scroll = false;
  @Input() showTabBar = true;
  @Input() activeTab: string = 'home';
}
