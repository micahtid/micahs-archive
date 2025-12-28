# SaaS Codebase Setup

## 1. Clone Starter

```bash
git clone https://github.com/micahtid/react-starter-kit
cd react-starter-kit
npm install
```


## 2. Create New Repo

```bash
# remove existing git history
rm -rf .git

# initialize new repo
git init
git add .
git commit -m "Initial commit from react-starter-kit"

# connect to github (create repo first on github)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git
git branch -M main
git push -u origin main
```


## 3. Environment Variables

Create `.env.local`:

```env
# firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# stripe
NEXT_PUBLIC_STRIPE_PRICE_ID=

# site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

See firebase.md and stripe.md for values.


## 4. Run Dev Server

```bash
npm run dev
```

Open http://localhost:3000
