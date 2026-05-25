# VaultIQ — AI Business Strategist

> Launch fast · Scale smart · Win globally

VaultIQ is an AI-powered executive coaching platform for entrepreneurs. Built on Claude, deployed on Vercel, zero-config to go live in minutes.

---

## Project structure

```
vaultiq/
├── pages/
│   ├── _app.js              ← Next.js wrapper
│   ├── index.js             ← VaultIQ chat UI
│   └── api/
│       └── chat.js          ← Secure AI route (API key server-side only)
├── .env.example             ← Copy to .env.local
├── .gitignore
├── next.config.js
└── package.json
```

---

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "feat: VaultIQ initial deploy"
git remote add origin https://github.com/YOUR_USERNAME/vaultiq.git
git push -u origin main
```

### 2. Import to Vercel
1. Go to https://vercel.com → **Add New Project**
2. Import your `vaultiq` GitHub repo
3. **Root Directory:** leave blank (repo root)
4. Click **Deploy**

### 3. Add API key
In Vercel: **Settings → Environment Variables**

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` from console.anthropic.com |

Save → **Deployments → Redeploy**

### 4. Add custom domain
**Settings → Domains** → add `vaultiq.ai` or your chosen domain.

---

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local — paste your ANTHROPIC_API_KEY
npm run dev
# Open http://localhost:3000
```

---

## Brand

| Token | Value |
|-------|-------|
| Name | VaultIQ |
| Tagline | Your AI Business Strategist |
| Primary color | `#4F46E5` (Indigo 600) |
| Gradient | Indigo → Violet |
| Logo initials | VQ |
| Persona voice | Direct · Sharp · Data-informed |

---

## Cost at scale

| Users | Messages/day | Est. API cost/mo |
|-------|-------------|-----------------|
| 100   | 20          | ~$8–15          |
| 500   | 20          | ~$40–75         |
| 1,000 | 20          | ~$80–150        |

Vercel Hobby plan: **free**.

---

## Security
- API key is server-side only — never in browser code
- `.env.local` excluded from git
- Input validated server-side
- History capped at 20 messages per request
- Error messages sanitized before reaching client
