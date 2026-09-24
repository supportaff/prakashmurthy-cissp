import { useState } from "react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    stem: "FIRST",
    prompt: "A user clicked a phishing mail. Their password may be exposed.",
    options: [
      "Reset the password and force a new sign-in.",
      "Launch a company-wide awareness campaign.",
      "Disable the account forever.",
    ],
    answer: 0,
    why: "FIRST is the immediate control. Training is later. A permanent disable is not the first move.",
  },
  {
    stem: "BEST",
    prompt: "Same click. Password may be exposed. MFA is already on.",
    options: [
      "Only reset the password.",
      "Reset the password and review recent sign-ins for abuse.",
      "Send a memo and wait for the next phishing drill.",
    ],
    answer: 1,
    why: "BEST is the most complete useful action, not the fastest one and not the theatre.",
  },
  {
    stem: "NOT",
    prompt: "A lost laptop held customer data. Full-disk encryption was on.",
    options: [
      "Tell legal, per the incident plan.",
      "Assume the data is public because the laptop left the building.",
      "Preserve who had the device and when it was last seen.",
    ],
    answer: 1,
    why: "NOT flips the stem. Encryption changes the risk. Panic is the wrong call.",
  },
] as const;

export function StemDrill({
  onReserve,
  cta,
}: {
  onReserve?: () => void;
  cta?: string;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const item = ITEMS[index];
  const done = index >= ITEMS.length;
  const revealed = picked !== null;

  if (done) {
    return (
      <div className="mt-10 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <p className="text-kicker font-medium uppercase text-accent">Stem drill</p>
        <p className="font-display mt-2 text-2xl font-medium tracking-tight">
          {hits} of {ITEMS.length}. Same facts. Different stem. Different answer.
        </p>
        <p className="mt-2 text-sm text-muted">
          That switch is the hour. On 11 October we do it on items you keep missing.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {onReserve && cta ? (
            <button
              type="button"
              onClick={onReserve}
              className="h-11 rounded-md bg-fg px-4 text-sm font-medium text-bg"
            >
              {cta}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setPicked(null);
              setHits(0);
            }}
            className="text-sm text-fg underline underline-offset-4"
          >
            Run it again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-kicker font-medium uppercase text-accent">Try one stem</p>
        <p className="font-mono text-xs text-subtle">
          {index + 1} / {ITEMS.length}
        </p>
      </div>
      <p className="font-display mt-3 text-xl font-medium tracking-tight">
        What do you do <em className="font-normal italic">{item.stem}</em>?
      </p>
      <p className="mt-2 text-sm text-muted">{item.prompt}</p>
      <div className="mt-4 grid gap-2">
        {item.options.map((option, i) => {
          const selected = picked === i;
          const correct = i === item.answer;
          return (
            <button
              key={option}
              type="button"
              disabled={revealed}
              onClick={() => {
                setPicked(i);
                if (i === item.answer) setHits((n) => n + 1);
              }}
              className={cn(
                "rounded-md px-3 py-3 text-left text-sm transition-[box-shadow,background-color] duration-150",
                !revealed && "shadow-[var(--shadow-border)] hover:bg-elevated",
                revealed && correct && "bg-fg text-bg",
                revealed && selected && !correct && "bg-elevated text-muted line-through",
                revealed && !selected && !correct && "text-muted",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {revealed ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">{item.why}</p>
          <button
            type="button"
            onClick={() => {
              setPicked(null);
              setIndex((n) => n + 1);
            }}
            className="h-11 shrink-0 rounded-md bg-fg px-4 text-sm font-medium text-bg"
          >
            {index === ITEMS.length - 1 ? "See the score" : "Next stem"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
