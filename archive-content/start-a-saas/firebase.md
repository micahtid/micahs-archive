# Firebase Setup

## 1. Create Project

1. [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter name, follow wizard
4. Click **Create project**


## 2. Authentication

1. Go to **Build**, then **Authentication**
2. Click **Get started**
3. Enable **Google** provider
4. Select support email
5. Click **Save**


## 3. Firestore

1. Go to **Build**, then **Firestore Database**
2. Click **Create database**
3. Select Production mode
4. Select location (`us-central1`)
5. Click **Enable**


## 4. Web App Config

1. Open **Project settings** (gear icon)
2. Under **Your apps**, click Web icon (`</>`)
3. Register app
4. Copy config to `.env.local`:

```javascript
apiKey: "AIzaSy..."
authDomain: "project.firebaseapp.com"
projectId: "project-id"
storageBucket: "project.appspot.com"
messagingSenderId: "123456789012"
appId: "1:123456789012:web:abc..."
measurementId: "G-XXXXXXXXXX"
```


## 5. Stripe Extension

1. Go to **Build**, then **Extensions**
2. Search "Run Stripe Payments"
3. Click **Install**
4. Location: `us-central1`
5. Stripe API key: use **restricted key** with permissions:
   - write: customers, checkout sessions, customer portal
   - read: subscriptions, prices
6. Click **Install** (may fail first time, rebuild)


## 6. Webhook

Webhook URL format:
```
https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/ext-firestore-stripe-payments-handleWebhookEvents
```

Steps:

1. [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter URL above
4. Select events: `product.*`, `price.*`, `checkout.session.completed`, `customer.subscription.*`, `payment_intent.*`, `tax_rate.*`, `invoice.*`
5. Click **Add endpoint**
6. Copy **Signing secret** (`whsec_...`)
7. In Firebase, go to **Extensions**, click **Manage**, then **Reconfigure**
8. Paste secret and rebuild
