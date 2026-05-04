import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },

  // Auth
  {
    path: 'auth/onboarding',
    loadComponent: () => import('./features/auth/onboarding/onboarding.component').then(m => m.OnboardingComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'auth/pair',
    loadComponent: () => import('./features/auth/pair/pair.component').then(m => m.PairComponent),
  },

  // Session
  {
    path: 'session/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/session/session-start/session-start.component').then(m => m.SessionStartComponent),
  },
  {
    path: 'session/:id/filters',
    canActivate: [authGuard],
    loadComponent: () => import('./features/session/filters/filters.component').then(m => m.FiltersComponent),
  },
  {
    path: 'session/:id/waiting',
    canActivate: [authGuard],
    loadComponent: () => import('./features/session/waiting/waiting.component').then(m => m.WaitingComponent),
  },
  {
    path: 'session/:id/swipe',
    canActivate: [authGuard],
    loadComponent: () => import('./features/session/swipe/swipe.component').then(m => m.SwipeComponent),
  },
  {
    path: 'session/:id/card/:movieId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/session/card-detail/card-detail.component').then(m => m.CardDetailComponent),
  },
  {
    path: 'session/:id/match/:movieId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/session/match/match.component').then(m => m.MatchComponent),
  },
  {
    path: 'session/:id/no-match',
    canActivate: [authGuard],
    loadComponent: () => import('./features/session/no-match/no-match.component').then(m => m.NoMatchComponent),
  },

  // Library
  {
    path: 'library/queue',
    canActivate: [authGuard],
    loadComponent: () => import('./features/library/queue/queue.component').then(m => m.QueueComponent),
  },
  {
    path: 'library/history',
    canActivate: [authGuard],
    loadComponent: () => import('./features/library/history/history.component').then(m => m.HistoryComponent),
  },
  {
    path: 'library/stats',
    canActivate: [authGuard],
    loadComponent: () => import('./features/library/stats/stats.component').then(m => m.StatsComponent),
  },
  {
    path: 'library/disliked',
    canActivate: [authGuard],
    loadComponent: () => import('./features/library/disliked/disliked.component').then(m => m.DislikedComponent),
  },

  // Profile
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
  },

  // Group
  {
    path: 'group/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/group/group.component').then(m => m.GroupComponent),
  },

  // Solo
  {
    path: 'solo',
    canActivate: [authGuard],
    loadComponent: () => import('./features/solo/solo.component').then(m => m.SoloComponent),
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
