import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PillComponent } from '../../../shared/components/pill/pill.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { SessionFiltersService } from '../../../core/services/session-filters.service';
import { ApiService } from '../../../core/services/api.service';
import { SessionPreset } from '../../../core/models/movie.model';

@Component({
  selector: 'wm-filters',
  standalone: true,
  imports: [FormsModule, PillComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters">
      <header class="top">
        <button class="btn-ghost" (click)="back()"><wm-icon name="back" [size]="18"></wm-icon></button>
        <div class="mono-label">YOUR FILTERS</div>
        <button class="reset-btn" (click)="svc.reset()">Reset</button>
      </header>

      <div class="scroll">
        <!-- Presets -->
        @if (presets().length > 0) {
          <div class="section">
            <div class="section-title">Saved presets</div>
            <div class="pill-row">
              @for (p of presets(); track p.id) {
                <button class="preset-pill" (click)="loadPreset(p)">
                  <wm-icon name="spark" [size]="12"></wm-icon> {{ p.name }}
                </button>
              }
            </div>
          </div>
        }

        <p class="hint">Tap to cycle: <em>nice-to-have → must-have → exclude</em></p>

        <section class="section">
          <div class="section-title">Genres</div>
          <div class="pill-row">
            @for (g of filters().genres; track g.label) {
              <wm-pill [state]="g.state" (clicked)="svc.cycleGenre(g.label)">{{ g.label }}</wm-pill>
            }
          </div>
        </section>

        <section class="section">
          <div class="section-title">Streaming services</div>
          <div class="pill-row">
            @for (p of filters().providers; track p.label) {
              <wm-pill [state]="p.state" (clicked)="svc.cycleProvider(p.label)">{{ p.label }}</wm-pill>
            }
          </div>
        </section>

        <section class="section">
          <div class="section-title">Mood</div>
          <div class="pill-row">
            @for (m of filters().moods; track m.label) {
              <wm-pill [state]="m.state" (clicked)="svc.cycleMood(m.label)">{{ m.label }}</wm-pill>
            }
          </div>
        </section>

        <section class="section">
          <div class="section-title">Min rating — {{ filters().rating_min.toFixed(1) }}</div>
          <input type="range" min="5" max="9" step="0.5" class="slider"
            [value]="filters().rating_min"
            (input)="svc.setRatingMin(+$any($event.target).value)">
        </section>

        <section class="section">
          <div class="section-title">Max runtime — {{ filters().runtime_max }}m</div>
          <input type="range" min="60" max="240" step="10" class="slider"
            [value]="filters().runtime_max"
            (input)="svc.setRuntimeMax(+$any($event.target).value)">
        </section>

        <section class="section">
          <div class="section-title">Year range — {{ filters().year_min }}–{{ filters().year_max }}</div>
          <input type="range" min="1990" max="2025" step="1" class="slider"
            [value]="filters().year_min"
            (input)="svc.setYearRange(+$any($event.target).value, filters().year_max)">
        </section>

        <!-- Save preset -->
        @if (showPresetInput()) {
          <div class="preset-save">
            <input class="field-input" [(ngModel)]="presetName" placeholder="Preset name…">
            <button class="btn-save" (click)="savePreset()">Save</button>
            <button class="btn-ghost" (click)="showPresetInput.set(false)">Cancel</button>
          </div>
        } @else {
          <button class="save-link" (click)="showPresetInput.set(true)">
            <wm-icon name="bookmark" [size]="14"></wm-icon> Save as preset
          </button>
        }

        <div style="height:120px"></div>
      </div>

      <div class="actions">
        <button class="btn-primary" (click)="proceed()">Find matches →</button>
      </div>
    </div>
  `,
  styles: [`
    .filters { width: 100%; height: 100vh; background: var(--wm-bg); color: var(--wm-text); display: flex; flex-direction: column; }
    .top { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; flex-shrink: 0; }
    .btn-ghost { background: none; border: none; color: var(--wm-text); cursor: pointer; padding: 8px; }
    .mono-label { font-family: var(--wm-f-mono); font-size: 11px; letter-spacing: 0.2em; color: var(--wm-text-mute); }
    .reset-btn { background: none; border: none; color: var(--wm-amber); cursor: pointer; font-size: 14px; }
    .scroll { flex: 1; overflow-y: auto; padding: 0 20px; }
    .hint { font-size: 13px; color: var(--wm-text-mute); margin-bottom: 24px; }
    .hint em { color: var(--wm-amber); font-style: normal; }
    .section { margin-bottom: 28px; }
    .section-title { font-family: var(--wm-f-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--wm-text-mute); margin-bottom: 12px; }
    .pill-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .preset-pill { padding: 7px 13px; border-radius: 999px; background: var(--wm-bg2); border: 1px solid var(--wm-line); color: var(--wm-text-dim); font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
    .slider { width: 100%; accent-color: var(--wm-amber); }
    .save-link { background: none; border: none; color: var(--wm-amber); cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
    .preset-save { display: flex; gap: 8px; align-items: center; margin-bottom: 16px; }
    .field-input { flex: 1; background: var(--wm-bg2); border: 1px solid var(--wm-line); border-radius: var(--wm-r-md); padding: 10px 14px; color: var(--wm-text); font-size: 14px; outline: none; }
    .btn-save { background: var(--wm-amber); color: var(--wm-bg); border: none; border-radius: var(--wm-r-pill); padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .actions { flex-shrink: 0; padding: 16px 20px 32px; border-top: 1px solid var(--wm-line); }
    .btn-primary { width: 100%; height: 52px; background: var(--wm-amber); color: var(--wm-bg); border: none; border-radius: var(--wm-r-pill); font-size: 16px; font-weight: 600; cursor: pointer; }
  `],
})
export class FiltersComponent implements OnInit {
  readonly svc     = inject(SessionFiltersService);
  readonly filters = this.svc.filters;
  private api      = inject(ApiService);
  private route    = inject(ActivatedRoute);

  presets         = signal<SessionPreset[]>([]);
  showPresetInput = signal(false);
  presetName      = '';

  constructor(public router: Router) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('id')!;
    // Load server-side filters into local state
    this.api.getFilters(sessionId).subscribe(f => this.svc.loadPreset(f));
    // Load saved presets
    this.api.getPresets().subscribe(p => this.presets.set(p));
  }

  loadPreset(p: SessionPreset): void { this.svc.loadPreset(p.filters); }

  savePreset(): void {
    if (!this.presetName.trim()) return;
    this.api.createPreset(this.presetName.trim(), this.filters()).subscribe(p => {
      this.presets.update(list => [...list, p]);
      this.presetName = '';
      this.showPresetInput.set(false);
    });
  }

  back(): void { this.router.navigate(['../..'], { relativeTo: this.route }); }

  proceed(): void {
    const sessionId = this.route.snapshot.paramMap.get('id')!;
    this.api.updateFilters(sessionId, this.filters()).subscribe(() => {
      this.router.navigate(['/session', sessionId, 'waiting']);
    });
  }
}
