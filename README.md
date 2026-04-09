# Manoj C R — Portfolio

Full-stack MERN portfolio with admin CMS. Both frontend and backend deploy to **Vercel**.

## How it works on Vercel

```
/ (root)          → serves client/dist (React build)
/api/*            → serverless function (api/index.js → Express)
```

## Deploy to Vercel (step by step)

### 1. Push to GitHub
Make sure your repo does NOT contain `.env` files (they are gitignored).

### 2. Import on vercel.com
- New Project → Import from GitHub
- **Root Directory**: leave as `/` (project root)
- Vercel auto-detects the `vercel.json`

### 3. Set Environment Variables on Vercel
Go to Project → Settings → Environment Variables and add:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | 64-char random string (see below) |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://your-project.vercel.app` |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |

Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Deploy
Click Deploy. Vercel runs `cd client && npm install && npm run build` for the frontend,
and `api/index.js` becomes a serverless function for the backend.

### 5. After first deploy
- Visit `https://your-project.vercel.app/api/health` — should return `{"status":"ok"}`
- The admin user is auto-created on first request using your `ADMIN_EMAIL` + `ADMIN_PASSWORD`

## Local Development

```bash
# Install root deps (for api/index.js)
npm install

# Backend
cd server && npm install
cp .env.example .env   # fill in your local values
npm run dev            # runs on :5000

# Frontend (new terminal)
cd client && npm install
npm run dev            # runs on :5173, proxies /api to :5000
```

## Project Structure

```
portfolio/
├── api/
│   └── index.js         ← Vercel serverless entry (Express app)
├── client/              ← React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/              ← Express routes, controllers, models
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
├── package.json         ← Root deps (used by Vercel for api/index.js)
└── vercel.json          ← Routing config
```

## Security Notes
- `.env` files are gitignored — never commit them
- All secrets go in Vercel Environment Variables
- Contact messages require admin auth to read
- File uploads are validated by type and size
- Rate limiting on auth (20/15min) and contact (10/hr)
