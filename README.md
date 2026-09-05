# Loopline — Mini Social Post Application

A full-stack MERN app users can sign up, log in, post text and/or images, and like/comment on posts in a
public feed.

## Structure

```
social-app/
├── backend/     Node.js + Express + MongoDB (Mongoose) API
└── frontend/    React (Vite) + MUI client
```

## Features

- Signup / login with JWT auth, passwords hashed with bcrypt
- Create post: text, image, or both (image stored as a data URL — no third-party
  storage needed for this scope)
- Public feed, paginated (`GET /api/posts?page=&limit=`), newest first
- Like / unlike (toggle) and comment on any post
- Two MongoDB collections: `users` and `posts` (comments/likes are embedded in posts)

## Run it locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev             # nodemon, http://localhost:5000
```

`MONGO_URI` — get a free cluster at https://www.mongodb.com/cloud/atlas, create a
database user, and copy the connection string (add a database name to the end,
e.g. `.../socialApp?retryWrites=true&w=majority`).

`JWT_SECRET` — any long random string, e.g. generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm run dev              # http://localhost:5173
```

## API Reference

| Method | Route                     | Auth | Description                        |
|--------|---------------------------|------|-------------------------------------|
| POST   | /api/auth/signup          | No   | Create account                     |
| POST   | /api/auth/login           | No   | Log in, returns JWT                |
| GET    | /api/auth/me              | Yes  | Current user                       |
| GET    | /api/posts?page=&limit=   | No   | Paginated public feed              |
| POST   | /api/posts                | Yes  | Create post `{ text, image }`      |
| PUT    | /api/posts/:id/like       | Yes  | Toggle like                        |
| POST   | /api/posts/:id/comment    | Yes  | Add comment `{ text }`             |
| GET    | /api/posts/mine           | Yes  | Posts by logged-in user            |

## Deployment

1. **MongoDB Atlas** — create a free cluster, whitelist `0.0.0.0/0` (or Render's
   IPs) under Network Access, and grab the connection string for `MONGO_URI`.

2. **Backend → Render**
   - New Web Service → connect your GitHub repo → root directory `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add env vars: `MONGO_URI`, `JWT_SECRET`
   - Copy the deployed URL, e.g. `https://your-app.onrender.com`

3. **Frontend → Vercel or Netlify**
   - Import the repo → root directory `frontend`
   - Build command: `npm run build`, output directory: `dist`
   - Add env var: `VITE_API_URL=https://your-app.onrender.com/api`

4. Update the backend's CORS setup if you want to restrict it to your deployed
   frontend origin (currently open, fine for this assignment).

## Notes / bonus points addressed

- Pagination is implemented server-side (`page`/`limit`/`hasMore`), with a
  "Load more" button on the feed.
- Optimistic UI update on like for instant feedback.
- Code is split into models/controllers/routes (backend) and
  pages/components/context/api (frontend) for reuse and readability.
- Comments are inline-collapsible per post rather than a separate page, matching
  a typical mobile social-feed pattern.
