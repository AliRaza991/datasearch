# DataSearch — Railway Deployment

## 📁 Folder Structure
```
datasearch-railway/
├── server.js          ← Node.js Express server
├── package.json       ← Dependencies
├── railway.toml       ← Railway config
└── public/
    └── index.html     ← YOUR DataSearch.html goes here
```

## 🚀 Deploy Steps

### Step 1 — Add Your HTML File
- Claude Design se DataSearch.html ka code copy karein
- `public/index.html` file mein paste karein (replace kar dein)

### Step 2 — GitHub par Upload
1. github.com → New Repository → "datasearch"
2. Upload all files (drag & drop)
3. Commit

### Step 3 — Railway Deploy
1. railway.app → Login with GitHub
2. "New Project" → "Deploy from GitHub repo"
3. "datasearch" repo select karein
4. Railway automatically detect karega aur deploy kar dega
5. Settings → Networking → "Generate Domain"
6. Live URL mil jayegi! ✅

## ⚠️ Important
- `public/index.html` mein apna DataSearch code paste karna ZAROOR hai
- Google Sheet published CSV URL already code mein honi chahiye
