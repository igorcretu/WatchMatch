import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

const MEMBERS = [
  { name: 'Igor', hue: 30 }, { name: 'Ana', hue: 340 },
  { name: 'Dan', hue: 200 }, { name: 'Maria', hue: 120 },
];

@Component({
  selector: 'wm-group',
  standalone: true,
  imports: [AvatarComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group-screen">
      <header class="top">
        <button class="btn-ghost" (click)="router.navigate(['/'])"><wm-icon name="back" [size]="18"></wm-icon></button>
        <div class="mono-label">GROUP SESSION</div>
        <button class="btn-ghost"><wm-icon name="users" [size]="18"></wm-icon></button>
      </header>
      <div class="content">
        <h1 class="headline">Movie night<br><em>for four</em>.</h1>
        <div class="members">
          @for (m of members; track m.name) {
            <div class="member">
              <wm-avatar [name]="m.name" [hue]="m.hue" [size]="52"></wm-avatar>
              <span class="member-name">{{ m.name }}</span>
              <div class="member-ready">Ready</div>
            </div>
          }
          <button class="add-btn"><wm-icon name="plus" [size]="20" style="color:var(--wm-amber)"></wm-icon></button>
        </div>
        <p class="rule-note">A majority match (3/4) wins the session.</p>
        <button class="btn-primary" (click)="router.navigate(['/session/new'])">Start group session →</button>
      </div>
    </div>
  `,
  styles: [`
    .group-screen { width: 100%; min-height: 100vh; background: var(--wm-bg); color: var(--wm-text); }
    .top { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
    .btn-ghost { background: none; border: none; color: var(--wm-text); cursor: pointer; padding: 8px; }
    .mono-label { font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--wm-text-mute); }
    .content { padding: 16px 24px; display: flex; flex-direction: column; gap: 28px; }
    .headline { font-family: var(--wm-f-serif); font-size: 40px; line-height: 1.05; letter-spacing: -0.02em; font-weight: 400; }
    .headline em { color: var(--wm-amber); font-style: italic; }
    .members { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .member { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .member-name { font-size: 12px; font-weight: 500; }
    .member-ready { font-size: 10px; color: var(--wm-like); font-family: var(--wm-f-mono); }
    .add-btn { width: 52px; height: 52px; border-radius: 50%; border: 2px dashed var(--wm-line-strong); background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; align-self: center; }
    .rule-note { font-size: 13px; color: var(--wm-text-dim); text-align: center; }
    .btn-primary { height: 52px; background: var(--wm-amber); color: var(--wm-bg); border: none; border-radius: var(--wm-r-pill); font-size: 16px; font-weight: 600; cursor: pointer; }
  `],
})
export class GroupComponent {
  members = MEMBERS;
  constructor(public router: Router) {}
}
