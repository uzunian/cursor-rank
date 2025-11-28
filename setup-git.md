# Git Setup Instructions

Run these commands in your terminal (one at a time):

## 1. Initialize Git Repository
```bash
cd C:\Users\ArmenUzunian\Desktop\sandbox\fun\cursor-rank
git init
```

## 2. Add All Files
```bash
git add .
```

## 3. Make Initial Commit
```bash
git commit -m "Initial commit: Cursor Team Leaderboard prototype"
```

## 4. Create Repository on GitHub
- Go to https://github.com/new
- Repository name: `cursor-rank` (or whatever you prefer)
- Make it Public or Private (your choice)
- **DO NOT** initialize with README, .gitignore, or license (we already have these)
- Click "Create repository"

## 5. Add Remote and Push
Your repository URL: https://github.com/uzunian/cursor-rank.git

```bash
git remote add origin https://github.com/uzunian/cursor-rank.git
git branch -M main
git push -u origin main
```

**Note:** If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password (GitHub no longer accepts passwords)
- Or set up SSH keys for authentication

