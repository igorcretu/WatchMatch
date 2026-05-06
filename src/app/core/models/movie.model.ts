export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: number;
  rating: number;
  genres: string[];
  synopsis: string;
  poster_path: string;
  providers: string[];
  hue: number;
  variant: PosterVariant;
  mood: string;
  content_type?: string;
  language?: string;
}

export type PosterVariant = 'gradient' | 'stripes' | 'spotlight' | 'halftone' | 'bars';

export interface Session {
  id: string;
  user_id: string;
  partner_id: string | null;
  status: 'waiting' | 'active' | 'matched' | 'no-match';
  created_at: number;
  content_type?: string;
}

export interface Filters {
  genres: FilterPill[];
  year_min: number;
  year_max: number;
  rating_min: number;
  runtime_max: number;
  providers: FilterPill[];
  moods: FilterPill[];
}

export interface FilterPill {
  label: string;
  state: 'nice' | 'must' | 'no';
}

export interface SwipeRecord {
  movie_id: string;
  action: 'like' | 'pass' | 'super' | 'skip' | 'hide' | 'seen';
}

export interface QueueItem {
  id: string;
  movie_id: string;
  watched: boolean;
  added_at: number;
  sort_order?: number;
  movie: Movie;
  rating?: number;
}

export interface MatchResult {
  matched: boolean;
  movie: Movie | null;
  session_id: string;
}

export interface SessionPreset {
  id: string;
  name: string;
  filters: Filters;
}

export interface GenreStat {
  genre: string;
  count: number;
  pct: number;
}

export interface Stats {
  liked_count: number;
  watched_count: number;
  total_swipes: number;
  match_count: number;
  top_genres: GenreStat[];
  agreement_rate: number | null;
}

export interface InviteResponse {
  token: string;
  url: string;
}

export interface SwipeReplayItem {
  movie_id: string;
  movie_title: string;
  action: string;
  user_id: string;
  timestamp: number;
}
