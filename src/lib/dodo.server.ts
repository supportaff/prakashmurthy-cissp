import { env } from "@/lib/env.server";
import { SITE_URL } from "@/lib/brand";
import { SESSION_AMOUNT, type Currency } from "@/lib/currency";
import type { CheckoutInput, CheckoutResult } from "@/lib/checkout";

const PRODUCT_ENV: Record<Currency, string> = {
  INR: "DODO_PRODUCT_INR",
  USD: "DODO_PRODUCT_USD",
  EUR: "DODO_PRODUCT_EUR",
};

const LINK_ENV: Record<Currency, string> = {
  INR: "DODO_PAY_LINK_INR",
  USD: "DODO_PAY_LINK_USD",
  EUR: "DODO_PAY_LINK_EUR",
};

function origin(): string {
  const explicit = env("DODO_RETURN_ORIGIN");
  if (explicit) return explicit.replace(/\/$/, "");
  const prod = env("VERCEL_PROJECT_PRODUCTION_URL");
  if (prod) return `https://${prod.replace(/^https?:\/\//, "")}`;
  return SITE_URL;
}

function dodoBase(): string {
  const mode = (env("DODO_PAYMENTS_ENVIRONMENT") ?? "live_mode").toLowerCase();
  return mode === "test_mode" ? "https://test.dodopayments.com" : "https://live.dodopayments.com";
}

export async function createDodoCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length < 2) return { ok: false, error: "Put the name you want on the receipt." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That email does not look usable for the join link." };
  }

  const payLink = env(LINK_ENV[input.currency]);
  const apiKey = env("DODO_PAYMENTS_API_KEY");
  const productId = env(PRODUCT_ENV[input.currency]) ?? env("DODO_PRODUCT_ID");

  if (apiKey && productId) {
    const res = await fetch(`${dodoBase()}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: { email, name },
        billing_currency: input.currency,
        return_url: `${origin()}/?paid=1`,
        metadata: {
          window: input.window,
          price: String(SESSION_AMOUNT[input.currency]),
          host: "prakashmurthy",
        },
      }),
    });
    const body = (await res.json().catch(() => null)) as { checkout_url?: string; message?: string } | null;
    if (!res.ok || !body?.checkout_url) {
      return {
        ok: false,
        error: body?.message ?? "Dodo checkout failed. Check the API key and product IDs.",
      };
    }
    return { ok: true, checkoutUrl: body.checkout_url };
  }

  if (payLink) {
    const url = new URL(payLink);
    url.searchParams.set("email", email);
    url.searchParams.set("fullName", name);
    return { ok: true, checkoutUrl: url.toString() };
  }

  return {
    ok: false,
    error:
      "Dodo Payments is not connected yet. Add DODO_PAYMENTS_API_KEY and DODO_PRODUCT_INR / USD / EUR on Vercel.",
  };
}
