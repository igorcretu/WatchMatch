import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Movie, Session, Filters, QueueItem, SwipeRecord,
  MatchResult, SessionPreset
} from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ---------- Movies ----------
  getMovies(params?: {
    genre?: string; provider?: string;
    yearMin?: number; yearMax?: number;
    ratingMin?: number; runtimeMax?: number;
  }): Observable<Movie[]> {
    let p = new HttpParams();
    if (params?.genre)      p = p.set('genre', params.genre);
    if (params?.provider)   p = p.set('provider', params.provider);
    if (params?.yearMin)    p = p.set('year_min', params.yearMin);
    if (params?.yearMax)    p = p.set('year_max', params.yearMax);
    if (params?.ratingMin)  p = p.set('rating_min', params.ratingMin);
    if (params?.runtimeMax) p = p.set('runtime_max', params.runtimeMax);
    return this.http.get<Movie[]>(`${this.base}/movies`, { params: p });
  }

  getMovie(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.base}/movies/${id}`);
  }

  // ---------- Sessions ----------
  createSession(partnerId?: string): Observable<Session> {
    return this.http.post<Session>(`${this.base}/sessions`, { partner_id: partnerId ?? null });
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

  // ---------- Presets ----------
  getPresets(): Observable<SessionPreset[]> {
    return this.http.get<SessionPreset[]>(`${this.base}/sessions/presets/`);
  }

  createPreset(name: string, filters: Filters): Observable<SessionPreset> {
    return this.http.post<SessionPreset>(`${this.base}/sessions/presets/`, { name, filters });
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

  // ---------- Disliked ----------
  getDisliked(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.base}/users/me/disliked`);
  }

  undoDislike(movieId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/users/me/disliked/${movieId}`);
  }
}
