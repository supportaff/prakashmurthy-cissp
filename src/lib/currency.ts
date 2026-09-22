export type Currency = "INR" | "USD";

export const CURRENCY_KEY = "prakash:currency";
export const EXAM_USD = 749;
export const USD_INR = 95;

export const SESSION_AMOUNT: Record<Currency, number> = {
  INR: 199,
  USD: 3.99,
};

export const EXAM_AMOUNT: Record<Currency, number> = {
  INR: EXAM_USD * USD_INR,
  USD: EXAM_USD,
};

export const CURRENCIES: { id: Currency; label: string; symbol: string }[] = [
  { id: "INR", label: "Indian rupee", symbol: "₹" },
  { id: "USD", label: "US dollar", symbol: "$" },
];

export function formatPrice(amount: number, currency: Currency): string {
  const symbol = currency === "INR" ? "₹" : "$";
  const locale = currency === "INR" ? "en-IN" : "en-US";
  const digits = amount % 1 === 0 ? 0 : 2;
  return (
    symbol +
    amount.toLocaleString(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  );
}

export function sessionPrice(currency: Currency): string {
  return formatPrice(SESSION_AMOUNT[currency], currency);
}

export function examPrice(currency: Currency): string {
  return formatPrice(EXAM_AMOUNT[currency], currency);
}

export function detectCurrency(): Currency {
  if (typeof window === "undefined") return "INR";
  const saved = localStorage.getItem(CURRENCY_KEY);
  if (saved === "INR" || saved === "USD") return saved;
  const lang = navigator.language.toLowerCase();
  if (lang === "en-in" || lang.startsWith("hi") || lang.startsWith("ta") || lang.startsWith("te")) {
    return "INR";
  }
  if (lang.startsWith("en-") || lang.startsWith("de") || lang.startsWith("fr") || lang.startsWith("es") || lang.startsWith("it") || lang.startsWith("nl") || lang.startsWith("pt")) {
    return "USD";
  }
  return "INR";
}

export function writeCurrency(currency: Currency): void {
  localStorage.setItem(CURRENCY_KEY, currency);
}
