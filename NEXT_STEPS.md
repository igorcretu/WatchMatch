# WatchMatch — What to do next

## 1. Run the backend locally (first test)

```bash
cd backend
pip install -r requirements.txt
SECRET_KEY=changeme uvicorn main:app --reload
```

Open `http://localhost:8010/docs` — the Swagger UI lets you create a user and verify all endpoints work.

---

## 2. Run the frontend locally

```bash
cd frontend
npm install
npm start          # → http://localhost:4200
```

Register a user, pair with a second account, start a session, swipe through cards.  
The app talks to `http://localhost:8010/api` in dev mode (see `src/environments/environment.ts`).

---

## 3. Deploy the backend to Raspberry Pi

**On the Pi:**

```bash
git clone <your-backend-repo> watchmatch-backend
cd watchmatch-backend

# Create the secret key (keep this safe)
echo "SECRET_KEY=$(openssl rand -hex 32)" > .env

docker compose --env-file .env up -d --build
```

Confirm it's running:
```bash
curl http://localhost:8010/health
```

---

## 4. Expose the backend via Cloudflare tunnel

If you haven't set up the tunnel yet:

```bash
cloudflared tunnel create watchmatch
cloudflared tunnel route dns watchmatch matchapi.crig.dev
```

In the tunnel config (`~/.cloudflared/config.yml`):
```yaml
tunnel: <tunnel-id>
credentials-file: /home/pi/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: matchapi.crig.dev
    service: http://localhost:8010
  - service: http_status:404
```

Start it:
```bash
cloudflared tunnel run watchmatch
```

Test: `curl https://matchapi.crig.dev/health`

---

## 5. Deploy the frontend to Netlify

### One-time setup
1. Create a Netlify site (via UI or `npx netlify-cli sites:create`)
2. Add these secrets to your **frontend GitHub repo** → Settings → Secrets → Actions:
   - `NETLIFY_AUTH_TOKEN` — from `netlify.com/user/applications`
   - `NETLIFY_SITE_ID` — from your Netlify site settings

### Deploy
Push to `main` in the frontend repo — GitHub Actions (`.github/workflows/deploy.yml`) handles the build and publish automatically.

The production build uses `https://matchapi.crig.dev/api` (see `src/environments/environment.prod.ts`).

---

## 6. Initialize git repos

```bash
# Frontend repo
cd frontend
git init
git add .
git commit -m "initial"
git remote add origin <frontend-github-url>
git push -u origin main

# Backend repo
cd ../backend
git init
git add .
git commit -m "initial"
git remote add origin <backend-github-url>
git push -u origin main
```

> **Important:** Never commit the `.env` file. It's already in `.gitignore` via the `docker-compose.yml` env-file reference.

---

## 7. CORS — update if your Netlify URL is known

In `backend/main.py`, the CORS origins list includes `*.netlify.app`. Once you have a custom domain, add it there and redeploy the backend.

---

## 8. What's not wired up yet (nice-to-have)

| Feature | Status | Notes |
|---|---|---|
| Group mode (`/group/:id`) | UI shell only | No backend group sessions |
| Push notifications | UI bell icon only | Would need FCM or web push |
| Real poster images | Placeholder `PosterComponent` | Integrate TMDB API for real art |
| Partner name in Waiting/Match screens | Shows "Partner" | Would need `GET /users/{partner_id}` endpoint |
| Agreement rate in Stats | Shows `—` | Would need per-session analytics endpoint |
| Onboarding step 3 (profile setup) | Skipped to pair | Could add hue/avatar picker |

---

## Quick reference

| Thing | Where |
|---|---|
| API base (dev) | `http://localhost:8010/api` |
| API base (prod) | `https://matchapi.crig.dev/api` |
| Swagger docs | `http://localhost:8010/docs` |
| Frontend dev | `http://localhost:4200` |
| DB file (Pi) | `/var/lib/docker/volumes/backend_db_data/` |
| Auth token storage | `localStorage` key `wm_token` |
