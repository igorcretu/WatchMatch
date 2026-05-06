import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Movie, Session, Filters, QueueItem, SwipeRecord,
  MatchResult, SessionPreset, Stats, InviteResponse, SwipeReplayItem
} from '../models/movie.model';

export interface MovieParams {
  q?: string;
  genre?: string;
  provider?: string;
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
  runtimeMax?: number;
  contentType?: string;
  language?: string;
  genresMust?: string[];
  genresNo?: string[];
  providersMust?: string[];
  providersNo?: string[];
  moodsMust?: string[];
  moodsNo?: string[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ---------- Movies ----------
  getMovies(params?: MovieParams): Observable<Movie[]> {
    let p = new HttpParams();
    if (params?.q)           p = p.set('q', params.q);
    if (params?.genre)       p = p.set('genre', params.genre);
    if (params?.provider)    p = p.set('provider', params.provider);
    if (params?.yearMin)     p = p.set('year_min', params.yearMin);
    if (params?.yearMax)     p = p.set('year_max', params.yearMax);
    if (params?.ratingMin)   p = p.set('rating_min', params.ratingMin);
    if (params?.runtimeMax)  p = p.set('runtime_max', params.runtimeMax);
    if (params?.contentType) p = p.set('content_type', params.contentType);
    if (params?.language)    p = p.set('language', params.language);
    for (const g of params?.genresMust    ?? []) p = p.append('genres_must',    g);
    for (const g of params?.genresNo      ?? []) p = p.append('genres_no',      g);
    for (const pr of params?.providersMust ?? []) p = p.append('providers_must', pr);
    for (const pr of params?.providersNo   ?? []) p = p.append('providers_no',   pr);
    for (const m of params?.moodsMust     ?? []) p = p.append('moods_must',     m);
    for (const m of params?.moodsNo       ?? []) p = p.append('moods_no',       m);
    return this.http.get<Movie[]>(`${this.base}/movies`, { params: p });
  }

  getMoviesForSession(sessionId: string): Observable<Movie[]> {
    return this.getFilters(sessionId).pipe(
      switchMap(f => this.getMovies({
        yearMin:       f.year_min,
        yearMax:       f.year_max,
        ratingMin:     f.rating_min,
        runtimeMax:    f.runtime_max,
        genresMust:    f.genres.filter(g => g.state === 'must').map(g => g.label),
        genresNo:      f.genres.filter(g => g.state === 'no').map(g => g.label),
        providersMust: f.providers.filter(p => p.state === 'must').map(p => p.label),
        providersNo:   f.providers.filter(p => p.state === 'no').map(p => p.label),
        moodsMust:     f.moods.filter(m => m.state === 'must').map(m => m.label),
        moodsNo:       f.moods.filter(m => m.state === 'no').map(m => m.label),
      }))
    );
  }

  getMovie(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.base}/movies/${id}`);
  }

  // ---------- Sessions ----------
  createSession(options?: { partnerId?: string | null; contentType?: string; solo?: boolean }): Observable<Session> {
    return this.http.post<Session>(`${this.base}/sessions`, {
      partner_id:   options?.solo ? null : (options?.partnerId ?? null),
      content_type: options?.contentType ?? 'both',
      solo:         options?.solo ?? false,
    });
  }

  getSession(id: string): Observable<Session> {
    return this.http.get<Session>(`${this.base}/sessions/${id}`);
  }

  getFilters(sessionId: string): Observable<Filters> {
    return this.http.get<Filters>(`${this.base}/sessions/${sessionId}/filters`);
  }

  updateFilters(sessionId: string, filters: Filters): Observable<Session> {
    return this.http.patch<Session>(`${this.base}/sessions/${sessionId}/filters`, filters);
  }

  recordSwipe(sessionId: string, swipe: { movie_id: string; action: SwipeRecord['action'] }): Observable<MatchResult> {
    return this.http.post<MatchResult>(`${this.base}/sessions/${sessionId}/swipe`, swipe);
  }

  getAlmostMatched(sessionId: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.base}/sessions/${sessionId}/almost-matched`);
  }

  getSessionReplay(sessionId: string): Observable<SwipeReplayItem[]> {
    return this.http.get<SwipeReplayItem[]>(`${this.base}/sessions/${sessionId}/replay`);
  }

  // ---------- Presets ----------
  getPresets(): Observable<SessionPreset[]> {
    return this.http.get<SessionPreset[]>(`${this.base}/sessions/presets`);
  }

  createPreset(name: string, filters: Filters): Observable<SessionPreset> {
    return this.http.post<SessionPreset>(`${this.base}/sessions/presets`, { name, filters });
  }

  deletePreset(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/sessions/presets/${id}`);
  }

  // ---------- Queue / History ----------
  getQueue(): Observable<QueueItem[]> {
    return this.http.get<QueueItem[]>(`${this.base}/users/me/queue`);
  }

  getHistory(): Observable<QueueItem[]> {
    return this.http.get<QueueItem[]>(`${this.base}/users/me/history`);
  }

  markWatched(movieId: string): Observable<QueueItem> {
    return this.http.patch<QueueItem>(`${this.base}/users/me/queue/${movieId}/watched`, {});
  }

  rateMovie(movieId: string, rating: number): Observable<QueueItem> {
    return this.http.patch<QueueItem>(`${this.base}/users/me/history/${movieId}/rate`, { rating });
  }

  reorderQueueItem(movieId: string, sortOrder: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/users/me/queue/${movieId}/reorder`, { sort_order: sortOrder });
  }

  // ---------- Disliked ----------
  getDisliked(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.base}/users/me/disliked`);
  }

  undoDislike(movieId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/me/disliked/${movieId}`);
  }

  // ---------- Stats ----------
  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.base}/users/me/stats`);
  }

  exportCsv(): Observable<Blob> {
    return this.http.get(`${this.base}/users/me/export`, { responseType: 'blob' });
  }

  getUserById(id: string): Observable<{ id: string; name: string; hue: number }> {
    return this.http.get<{ id: string; name: string; hue: number }>(`${this.base}/users/${id}`);
  }

  // ---------- Groups ----------
  createGroup(name: string): Observable<{ id: string; name: string; invite_code: string; member_count: number }> {
    return this.http.post<any>(`${this.base}/groups`, { name });
  }

  getGroup(id: string): Observable<{ id: string; name: string; invite_code: string; member_count: number }> {
    return this.http.get<any>(`${this.base}/groups/${id}`);
  }

  getGroupMembers(id: string): Observable<{ user_id: string; name: string; hue: number }[]> {
    return this.http.get<any[]>(`${this.base}/groups/${id}/members`);
  }

  joinGroupByCode(code: string): Observable<{ id: string; name: string; invite_code: string; member_count: number }> {
    return this.http.post<any>(`${this.base}/groups/join-by-code/${code}`, {});
  }

  // ---------- Auth extras ----------
  generateInvite(): Observable<InviteResponse> {
    return this.http.post<InviteResponse>(`${this.base}/auth/invite`, {});
  }

  pairByToken(token: string): Observable<{ partner_id: string }> {
    return this.http.post<{ partner_id: string }>(`${this.base}/auth/pair-by-token`, { token });
  }

  deleteAccount(password: string): Observable<void> {
    return this.http.request<void>('DELETE', `${this.base}/auth/me`, { body: { password } });
  }

  updateTheme(theme: 'dark' | 'light'): Observable<{ theme: string }> {
    return this.http.patch<{ theme: string }>(`${this.base}/auth/me/theme`, { theme });
  }
}
