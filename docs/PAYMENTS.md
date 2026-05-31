# Payments

> Open this only when the project takes payments, sells products/subscriptions, issues
> refunds, pays out sellers/creators, or has marketplace/platform money flow.

## Default Choice

Midtrans is the default payment gateway for Indonesian payment needs in this template.
Integrate it from `apps/server`, not `apps/web`.

Use Midtrans for normal merchant checkout:

- The server creates the transaction using the Midtrans server key.
- The browser uses the public client key only when needed by Snap.
- The webhook/HTTP notification is the source of truth for payment status.
- Verify the webhook signature hash. Do not trust browser redirects.
- Store orders, payment attempts, and provider transaction ids in Postgres.

Official references:

- Midtrans payment overview: <https://docs.midtrans.com/docs/payment-overview?id=next-step>
- Receiving funds/payout: <https://docs.midtrans.com/docs/receive-your-fund>
- Midtrans payout product page: <https://stg.midtrans.com/product/payouts>

## Payment Model Decision Tree

Before implementing payments, classify the product:

### 1. Single-Merchant Ecommerce

One business sells its own products or services.

Recommended default: Midtrans Snap/Core API.

Money flow:

```text
Buyer -> Midtrans -> Platform merchant account -> Platform bank account
```

Build:

- Orders table.
- Payment attempts table.
- Midtrans transaction creation endpoint.
- Midtrans notification webhook.
- Order/payment state machine.
- Refund handling if the product needs it.

### 2. SaaS Subscription Or Digital Product

One business charges for access, credits, plans, or digital goods.

Midtrans may fit, but confirm the billing model first:

- One-time payment.
- Manual renewal.
- Recurring/subscription.
- Usage-based billing.

Do not invent subscription logic casually. Document the billing model and lifecycle before
building.

### 3. Simple Marketplace, Platform As Merchant Of Record

Multiple sellers/creators sell through the platform, but the platform collects buyer money
first and later pays sellers from an internal ledger.

Possible approach:

```text
Buyer -> Midtrans -> Platform merchant account -> Internal ledger -> Seller payout/disbursement
```

This may be viable when the platform is legally and operationally allowed to hold funds,
calculate seller balances, and pay sellers later.

Extra requirements:

- Seller onboarding and bank account collection.
- Seller KYC/compliance requirements.
- Ledger entries for every order, fee, refund, adjustment, and payout.
- Payout/disbursement workflow.
- Reconciliation between Midtrans settlement, internal ledger, and bank movement.
- Dispute/refund rules before seller payout.
- Tax/accounting ownership.

Do not call this "split payment" unless the provider actually splits settlement. This is
platform-collected payment plus later seller payout.

### 4. Shopee-Like Marketplace With Many Independent Sellers

Many sellers transact independently on one platform, possibly with carts containing products
from multiple sellers, seller-specific settlement, commissions, refunds, and disputes.

Do not assume standard Midtrans Snap/Core API is enough.

As of the latest official docs checked for this template, Midtrans clearly documents payment
acceptance and merchant payout/withdrawal/disbursement capabilities, but this template has
not verified a standard public Midtrans feature equivalent to native marketplace split
settlement/sub-merchant onboarding in one checkout.

Before building, confirm with Midtrans sales/support whether your account supports:

- Sub-merchant onboarding.
- Split settlement to multiple sellers.
- Platform commission.
- Multi-seller carts.
- Seller-level refund/dispute handling.
- Seller payout reports.
- Compliance/KYC responsibility.

If Midtrans does not support the required marketplace model for your account, evaluate a
marketplace-capable PSP or a compliant ledger-plus-payout architecture with legal review.

## State Machine

Keep payment and order states separate.

Example payment states:

- `pending`
- `paid`
- `failed`
- `expired`
- `cancelled`
- `refunded`
- `partially_refunded`

Example order states:

- `draft`
- `awaiting_payment`
- `paid`
- `processing`
- `fulfilled`
- `cancelled`
- `refunded`

The webhook updates payment state. Business logic decides how payment state affects order
state.

## Webhook Rules

- Public route, but signature-verified.
- Validate body with Zod.
- Idempotent by provider transaction id/order id.
- Safe to retry.
- Logs enough for reconciliation without leaking secrets.
- Treat browser redirect as user experience only, not final truth.

## Refunds And Reconciliation

Before shipping payments, define:

- Who can request refunds.
- Whether partial refunds exist.
- What happens if seller payout already happened.
- How order, payment, ledger, and inventory states change.
- How finance/admin users reconcile Midtrans reports with app records.

## Payment Readiness Checklist

Answer these before implementation starts:

- [ ] Who is the merchant of record?
- [ ] Is this single-merchant, SaaS billing, simple marketplace, or Shopee-like marketplace?
- [ ] Does the chosen Midtrans account support the required model?
- [ ] Are buyer payment, provider settlement, platform ledger, seller payout, and refunds
      modeled separately?
- [ ] Are webhook retries and replay/idempotency handled?
- [ ] What happens when payment succeeds but order fulfillment fails?
- [ ] What happens when a refund is requested after seller payout?
- [ ] Who owns tax, seller KYC, dispute handling, and reconciliation?
- [ ] Are payment states and order states separate?
- [ ] Are admin/finance reconciliation views in scope?

## Sync Checklist

- [ ] Payment model is classified using this decision tree.
- [ ] `docs/API.md` includes payment endpoints and webhook contracts.
- [ ] `packages/types` includes Zod schemas for payment requests/webhooks.
- [ ] `docs/DATABASE.md` covers orders, payments, ledger, payout, and refund tables as needed.
- [ ] `docs/PROGRESS.md` includes payment UI, server, database, webhook, test, and reconciliation tasks.
- [ ] `docs/DECISIONS.md` records any provider or marketplace-money-flow decision.
- [ ] Secrets stay server-only, except public client keys explicitly intended for the browser.
