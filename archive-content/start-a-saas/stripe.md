# Stripe Setup

## 1. Create Account

[Stripe Dashboard](https://dashboard.stripe.com/)


## 2. API Keys

1. Go to **Developers**, then **API keys**
2. Click **Create restricted key**
3. Name: "Firebase Stripe Extension"
4. Set permissions:
   - write: customers, checkout sessions, customer portal
   - read: subscriptions, prices
5. Click **Create key**
6. Copy for Firebase extension


## 3. Create Product

1. Go to **Products**, then **Product catalog**
2. Click **Add product**
3. Enter name, description
4. Configure pricing (amount, billing period, currency)
5. Click **Save product**


## 4. Get Price ID

1. Click product
2. Expand **Pricing**
3. Copy **Price ID** (`price_...`)
4. Add to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxxxxxxxxxxxx
```

[Products Link](https://dashboard.stripe.com/products)


## 5. Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | success |
| `4000 0000 0000 9995` | declined |

Use any future date, CVC, ZIP.
