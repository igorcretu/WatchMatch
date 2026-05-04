# Frontend folder structure — explained

If you're coming from React or just from "normal" JavaScript projects, the Angular folder layout looks
weirdly deep and bureaucratic. This document explains every folder, every file, and *why* it sits where it does.

---

## The map

```
frontend/
├── .github/workflows/deploy.yml   ← CI/CD lives here (not at project root)
├── angular.json                   ← Angular build config (webpack-equivalent)
├── package.json
├── tsconfig.json
└── src/
    ├── index.html                 ← The single HTML file the browser ever loads
    ├── main.ts                    ← Entry point — bootstraps the Angular app
    ├── styles.scss                ← Global styles, imports the partials below
    ├── styles/
    │   ├── _tokens.scss           ← Every CSS variable (colors, fonts, radii…)
    │   ├── _reset.scss            ← Box-sizing reset, body defaults
    │   └── _typography.scss       ← Font-face declarations
    ├── environments/
    │   ├── environment.ts         ← Dev config  (apiUrl = localhost:8010)
    │   └── environment.prod.ts    ← Prod config (apiUrl = matchapi.crig.dev)
    └── app/
        ├── app.ts                 ← Root component — just renders <router-outlet>
        ├── app.config.ts          ← App-level providers (router, HttpClient, interceptor)
        ├── app.routes.ts          ← Every route in the app
        ├── app.html               ← Root template (literally one tag)
        ├── app.scss               ← Root styles
        ├── core/                  ← Singletons used everywhere
        │   ├── guards/
        │   ├── interceptors/
        │   ├── models/
        │   └── services/
        ├── features/              ← One folder per screen/flow
        │   ├── auth/
        │   ├── home/
        │   ├── library/
        │   ├── profile/
        │   ├── session/
        │   ├── group/
        │   └── solo/
        ├── layout/                ← Chrome that wraps screens
        │   ├── tab-bar/
        │   ├── top-bar/
        │   └── mobile-shell/
        └── shared/                ← Reusable UI atoms
            └── components/
                ├── avatar/
                ├── icon/
                ├── pill/
                ├── poster/
                └── stat/
```

---

## Why is `src/` not the app itself?

Angular scaffolds a `src/` wrapper so that non-source config files (`angular.json`, `tsconfig.json`,
`package.json`) stay at the project root without getting bundled. Everything inside `src/` is compiled;
everything outside is tooling.

---

## `index.html` + `main.ts` — the bootstrap chain

`index.html` contains exactly one custom tag: `<app-root>`. The browser loads that HTML, Angular's
runtime replaces `<app-root>` with the root component, and from that point on Angular owns the DOM.

`main.ts` is the entry point. It calls `bootstrapApplication(App, appConfig)`. In older Angular this
was `platformBrowserDynamic().bootstrapModule(AppModule)` — that whole NgModule system is gone in
Angular 17+. There is no `AppModule` in this project.

---

## `environments/` — why two almost-identical files?

`environment.ts` and `environment.prod.ts` contain the same shape but different values:

```
environment.ts      → apiUrl: 'http://localhost:8010/api'
environment.prod.ts → apiUrl: 'https://matchapi.crig.dev/api'
```

`angular.json` has a `fileReplacements` rule that swaps `environment.ts` for `environment.prod.ts`
when you run `ng build --configuration=production`. Services import only `environment.ts` — the build
tool handles the swap transparently. You never write `if (prod)` conditionals in your code.

---

## `app.config.ts` — the replacement for AppModule

Angular 17 introduced "standalone" mode. There are no NgModules. Instead, `app.config.ts` is where
you register app-wide providers — things that need to be singletons for the entire app:

- `provideRouter(routes, ...)` — sets up the client-side router
- `provideHttpClient(withInterceptors([authInterceptor]))` — registers `HttpClient` and tells it to
  run `authInterceptor` on every request (which attaches the JWT Bearer token)

If you don't register something here, it doesn't exist. No magic auto-import.

---

## `core/` — singletons that the whole app shares

The `core/` folder holds things that are *not* specific to any one screen but are used by many:

### `core/models/movie.model.ts`
All TypeScript interfaces in one file: `Movie`, `Session`, `Filters`, `QueueItem`, `MatchResult`,
`SessionPreset`, `SwipeRecord`. This is the single source of truth for what the API returns. If the
backend changes a field, you update it here and TypeScript immediately tells you every place that breaks.

### `core/services/api.service.ts`
One class, one job: talking to the backend. Every HTTP call in the app goes through here. Components
don't call `fetch()` or `axios` — they call methods on `ApiService`. This means:
- You can mock the API in tests by swapping one service
- The base URL comes from `environment.apiUrl`, so dev vs prod is automatic
- All methods return `Observable<T>` — Angular's async primitive

### `core/services/auth.service.ts`
Handles login, register, pair, logout, and the JWT token. It stores the token in `localStorage` so
the user stays logged in across page refreshes. It exposes Angular Signals (`token`, `currentUser`,
`isLoggedIn`) so any component can reactively read auth state without subscribing.

### `core/services/session-filters.service.ts`
This one is a bit unusual — it's a *client-side state store* for the filter screen. The filters page
lets you toggle genre pills, slide year ranges, etc., and all that live state needs to survive if you
navigate away and come back. Putting it in a service (which is a singleton) means the state persists
in memory for the session. It's the Angular equivalent of a small Zustand/Redux store.

### `core/interceptors/auth.interceptor.ts`
A function that Angular's HTTP pipeline runs before every outgoing request. It reads the token from
`AuthService` and adds `Authorization: Bearer <token>` to the headers. You register it once in
`app.config.ts` and never think about it again — every API call is automatically authenticated.

### `core/guards/auth.guard.ts`
A function that Angular's router runs before activating a route. If the user is not logged in
(`auth.isLoggedIn()` is false), it redirects to `/auth/onboarding`. Every route in `app.routes.ts`
that requires login has `canActivate: [authGuard]`.

---

## `features/` — one folder per user flow, not per page type

This is the most important structural decision and the one that looks strangest at first.

In React you might organise by type: `pages/`, `components/`, `hooks/`. Angular projects (and
many modern React projects too) organise by **feature** — a coherent flow a user goes through.

### `features/auth/`
Three screens that form the onboarding flow: `onboarding` → `register` (or `login`) → `pair`.
They share a concern (authentication) so they live together. Moving the entire auth flow to a
new repo or removing it means deleting one folder.

### `features/session/`
The biggest feature — the full swiping session lifecycle:
```
session-start → filters → waiting → swipe → card-detail
                                           → match
                                           → no-match
```
All of these screens are only meaningful within the context of a session, so they live together.
`card-detail` and `match` are sub-screens of `swipe`, not top-level features.

### `features/library/`
The post-session screens: `queue`, `history`, `stats`, `disliked`. These are all about *what
happened after swiping* so they're grouped as a "library" of your activity.

### `features/home/`, `features/profile/`, `features/solo/`, `features/group/`
Single-screen features. They each only have one component, but they're still isolated folders
because a feature might grow (e.g., `profile/` could one day have `profile/edit/`).

---

## `layout/` — chrome, not content

Layout components are rendered *around* screens, not *as* screens:

- **`tab-bar/`** — the floating bottom nav (Home, Swipe, Queue, History, Me). It appears inside
  every screen that's part of the main app. It's in `layout/` not `shared/` because it's tied to
  navigation logic (routes), not just visual presentation.
- **`top-bar/`** — the header strip used on auth screens. Accepts `<ng-content>` projections for
  leading/trailing buttons.
- **`mobile-shell/`** — a max-width wrapper that centers the 390px mobile layout on desktop.

---

## `shared/` — pure UI atoms with no business logic

Components in `shared/` know nothing about the app's domain. They only receive `@Input()` and
emit `@Output()`. No service injection, no routing.

- **`icon/`** — renders one of 25 inline SVGs. All icons are bundled as string constants — no
  network request, no icon font, no missing-glyph problems. The `IconName` union type means
  TypeScript catches typos at compile time.
- **`poster/`** — generates a CSS-only movie poster using `oklch()` gradients. It takes `hue` and
  `variant` and produces a unique visual for each movie without any image file. This is what makes
  the app work without a real TMDB API.
- **`avatar/`** — a circular avatar with initials and a hue-based background color.
- **`pill/`** — the three-state toggle button (nice / must-have / exclude) used in the filters screen.
- **`stat/`** — a labelled number card used in the stats screen.

---

## Why every component is one `.ts` file (no `.html` or `.scss` siblings)

Standard Angular generates three files per component: `foo.component.ts`, `foo.component.html`,
`foo.component.scss`. This project uses **inline templates and inline styles** instead:

```typescript
@Component({
  template: `<div>...</div>`,
  styles: [`div { color: red; }`],
})
```

The reason: this is a mobile app with small, focused screens. Each component is self-contained
enough that the template and styles are short. Having three files per component means 3× the
file-jumping with no benefit at this scale. If a component grew large enough that inline became
painful, you'd extract the template to a separate file at that point.

---

## Why `ChangeDetectionStrategy.OnPush` is everywhere

By default Angular re-checks every component on every event (mouse move, HTTP response, timer…).
`OnPush` tells Angular: "only re-check this component when its `@Input()` reference changes or
a Signal it reads changes." This halves unnecessary rendering work. Combined with Signals, it's
essentially opt-in reactivity — the component only re-renders when data it actually uses changes.

---

## The one genuinely weird thing: `.github/` inside `frontend/`

Normally `.github/workflows/` lives at the repository root. Here it's inside `frontend/` because
**`frontend/` and `backend/` will each be their own git repository**. The GitHub Actions workflow
needs to be at the root of *its* repo to be picked up by GitHub, so it lives inside the folder
that becomes its own repo.

---

## Summary table

| Folder | What goes there | Rule for adding something |
|---|---|---|
| `core/models/` | TypeScript interfaces matching API responses | One new interface per new API resource |
| `core/services/` | App-wide singletons (HTTP, auth, state) | Only if used by 2+ features |
| `core/guards/` | Route activation logic | One guard per protection type |
| `core/interceptors/` | HTTP middleware | One interceptor per cross-cutting concern |
| `features/<name>/` | A screen or flow of screens | One folder per distinct user journey |
| `layout/` | Navigation and shell chrome | Only components rendered *around* screens |
| `shared/components/` | Domain-free UI atoms | Only if `@Input`/`@Output` only, no services |
| `environments/` | Per-environment config values | One file per deployment target |
