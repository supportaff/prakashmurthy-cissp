import { createServerFn } from "@tanstack/react-start";
import type { Currency } from "@/lib/currency";
import type { ExamWindow } from "@/lib/session";

export type CheckoutInput = {
  name: string;
  email: string;
  currency: Currency;
  window: ExamWindow;
};

export type CheckoutResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string };

export const startCheckout = createServerFn({ method: "POST" })
  .validator((d: CheckoutInput) => d)
  .handler(async ({ data }): Promise<CheckoutResult> => {
    const { createDodoCheckout } = await import("./dodo.server");
    return createDodoCheckout(data);
  });
