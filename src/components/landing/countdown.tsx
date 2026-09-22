import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HOST_EMAIL } from "@/lib/brand";
import { formatSessionLocal } from "@/lib/session";

function split(ms: number) {
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor((ms % 86_400_000) / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1000),
  };
}

export function SessionClock({
  target,
  size = "card",
}: {
  target: Date;
  size?: "card" | "hero";
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = Math.max(0, target.getTime() - (now ?? target.getTime()));
  const live = now !== null && remaining === 0;
  const t = split(remaining);
  const cells = [
    { n: t.d, l: "days" },
    { n: t.h, l: "hours" },
    { n: t.m, l: "min" },
    { n: t.s, l: "sec" },
  ];
  const hero = size === "hero";

  if (live) {
    return (
      <p className={cn("font-medium", hero ? "text-lg" : "text-sm")} role="status">
        We’re live. Open the join email from {HOST_EMAIL}.
      </p>
    );
  }

  return (
    <div
      className={cn("grid grid-cols-4", hero ? "gap-3" : "gap-2")}
      role="timer"
      aria-live="polite"
      aria-label="Time until the 4 October webinar"
    >
      {cells.map((c) => (
        <div
          key={c.l}
          className={cn(
            "text-center",
            hero
              ? "rounded-lg bg-surface px-2 py-4 shadow-[var(--shadow-border)]"
              : "rounded-md bg-elevated px-2 py-3 shadow-[var(--shadow-border)]",
          )}
        >
          <p
            className={cn(
              "font-mono tabular-nums tracking-tight",
              hero ? "text-3xl font-medium sm:text-4xl" : "text-lg",
            )}
          >
            {now === null ? "—" : String(c.n).padStart(2, "0")}
          </p>
          <p className="text-kicker mt-1 uppercase text-subtle">{c.l}</p>
        </div>
      ))}
    </div>
  );
}

export function LocalTime({ date }: { date: Date }) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    setLabel(formatSessionLocal(date));
  }, [date]);
  if (!label) return null;
  return <p className="text-xs text-muted">Your time · {label}</p>;
}
