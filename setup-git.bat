@echo off
echo Initializing git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Making initial commit...
git commit -m "Initial commit: Cursor Team Leaderboard prototype"

echo.
echo Adding remote repository...
git remote add origin https://github.com/uzunian/cursor-rank.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
echo Note: You may be prompted for GitHub credentials
git push -u origin main

echo.
echo Done! Check https://github.com/uzunian/cursor-rank to see your code.
echo.
pause

