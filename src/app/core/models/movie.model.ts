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
}

export type PosterVariant = 'gradient' | 'stripes' | 'spotlight' | 'halftone' | 'bars';

export interface Session {
  id: string;
  user_id: string;
  partner_id: string | null;
  status: 'waiting' | 'active' | 'matched' | 'no-match';
  created_at: number;
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
  movie: Movie;
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
