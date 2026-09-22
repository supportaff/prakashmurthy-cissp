import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CURRENCIES,
  detectCurrency,
  examPrice,
  sessionPrice,
  writeCurrency,
  type Currency,
} from "@/lib/currency";

type Money = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  session: string;
  exam: string;
};

const MoneyContext = createContext<Money | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  useEffect(() => {
    setCurrencyState(detectCurrency());
  }, []);

  const value = useMemo<Money>(
    () => ({
      currency,
      setCurrency: (next) => {
        setCurrencyState(next);
        writeCurrency(next);
      },
      session: sessionPrice(currency),
      exam: examPrice(currency),
    }),
    [currency],
  );

  return <MoneyContext.Provider value={value}>{children}</MoneyContext.Provider>;
}

export function useMoney(): Money {
  const ctx = useContext(MoneyContext);
  if (!ctx) throw new Error("useMoney must be used inside CurrencyProvider");
  return ctx;
}

export function CurrencySelect({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency } = useMoney();
  return (
    <div
      role="radiogroup"
      aria-label="Pay in"
      className={cn(
        "flex rounded-md bg-elevated p-0.5 shadow-[var(--shadow-border)]",
        compact ? "h-10" : "h-11",
      )}
    >
      {CURRENCIES.map((c) => {
        const active = currency === c.id;
        const price = sessionPrice(c.id);
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`Pay ${price}`}
            title={`Pay ${price}`}
            onClick={() => setCurrency(c.id)}
            className={cn(
              "min-h-9 min-w-11 flex-1 rounded-sm px-2.5 text-base font-medium transition-[background-color,color] duration-150 ease-out",
              active ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
          >
            {c.symbol}
          </button>
        );
      })}
    </div>
  );
}
