# Git Commands

## Initialize New Repo

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```


## Hard Reset (Discard Local Changes)

```bash
# basic reset
git fetch origin
git reset --hard origin/<branch-name>

# complete reset to main
git fetch origin
git reset --hard origin/main
git clean -fd
git restore .
git pull
```

**Warning**: Destroys all local changes.


## Common Commands

```bash
# status
git status
git log --oneline
git diff

# branch
git branch                     # list
git checkout -b feature-name   # create + switch
git checkout branch-name       # switch

# save changes
git add .
git add file1.js file2.js
git commit -m "message"
git push

# pull changes
git pull
```


## Stash

```bash
git stash                   # save for later
git stash list              # view stashes
git stash pop               # restore latest
git stash apply stash@{0}   # restore specific
```


## Undo Commit

```bash
# keep changes
git reset --soft HEAD~1

# discard changes
git reset --hard HEAD~1
```
