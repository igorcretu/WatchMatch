import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, IconName } from '../../shared/components/icon/icon.component';

interface Tab { id: string; label: string; icon: IconName; route: string; }

@Component({
  selector: 'wm-tab-bar',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="tab-bar" role="navigation" aria-label="Main navigation">
      @for (tab of tabs; track tab.id) {
        <a class="tab" [routerLink]="tab.route"
           [class.tab--active]="active === tab.id"
           [attr.aria-label]="tab.label" [attr.aria-current]="active === tab.id ? 'page' : null">
          <wm-icon [name]="tab.icon" [size]="20"></wm-icon>
          <span class="tab-label">{{ tab.label }}</span>
        </a>
      }
    </nav>
  `,
  styles: [`
    .tab-bar {
      position: absolute; bottom: 18px; left: 12px; right: 12px;
      background: rgba(28,25,22,0.78); border: 1px solid var(--wm-line);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border-radius: 28px; padding: 10px 8px;
      display: flex; justify-content: space-around; align-items: center; z-index: 30;
    }
    .tab {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      color: var(--wm-text-mute); padding: 4px 8px; min-width: 52px;
      text-decoration: none; transition: color 0.15s;
    }
    .tab--active { color: var(--wm-amber); }
    .tab-label { font-size: 10px; font-weight: 500; letter-spacing: 0.1px; }
  `],
})
export class TabBarComponent {
  @Input() active = 'home';

  readonly tabs: Tab[] = [
    { id: 'home',    label: 'Home',    icon: 'spark',    route: '/' },
    { id: 'swipe',   label: 'Swipe',   icon: 'bolt',     route: '/session/new' },
    { id: 'queue',   label: 'Queue',   icon: 'bookmark', route: '/library/queue' },
    { id: 'history', label: 'History', icon: 'list',     route: '/library/history' },
    { id: 'me',      label: 'Me',      icon: 'user',     route: '/profile' },
  ];
}
