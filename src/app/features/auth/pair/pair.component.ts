import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { TopBarComponent } from '../../../layout/top-bar/top-bar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'wm-pair',
  standalone: true,
  imports: [FormsModule, IconComponent, TopBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pair">
      <wm-top-bar sub="STEP 02 / 03">
        <button leading class="btn-ghost" (click)="router.navigate(['/auth/onboarding'])">
          <wm-icon name="back" [size]="18"></wm-icon>
        </button>
      </wm-top-bar>

      <div class="content">
        <h1 class="headline">Find your <em>movie person</em>.</h1>
        <p class="sub">Enter their email address to pair, or share an invite link.</p>

        @if (autoToken()) {
          <div class="auto-pair-card">
            <wm-icon name="link" [size]="20" style="color:var(--wm-amber)"></wm-icon>
            <div>
              <div class="auto-label">You were invited to pair!</div>
              <div class="auto-sub">Click below to accept and connect with your movie partner.</div>
            </div>
          </div>
          @if (error()) { <div class="error-msg">{{ error() }}</div> }
          @if (success()) { <div class="success-msg">Paired! ✓ Redirecting…</div> }
          <button class="btn-primary" (click)="acceptInvite()" [disabled]="loading() || success()">
            {{ loading() ? 'Pairing…' : 'Accept invite →' }}
          </button>
        } @else {
          <form class="form" (ngSubmit)="sendPair()">
            <div class="field">
              <label class="field-label">Partner's email</label>
              <input class="field-input" type="email" [(ngModel)]="partnerEmail" name="partnerEmail"
                placeholder="ana@example.com" autocomplete="off">
            </div>

            @if (error()) { <div class="error-msg">{{ error() }}</div> }
            @if (success()) { <div class="success-msg">Paired! ✓</div> }

            <button class="btn-primary" type="submit" [disabled]="loading() || !partnerEmail">
              {{ loading() ? 'Pairing…' : 'Send invite →' }}
            </button>
          </form>

          <!-- invite link card -->
          <div class="card">
            <div class="card-label">
              <wm-icon name="link" [size]="16" style="color:var(--wm-amber)"></wm-icon>
              <span class="mono-label">One-time invite link</span>
            </div>
            @if (inviteUrl()) {
              <div class="link-row">
                <span class="link-text">{{ inviteUrl() }}</span>
                <wm-icon name="copy" [size]="14" style="color:var(--wm-amber)"></wm-icon>
              </div>
            } @else {
              <div class="link-placeholder">Generate a link to share with your partner</div>
            }
            <div class="link-actions">
              @if (inviteUrl()) {
                <button class="btn-secondary" (click)="copyLink()">Copy link</button>
              } @else {
                <button class="btn-secondary" (click)="generateLink()" [disabled]="generatingLink()">
                  {{ generatingLink() ? 'Generating…' : 'Generate invite link' }}
                </button>
              }
            </div>
          </div>
        }

        <p class="solo-link">
          No partner yet?
          <button class="link" (click)="skip()">Continue solo →</button>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .pair { width: 100%; min-height: 100vh; background: var(--wm-bg); color: var(--wm-text); }
    .btn-ghost { background: none; border: none; color: var(--wm-text); cursor: pointer; padding: 4px; }
    .content { padding: 0 24px; display: flex; flex-direction: column; gap: 20px; }
    .headline { font-family: var(--wm-f-serif); font-size: 38px; line-height: 1.05; letter-spacing: -0.02em; font-weight: 400; }
    .headline em { color: var(--wm-amber); font-style: italic; }
    .sub { color: var(--wm-text-dim); font-size: 14px; line-height: 1.5; }
    .auto-pair-card { background: var(--wm-amber-soft); border: 1px solid var(--wm-amber-line); border-radius: 16px; padding: 18px; display: flex; gap: 14px; align-items: flex-start; }
    .auto-label { font-size: 15px; font-weight: 600; color: var(--wm-amber); margin-bottom: 4px; }
    .auto-sub { font-size: 13px; color: var(--wm-text-dim); line-height: 1.4; }
    .form { display: flex; flex-direction: column; gap: 12px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--wm-text-mute); }
    .field-input { background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: var(--wm-r-md); padding: 14px 16px; color: var(--wm-text); font-size: 15px; outline: none; }
    .field-input:focus { border-color: var(--wm-amber-line); }
    .field-input::placeholder { color: var(--wm-text-mute); }
    .error-msg { color: var(--wm-pass); font-size: 13px; background: var(--wm-pass-soft); border-radius: var(--wm-r-sm); padding: 10px 14px; }
    .success-msg { color: var(--wm-like); font-size: 13px; background: var(--wm-like-soft); border-radius: var(--wm-r-sm); padding: 10px 14px; }
    .btn-primary { height: 48px; background: var(--wm-amber); color: var(--wm-bg); border: none; border-radius: var(--wm-r-pill); font-size: 15px; font-weight: 600; cursor: pointer; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .card { background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: 16px; padding: 18px; }
    .card-label { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .mono-label { font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--wm-text-mute); }
    .link-row { background: var(--wm-bg); border: 1px solid var(--wm-line); border-radius: 10px; padding: 12px 14px; font-family: var(--wm-f-mono); font-size: 12px; color: var(--wm-text-dim); display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .link-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .link-placeholder { font-size: 13px; color: var(--wm-text-mute); padding: 4px 0 8px; }
    .link-actions { margin-top: 12px; }
    .btn-secondary { width: 100%; height: 40px; background: transparent; color: var(--wm-text); border: 1px solid var(--wm-line-strong); border-radius: var(--wm-r-pill); font-size: 13px; cursor: pointer; }
    .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
    .solo-link { text-align: center; font-size: 13px; color: var(--wm-text-mute); }
    .link { background: none; border: none; color: var(--wm-amber); cursor: pointer; font-size: 13px; font-weight: 500; }
  `],
})
export class PairComponent implements OnInit {
  private auth  = inject(AuthService);
  private route = inject(ActivatedRoute);

  partnerEmail  = '';
  loading       = signal(false);
  error         = signal('');
  success       = signal(false);
  inviteUrl     = signal('');
  generatingLink = signal(false);
  autoToken     = signal('');

  constructor(public router: Router) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) this.autoToken.set(token);
  }

  acceptInvite(): void {
    this.loading.set(true);
    this.error.set('');
    this.auth.pairByToken(this.autoToken()).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/']), 1200);
      },
      error: (e) => {
        this.error.set(e.error?.detail ?? 'Invalid or expired invite token.');
        this.loading.set(false);
      },
    });
  }

  sendPair(): void {
    if (!this.partnerEmail) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.pairWithPartner(this.partnerEmail).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/']), 1200);
      },
      error: (e) => {
        this.error.set(e.error?.detail ?? 'Could not find that user.');
        this.loading.set(false);
      },
    });
  }

  generateLink(): void {
    this.generatingLink.set(true);
    this.auth.generateInvite().subscribe({
      next: (res) => {
        this.inviteUrl.set(res.url);
        this.generatingLink.set(false);
      },
      error: () => this.generatingLink.set(false),
    });
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.inviteUrl()).catch(() => {});
  }

  skip(): void { this.router.navigate(['/']); }
}
