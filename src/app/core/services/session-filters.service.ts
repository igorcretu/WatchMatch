import { Injectable, signal, computed } from '@angular/core';
import { Filters, FilterPill } from '../models/movie.model';

const DEFAULT_FILTERS: Filters = {
  genres: [
    { label: 'Drama', state: 'nice' }, { label: 'Comedy', state: 'nice' },
    { label: 'Thriller', state: 'nice' }, { label: 'Sci-Fi', state: 'nice' },
    { label: 'Romance', state: 'nice' }, { label: 'Action', state: 'nice' },
    { label: 'Mystery', state: 'nice' }, { label: 'Historical', state: 'nice' },
    { label: 'Adventure', state: 'nice' }, { label: 'Music', state: 'nice' },
    { label: 'Family', state: 'nice' },
  ],
  year_min: 2015, year_max: 2025, rating_min: 6.5, runtime_max: 180,
  providers: [
    { label: 'Netflix', state: 'nice' }, { label: 'HBO Max', state: 'nice' },
    { label: 'Disney+', state: 'nice' }, { label: 'Mubi', state: 'nice' },
  ],
  moods: [
    { label: 'feel-good', state: 'nice' }, { label: 'tense', state: 'nice' },
    { label: 'cerebral', state: 'nice' }, { label: 'dreamy', state: 'nice' },
    { label: 'cozy', state: 'nice' },
  ],
};

@Injectable({ providedIn: 'root' })
export class SessionFiltersService {
  private _filters = signal<Filters>(structuredClone(DEFAULT_FILTERS));

  readonly filters = this._filters.asReadonly();
  readonly activeGenres = computed(() => this._filters().genres.filter(g => g.state !== 'no'));

  cycleGenre(label: string): void {
    this._filters.update(f => ({
      ...f, genres: f.genres.map(g => g.label === label ? { ...g, state: nextState(g.state) } : g),
    }));
  }

  cycleProvider(label: string): void {
    this._filters.update(f => ({
      ...f, providers: f.providers.map(p => p.label === label ? { ...p, state: nextState(p.state) } : p),
    }));
  }

  cycleMood(label: string): void {
    this._filters.update(f => ({
      ...f, moods: f.moods.map(m => m.label === label ? { ...m, state: nextState(m.state) } : m),
    }));
  }

  setYearRange(min: number, max: number): void {
    this._filters.update(f => ({ ...f, year_min: min, year_max: max }));
  }

  setRatingMin(val: number): void {
    this._filters.update(f => ({ ...f, rating_min: val }));
  }

  setRuntimeMax(val: number): void {
    this._filters.update(f => ({ ...f, runtime_max: val }));
  }

  loadPreset(filters: Filters): void {
    this._filters.set(structuredClone(filters));
  }

  reset(): void {
    this._filters.set(structuredClone(DEFAULT_FILTERS));
  }
}

function nextState(state: FilterPill['state']): FilterPill['state'] {
  const cycle: FilterPill['state'][] = ['nice', 'must', 'no'];
  return cycle[(cycle.indexOf(state) + 1) % cycle.length];
}
