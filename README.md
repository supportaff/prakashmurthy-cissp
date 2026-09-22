# Prakashmurthy — CISSP first-attempt webinar

Landing page for the live 2-hour CISSP session on **Sunday 4 October, 10:00 IST**.

- ₹199 / $3.99 / €3.99
- Live only, no recording
- Host: [Prakashmurthy](https://prakashmurthy.com) · [connect@prakashmurthy.com](mailto:connect@prakashmurthy.com)

## Local

```bash
npm install
npm run dev
```

## Deploy

TanStack Start on Vercel (`npm run build`, Nitro `vercel` preset).

### Dodo + auto join email

After a paid checkout, Dodo hits `POST /api/dodo-webhook` and the app emails the join link.

In Dodo: Developer → Webhooks → Add endpoint

`https://prakashmurthy-cissp.vercel.app/api/dodo-webhook`

Event: `payment.succeeded`. Paste the signing secret into Vercel.

| Key | Why |
|---|---|
| `DODO_PAYMENTS_API_KEY` | Checkout |
| `DODO_PAYMENTS_ENVIRONMENT` | `test_mode` then `live_mode` |
| `DODO_PRODUCT_INR` / `USD` / `EUR` | Product ids |
| `DODO_PAYMENTS_WEBHOOK_KEY` | Webhook signing secret (`whsec_…`) |
| `WEBINAR_JOIN_URL` | Google Meet / Zoom link in the auto-mail |
| `GMAIL_USER` | Gmail that sends (often `connect@prakashmurthy.com`) |
| `GMAIL_APP_PASSWORD` | Google App Password (not your login password) |

Gmail: Google Account → Security → 2-step verification → App passwords. Or set `RESEND_API_KEY` + `EMAIL_FROM` instead of Gmail.
