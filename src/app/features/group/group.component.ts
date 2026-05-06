import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'wm-group',
  standalone: true,
  imports: [AvatarComponent, IconComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group-screen">
      <header class="top">
        <button class="btn-ghost" (click)="router.navigate(['/'])"><wm-icon name="back" [size]="18"></wm-icon></button>
        <div class="mono-label">GROUP SESSION</div>
        <div style="width:34px"></div>
      </header>

      <div class="content">
        @if (group(); as g) {
          <h1 class="headline">{{ g.name }}</h1>

          <div class="invite-row">
            <div class="invite-code">{{ g.invite_code }}</div>
            <button class="btn-copy" (click)="copyCode(g.invite_code)">
              <wm-icon name="copy" [size]="14"></wm-icon> Copy code
            </button>
          </div>

          <div class="members">
            @for (m of members(); track m.user_id) {
              <div class="member">
                <wm-avatar [name]="m.name" [hue]="m.hue" [size]="52"></wm-avatar>
                <span class="member-name">{{ m.name }}</span>
                <div class="member-ready">Ready</div>
              </div>
            }
          </div>

          <p class="rule-note">{{ g.member_count }} members · Majority match wins.</p>
          <button class="btn-primary" (click)="startGroupSession(g.id)">Start group session →</button>

        } @else {
          <h1 class="headline">Movie night<br><em>together</em>.</h1>
          <p class="sub">Create a new group or join one with an invite code.</p>

          <div class="form-section">
            <label class="field-label">Group name</label>
            <input class="field-input" type="text" [(ngModel)]="groupName" placeholder="Friday Night Films">
            <button class="btn-primary" (click)="createGroup()" [disabled]="!groupName || loading()">
              {{ loading() ? 'Creating…' : 'Create group →' }}
            </button>
          </div>

          <div class="divider"><span>or join with a code</span></div>

          <div class="form-section">
            <label class="field-label">Invite code</label>
            <input class="field-input" type="text" [(ngModel)]="joinCode" placeholder="ABC123" style="text-transform:uppercase">
            <button class="btn-secondary" (click)="joinByCode()" [disabled]="!joinCode || loading()">Join group</button>
          </div>

          @if (error()) {
            <div class="error-msg">{{ error() }}</div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .group-screen { width: 100%; min-height: 100vh; background: var(--wm-bg); color: var(--wm-text); }
    .top { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
    .btn-ghost { background: none; border: none; color: var(--wm-text); cursor: pointer; padding: 8px; }
    .mono-label { font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--wm-text-mute); }
    .content { padding: 16px 24px; display: flex; flex-direction: column; gap: 24px; }
    .headline { font-family: var(--wm-f-serif); font-size: 40px; line-height: 1.05; letter-spacing: -0.02em; font-weight: 400; }
    .headline em { color: var(--wm-amber); font-style: italic; }
    .sub { font-size: 15px; color: var(--wm-text-dim); line-height: 1.5; }
    .invite-row { display: flex; align-items: center; gap: 12px; background: var(--wm-bg2); border: 1px solid var(--wm-amber-line); border-radius: 12px; padding: 14px 16px; }
    .invite-code { font-family: var(--wm-f-mono); font-size: 22px; font-weight: 600; letter-spacing: 0.1em; color: var(--wm-amber); flex: 1; }
    .btn-copy { display: flex; align-items: center; gap: 6px; background: none; border: 1px solid var(--wm-amber-line); border-radius: var(--wm-r-pill); padding: 6px 14px; color: var(--wm-amber); font-size: 12px; cursor: pointer; }
    .members { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .member { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .member-name { font-size: 12px; font-weight: 500; }
    .member-ready { font-size: 10px; color: var(--wm-like); font-family: var(--wm-f-mono); }
    .rule-note { font-size: 13px; color: var(--wm-text-dim); text-align: center; }
    .field-label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; color: var(--wm-text-mute); }
    .field-input { background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: var(--wm-r-md); padding: 14px 16px; color: var(--wm-text); font-size: 15px; outline: none; width: 100%; box-sizing: border-box; }
    .field-input:focus { border-color: var(--wm-amber-line); }
    .form-section { display: flex; flex-direction: column; gap: 10px; }
    .btn-primary { height: 48px; background: var(--wm-amber); color: var(--wm-bg); border: none; border-radius: var(--wm-r-pill); font-size: 15px; font-weight: 600; cursor: pointer; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { height: 44px; background: transparent; color: var(--wm-text); border: 1px solid var(--wm-line-strong); border-radius: var(--wm-r-pill); font-size: 14px; cursor: pointer; }
    .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
    .divider { display: flex; align-items: center; gap: 12px; color: var(--wm-text-mute); font-size: 12px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--wm-line); }
    .error-msg { color: var(--wm-pass); font-size: 13px; background: var(--wm-pass-soft); border-radius: var(--wm-r-sm); padding: 10px 14px; }
  `],
})
export class GroupComponent implements OnInit {
  private api   = inject(ApiService);
  private route = inject(ActivatedRoute);

  group   = signal<{ id: string; name: string; invite_code: string; member_count: number } | null>(null);
  members = signal<{ user_id: string; name: string; hue: number }[]>([]);
  loading = signal(false);
  error   = signal('');
  groupName = '';
  joinCode  = '';

  constructor(public router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.api.getGroup(id).subscribe({
        next: g => {
          this.group.set(g);
          this.api.getGroupMembers(g.id).subscribe(ms => this.members.set(ms));
        },
        error: () => {},
      });
    }
  }

  createGroup(): void {
    if (!this.groupName) return;
    this.loading.set(true);
    this.error.set('');
    this.api.createGroup(this.groupName).subscribe({
      next: g => {
        this.group.set(g);
        this.api.getGroupMembers(g.id).subscribe(ms => this.members.set(ms));
        this.loading.set(false);
        this.router.navigate(['/group', g.id]);
      },
      error: () => { this.error.set('Could not create group.'); this.loading.set(false); },
    });
  }

  joinByCode(): void {
    if (!this.joinCode) return;
    this.loading.set(true);
    this.error.set('');
    this.api.joinGroupByCode(this.joinCode.toUpperCase()).subscribe({
      next: g => {
        this.group.set(g);
        this.api.getGroupMembers(g.id).subscribe(ms => this.members.set(ms));
        this.loading.set(false);
        this.router.navigate(['/group', g.id]);
      },
      error: (e) => { this.error.set(e.error?.detail ?? 'Invalid invite code.'); this.loading.set(false); },
    });
  }

  startGroupSession(groupId: string): void {
    this.api.createSession({ contentType: 'both' }).subscribe(session =>
      this.router.navigate(['/session', session.id, 'filters'])
    );
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).catch(() => {});
  }
}
