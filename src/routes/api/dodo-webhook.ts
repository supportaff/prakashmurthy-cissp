import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/dodo-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { env } = await import("@/lib/env.server");
        const { paymentCustomer, sendJoinEmail, verifyDodoWebhook } = await import(
          "@/lib/mail.server"
        );

        const raw = await request.text();
        const secret = env("DODO_PAYMENTS_WEBHOOK_KEY") ?? env("DODO_WEBHOOK_SECRET");
        if (!secret) {
          return Response.json({ error: "Webhook secret missing" }, { status: 500 });
        }
        if (!verifyDodoWebhook(raw, request.headers, secret)) {
          return Response.json({ error: "Invalid signature" }, { status: 401 });
        }

        let payload: unknown;
        try {
          payload = JSON.parse(raw) as unknown;
        } catch {
          return Response.json({ error: "Bad JSON" }, { status: 400 });
        }

        const type = (payload as { type?: string }).type;
        if (type && type !== "payment.succeeded") {
          return Response.json({ received: true, ignored: type });
        }

        const customer = paymentCustomer(payload);
        if (!customer) {
          return Response.json({ received: true, ignored: "no-customer" });
        }

        try {
          await sendJoinEmail(customer);
        } catch (err) {
          console.error("[dodo-webhook] mail failed", err);
          return Response.json({ error: "Mail failed" }, { status: 500 });
        }

        return Response.json({ received: true, mailed: customer.email });
      },
    },
  },
});
