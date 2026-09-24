import { useCallback, useEffect, useState, type ReactNode } from "react";
import { HOST_EMAIL, HOST_NAME } from "@/lib/brand";
import { sessionWhen } from "@/lib/session";

type Choice = {
  kind: "choice";
  kicker: string;
  title: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
  note: string;
};

type Slide =
  | { kind: "title"; note: string }
  | { kind: "rules"; note: string }
  | { kind: "agenda"; note: string }
  | { kind: "near"; note: string }
  | { kind: "split"; note: string }
  | { kind: "fact"; note: string }
  | Choice
  | { kind: "ethics"; note: string }
  | { kind: "cat"; note: string }
  | { kind: "pace"; note: string }
  | { kind: "weights"; note: string }
  | { kind: "traps"; note: string }
  | { kind: "cut"; note: string }
  | { kind: "morning"; note: string }
  | { kind: "sheet"; note: string }
  | { kind: "kit"; note: string }
  | { kind: "end"; note: string };

const SLIDES: Slide[] = [
  {
    kind: "title",
    note: "Welcome them. You sat once and passed. This is the method, not the book. Notes, because there is no replay. You are not ISC2.",
  },
  {
    kind: "rules",
    note: "Kill the dump expectation now. Recalled items get people banned and do not beat a rotating bank. The product is these two hours.",
  },
  {
    kind: "agenda",
    note: "Cameras optional. Ask them to keep one practice item they keep missing for the last block. Do not wander off the clock.",
  },
  {
    kind: "near",
    note: "First person. You knew the crypto and the ports and still answered as the person who configures the control. The change was not another chapter.",
  },
  {
    kind: "split",
    note: "Phishing click. The engineer resets a password and feels done. The risk owner asks what happens first, who is told, and what evidence is kept.",
  },
  {
    kind: "fact",
    note: "Read the facts. Pause. Tell them to write the stem before they look at options. Do not take answers yet.",
  },
  {
    kind: "choice",
    kicker: "Stem",
    title: "What do you do FIRST?",
    prompt: "A user clicked a phishing mail. Their password may be exposed.",
    options: [
      "Reset the password and force a new sign-in.",
      "Launch a company-wide awareness campaign.",
      "Disable the account forever.",
    ],
    answer: 0,
    why: "FIRST is the immediate control. Training is later. A permanent disable is the wrong severity.",
    note: "Twenty seconds of silence. Then click the room’s pick, or reveal the first card yourself.",
  },
  {
    kind: "choice",
    kicker: "Stem",
    title: "What is BEST?",
    prompt: "Same click. MFA is already on.",
    options: [
      "Only reset the password.",
      "Reset the password and review recent sign-ins.",
      "Send a memo and wait for the next drill.",
    ],
    answer: 1,
    why: "BEST is the most complete useful action. The FIRST answer is now incomplete. The facts did not change. The job did.",
    note: "Point at option one. It was right a minute ago. That is the whole trick.",
  },
  {
    kind: "choice",
    kicker: "Stem",
    title: "Which is NOT the right move?",
    prompt: "A lost laptop held customer data. Full-disk encryption was on.",
    options: [
      "Tell legal, per the incident plan.",
      "Assume the data is public because the laptop left the building.",
      "Preserve who had the device and when it was last seen.",
    ],
    answer: 1,
    why: "NOT flips the stem. The true statements are the distractors. Encryption changes the risk. Panic is the wrong call.",
    note: "Have them circle NOT before they read. From tonight, the stem word is written first on every practice item.",
  },
  {
    kind: "ethics",
    note: "You are not reading a canon line by line. This is the order you used when two options were both technically fine.",
  },
  {
    kind: "cat",
    note: "A hard stretch is often the exam doing its job. You stopped flagging in practice so the muscle matched the room.",
  },
  {
    kind: "pace",
    note: "One minute is a practice rail, not a published limit. The point is to stop rereading. You passed when you stopped being perfect on item twelve.",
  },
  {
    kind: "weights",
    note: "You are not teaching eight chapters. Domain 1 is governance. People who know crypto still miss it.",
  },
  {
    kind: "traps",
    note: "Operations: the order is the question. Contain, then hunt. Software: which role you are playing, not which tool you like.",
  },
  {
    kind: "cut",
    note: "You spent the last 48 hours on ethics, Domain 1, and sleep. A new chapter the night before burns the pace you just trained.",
  },
  {
    kind: "morning",
    note: "The exam may stop early. That is not a verdict you can read in the chair. You answered as the person who would still have a job if the control failed.",
  },
  {
    kind: "sheet",
    note: "One or two volunteered items. Refuse anything that looks recalled. Work the stem and the role. Then give them a quiet minute.",
  },
  {
    kind: "kit",
    note: "Thank them. No recording. No second product. Wish them one sitting. Stop talking.",
  },
  {
    kind: "end",
    note: "Read the line. Do not add a pitch. End.",
  },
];

const WEIGHTS = [
  { name: "Security and Risk Management", weight: 16 },
  { name: "Architecture and Engineering", weight: 13 },
  { name: "Communication and Network", weight: 13 },
  { name: "Identity and Access", weight: 13 },
  { name: "Security Operations", weight: 13 },
  { name: "Assessment and Testing", weight: 12 },
  { name: "Asset Security", weight: 10 },
  { name: "Software Development Security", weight: 10 },
];

const TRAPS = [
  ["Risk", "Governance move, not the technical control."],
  ["Architecture", "Principles, not product features."],
  ["Network", "Design the network. Do not configure the router."],
  ["Identity", "Lifecycle and least privilege, not the shiny protocol."],
  ["Operations", "Contain, then hunt."],
  ["Assessment", "Evidence and scope. Not “run the scanner”."],
  ["Assets", "Classification and ownership. Encryption is not a reflex."],
  ["Software", "Your role in a secure lifecycle."],
] as const;

export function Presenter() {
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState(false);
  const [sheet, setSheet] = useState({ stem: "", engineer: "", owner: "", why: "" });
  const slide = SLIDES[index];
  const when = sessionWhen();

  const go = useCallback((next: number) => {
    setIndex(Math.min(SLIDES.length - 1, Math.max(0, next)));
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " " || event.key === "PageDown") {
        event.preventDefault();
        go(index + 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === "Home") {
        go(0);
      } else if (event.key === "End") {
        go(SLIDES.length - 1);
      } else if (event.key === "n" || event.key === "N") {
        setNotes((open) => !open);
      } else if (event.key === "f" || event.key === "F") {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <div
        key={index}
        className="present-stage min-h-0 flex-1"
      >
        {slide.kind === "title" && <Title when={when} />}
        {slide.kind === "rules" && <Rules />}
        {slide.kind === "agenda" && <Agenda />}
        {slide.kind === "near" && <Near />}
        {slide.kind === "split" && <Split />}
        {slide.kind === "fact" && <Fact />}
        {slide.kind === "choice" && <ChoiceSlide slide={slide} />}
        {slide.kind === "ethics" && <Ethics />}
        {slide.kind === "cat" && <Cat />}
        {slide.kind === "pace" && <Pace />}
        {slide.kind === "weights" && <Weights />}
        {slide.kind === "traps" && <Traps />}
        {slide.kind === "cut" && <Cut />}
        {slide.kind === "morning" && <Morning />}
        {slide.kind === "sheet" && <Sheet value={sheet} onChange={setSheet} />}
        {slide.kind === "kit" && <Kit />}
        {slide.kind === "end" && <End />}
      </div>

      <footer className="relative z-30 flex items-center gap-4 border-t border-border bg-bg px-4 py-3 sm:px-6">
        <p className="font-mono text-xs tabular-nums text-subtle">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </p>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full bg-fg transition-[width] duration-500 ease-out"
            style={{ width: `${((index + 1) / SLIDES.length) * 100}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => go(index - 1)}
          className="hidden h-9 rounded-md px-3 text-sm text-muted hover:text-fg sm:inline"
          aria-label="Previous slide"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setNotes((open) => !open)}
          className="h-9 rounded-md px-3 text-sm text-muted hover:text-fg"
          aria-pressed={notes}
        >
          Notes
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          className="h-9 rounded-md bg-fg px-3 text-sm text-bg"
        >
          Next
        </button>
      </footer>

      {notes ? (
        <aside className="present-notes absolute inset-x-0 bottom-14 z-40 mx-auto max-w-3xl rounded-t-2xl bg-paper px-6 py-5 text-paper-fg shadow-[var(--shadow-paper)]">
          <p className="text-kicker font-medium uppercase text-paper-muted">Say this</p>
          <p className="mt-2 text-base leading-relaxed">{slide.note}</p>
        </aside>
      ) : null}

      <button
        type="button"
        aria-label="Previous"
        className="absolute top-0 bottom-14 left-0 z-10 w-8 cursor-w-resize sm:w-12"
        onClick={() => go(index - 1)}
      />
      <button
        type="button"
        aria-label="Next"
        className="absolute top-0 bottom-14 right-0 z-10 w-8 cursor-e-resize sm:w-12"
        onClick={() => go(index + 1)}
      />
    </div>
  );
}

function Stage({
  ink = false,
  kicker,
  children,
}: {
  ink?: boolean;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={
        ink
          ? "flex h-full flex-col justify-center bg-paper px-6 py-10 text-paper-fg sm:px-16"
          : "flex h-full flex-col justify-center px-6 py-10 sm:px-16"
      }
    >
      {kicker ? (
        <p className={`present-item text-kicker font-medium uppercase ${ink ? "text-paper-muted" : "text-accent"}`}>
          {kicker}
        </p>
      ) : null}
      {children}
    </section>
  );
}

function Title({ when }: { when: string }) {
  return (
    <Stage ink>
      <p className="present-item text-kicker font-medium uppercase text-paper-muted" style={{ animationDelay: "40ms" }}>
        {HOST_NAME}
      </p>
      <h1 className="present-item font-display mt-6 max-w-4xl text-5xl font-medium tracking-tight sm:text-7xl" style={{ animationDelay: "120ms" }}>
        I passed once. <em className="font-normal italic">These two hours are how.</em>
      </h1>
      <p className="present-item mt-8 max-w-xl text-lg text-paper-muted" style={{ animationDelay: "220ms" }}>
        {when}. Live only. Take notes — there is no recording.
      </p>
    </Stage>
  );
}

function Rules() {
  const lines = [
    "No recalled items.",
    "No recording and no replay.",
    "Not a course from zero.",
    "No second product at the end.",
    "Not an official certification class.",
  ];
  return (
    <Stage kicker="The contract">
      <h2 className="present-item font-display mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-6xl">
        What this room will not do.
      </h2>
      <ul className="mt-10 grid max-w-3xl gap-3">
        {lines.map((line, i) => (
          <li
            key={line}
            className="present-item rounded-xl bg-surface px-5 py-4 text-lg shadow-[var(--shadow-border)]"
            style={{ animationDelay: `${180 + i * 70}ms` }}
          >
            {line}
          </li>
        ))}
      </ul>
    </Stage>
  );
}

function Agenda() {
  const rows = [
    ["11:00", "How I almost failed"],
    ["11:20", "The manager test"],
    ["11:40", "Stem words"],
    ["12:10", "Where the marks sit"],
    ["12:35", "The last 48 hours, and your item"],
  ];
  return (
    <Stage kicker="Two hours">
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
        Five blocks. Then we stop.
      </h2>
      <ol className="mt-10 max-w-2xl">
        {rows.map(([time, label], i) => (
          <li
            key={time}
            className="present-item grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b border-border py-4"
            style={{ animationDelay: `${160 + i * 80}ms` }}
          >
            <span className="font-mono text-sm text-accent">{time}</span>
            <span className="text-xl">{label}</span>
          </li>
        ))}
      </ol>
    </Stage>
  );
}

function Near() {
  return (
    <Stage kicker="Six weeks out">
      <h2 className="present-item font-display mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-6xl">
        I was about to buy a retake.
      </h2>
      <div className="present-item mt-10 flex flex-wrap items-end gap-10" style={{ animationDelay: "160ms" }}>
        <p className="font-display text-7xl font-medium tracking-tight sm:text-8xl">68–74%</p>
        <p className="max-w-xs pb-2 text-muted">
          Practice scores. I knew the crypto and the ports. CISSP does not hire that person.
        </p>
      </div>
      <p className="present-item mt-8 max-w-xl text-lg" style={{ animationDelay: "280ms" }}>
        One sitting. Passed. The change was who I was answering as.
      </p>
    </Stage>
  );
}

function Split() {
  return (
    <Stage kicker="The switch">
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
        Answer as the risk owner.
      </h2>
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <article className="present-item rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)]" style={{ animationDelay: "140ms" }}>
          <p className="text-kicker font-medium uppercase text-subtle">Engineer</p>
          <ul className="mt-4 space-y-2 text-lg">
            <li>The clever control.</li>
            <li>A command line, a CVE, a product name.</li>
            <li>Feels finished when the setting changes.</li>
          </ul>
        </article>
        <article className="present-item rounded-2xl bg-paper p-6 text-paper-fg" style={{ animationDelay: "240ms" }}>
          <p className="text-kicker font-medium uppercase text-paper-muted">Risk owner</p>
          <ul className="mt-4 space-y-2 text-lg">
            <li>Who still has a job if it fails.</li>
            <li>Policy, ownership, order.</li>
            <li>The action you could defend.</li>
          </ul>
        </article>
      </div>
    </Stage>
  );
}

function Fact() {
  const stems = ["FIRST", "BEST", "MOST", "NOT"];
  return (
    <Stage kicker="One fact">
      <h2 className="present-item font-display mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
        A user clicked a phishing mail. The password may be exposed.
      </h2>
      <div className="mt-10 flex flex-wrap gap-3">
        {stems.map((stem, i) => (
          <span
            key={stem}
            className="present-item rounded-full bg-fg px-5 py-2 font-display text-2xl text-bg"
            style={{ animationDelay: `${200 + i * 90}ms` }}
          >
            {stem}
          </span>
        ))}
      </div>
      <p className="present-item mt-8 text-muted" style={{ animationDelay: "560ms" }}>
        The facts stay still. The job changes.
      </p>
    </Stage>
  );
}

function ChoiceSlide({ slide }: { slide: Choice }) {
  const [picked, setPicked] = useState<number | null>(null);
  const shown = picked !== null;
  return (
    <Stage kicker={slide.kicker}>
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">{slide.title}</h2>
      <p className="present-item mt-3 max-w-2xl text-lg text-muted" style={{ animationDelay: "80ms" }}>
        {slide.prompt}
      </p>
      <div className="mt-8 grid max-w-3xl gap-3">
        {slide.options.map((option, i) => {
          const correct = i === slide.answer;
          const state = !shown ? "idle" : correct ? "yes" : picked === i ? "no" : "dim";
          return (
            <button
              key={option}
              type="button"
              onClick={() => setPicked(i)}
              className={`present-item rounded-xl px-5 py-4 text-left text-lg transition-[background-color,color,transform] duration-300 ${
                state === "yes"
                  ? "bg-fg text-bg"
                  : state === "no"
                    ? "bg-elevated text-fg line-through decoration-1"
                    : state === "dim"
                      ? "bg-surface text-subtle shadow-[var(--shadow-border)]"
                      : "bg-surface shadow-[var(--shadow-border)] hover:-translate-y-0.5"
              }`}
              style={{ animationDelay: `${140 + i * 70}ms` }}
            >
              {option}
            </button>
          );
        })}
      </div>
      <p
        className={`mt-6 max-w-2xl text-base transition-opacity duration-500 ${shown ? "opacity-100" : "opacity-0"}`}
      >
        {slide.why}
      </p>
    </Stage>
  );
}

function Ethics() {
  const steps = [
    ["01", "People", "Protect them before the metric."],
    ["02", "The organisation", "Then the duty you owe the business."],
    ["03", "You", "Your comfort is last."],
  ];
  return (
    <Stage kicker="Tie-break">
      <h2 className="present-item font-display mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
        When two answers both work.
      </h2>
      <ol className="mt-10 grid gap-4 lg:grid-cols-3">
        {steps.map(([n, title, body], i) => (
          <li
            key={n}
            className="present-item rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)]"
            style={{ animationDelay: `${140 + i * 100}ms` }}
          >
            <p className="font-mono text-xs text-accent">{n}</p>
            <p className="font-display mt-3 text-3xl">{title}</p>
            <p className="mt-2 text-muted">{body}</p>
          </li>
        ))}
      </ol>
      <p className="present-item mt-6 text-sm text-subtle" style={{ animationDelay: "480ms" }}>
        A teaching order. Not a quoted code. Do not hide an incident to save a number.
      </p>
    </Stage>
  );
}

function Cat() {
  const cells = [
    ["Skip", "Gone.", true],
    ["Flag", "Gone.", true],
    ["Review", "Gone.", true],
    ["Commit", "The only muscle the room has.", false],
  ] as const;
  return (
    <Stage kicker="English CAT">
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-6xl">
        You cannot go back.
      </h2>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cells.map(([word, body, dead], i) => (
          <article
            key={word}
            className={`present-item rounded-2xl p-5 ${dead ? "bg-elevated text-subtle" : "bg-fg text-bg"}`}
            style={{ animationDelay: `${140 + i * 90}ms` }}
          >
            <p className={`font-display text-3xl ${dead ? "line-through" : ""}`}>{word}</p>
            <p className="mt-2 text-sm">{body}</p>
          </article>
        ))}
      </div>
    </Stage>
  );
}

function Pace() {
  const rules = [
    "Read the stem before the options.",
    "About one minute on a clean item.",
    "Do not negotiate with a stem you understood.",
    "A port number means the wrong exam.",
    "Decide, and move.",
  ];
  return (
    <Stage kicker="Practice rail">
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
        A pace that survives question 100.
      </h2>
      <ul className="mt-8 max-w-2xl space-y-3">
        {rules.map((rule, i) => (
          <li key={rule} className="present-item text-xl" style={{ animationDelay: `${120 + i * 70}ms` }}>
            {rule}
          </li>
        ))}
      </ul>
      <p className="present-item mt-8 text-sm text-subtle" style={{ animationDelay: "500ms" }}>
        One minute is a rail you practise against. It is not an official limit.
      </p>
    </Stage>
  );
}

function Weights() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <Stage kicker="Where first-timers bleed">
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
        The marks are not even.
      </h2>
      <ul className="mt-8 max-w-3xl space-y-3">
        {WEIGHTS.map((row) => (
          <li key={row.name} className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>{row.name}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-elevated">
                <div
                  className="h-full rounded-full bg-fg transition-[width] duration-1000 ease-out"
                  style={{ width: on ? `${(row.weight / 16) * 100}%` : "0%" }}
                />
              </div>
            </div>
            <span className="w-10 text-right font-mono text-sm tabular-nums text-accent">{row.weight}</span>
          </li>
        ))}
      </ul>
    </Stage>
  );
}

function Traps() {
  return (
    <Stage kicker="One sentence each">
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
        The trap, not the topic.
      </h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {TRAPS.map(([name, trap], i) => (
          <li
            key={name}
            className="present-item rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
            style={{ animationDelay: `${80 + i * 50}ms` }}
          >
            <p className="text-xs uppercase tracking-wider text-accent">{name}</p>
            <p className="mt-1">{trap}</p>
          </li>
        ))}
      </ul>
    </Stage>
  );
}

function Cut() {
  return (
    <Stage kicker="Last 48 hours">
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
        What to stop studying.
      </h2>
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <article className="present-item rounded-2xl bg-elevated p-6" style={{ animationDelay: "120ms" }}>
          <p className="text-kicker font-medium uppercase text-subtle">Stop</p>
          <ul className="mt-4 space-y-2 text-lg text-muted">
            <li>A new chapter.</li>
            <li>A fresh question bank the night before.</li>
          </ul>
        </article>
        <article className="present-item rounded-2xl bg-paper p-6 text-paper-fg" style={{ animationDelay: "220ms" }}>
          <p className="text-kicker font-medium uppercase text-paper-muted">Keep</p>
          <ul className="mt-4 space-y-2 text-lg">
            <li>Ethics and Domain 1.</li>
            <li>The stem habit.</li>
            <li>Sleep.</li>
          </ul>
        </article>
      </div>
    </Stage>
  );
}

function Morning() {
  const lines = [
    "Arrive so the clock is not the story.",
    "Stem, options, commit.",
    "Do not replay a settled item.",
    "Eat on a normal schedule.",
    "Stay the risk owner until it stops.",
  ];
  return (
    <Stage kicker="The morning">
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
        Already decided.
      </h2>
      <ul className="mt-8 max-w-xl space-y-3">
        {lines.map((line, i) => (
          <li key={line} className="present-item flex gap-3 text-xl" style={{ animationDelay: `${100 + i * 70}ms` }}>
            <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
            {line}
          </li>
        ))}
      </ul>
    </Stage>
  );
}

function Sheet({
  value,
  onChange,
}: {
  value: { stem: string; engineer: string; owner: string; why: string };
  onChange: (next: { stem: string; engineer: string; owner: string; why: string }) => void;
}) {
  const fields = [
    ["stem", "Stem"],
    ["engineer", "Engineer answer"],
    ["owner", "Risk-owner answer"],
    ["why", "Why they differ"],
  ] as const;
  return (
    <Stage kicker="Live">
      <h2 className="present-item font-display mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
        The item you keep missing.
      </h2>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {fields.map(([key, label], i) => (
          <label key={key} className="present-item block" style={{ animationDelay: `${100 + i * 60}ms` }}>
            <span className="text-xs uppercase tracking-wider text-subtle">{label}</span>
            <input
              value={value[key]}
              onChange={(event) => onChange({ ...value, [key]: event.target.value })}
              className="mt-1 w-full border-b border-border bg-transparent py-2 text-lg outline-none focus:border-fg"
            />
          </label>
        ))}
      </div>
      <p className="present-item mt-6 text-sm text-subtle" style={{ animationDelay: "400ms" }}>
        One practice item. Not a recalled exam item. The note stays in this browser.
      </p>
    </Stage>
  );
}

function Kit() {
  const lines = [
    "A pacing card.",
    "The manager test on one fact.",
    "BEST, FIRST, MOST, NOT, LEAST.",
    "A trap map weighted to 16 and 13.",
    "A 48-hour cut list, and your notes.",
  ];
  return (
    <Stage kicker="You leave with">
      <ol className="mt-2 max-w-2xl space-y-3">
        {lines.map((line, i) => (
          <li
            key={line}
            className="present-item font-display text-3xl font-medium tracking-tight sm:text-4xl"
            style={{ animationDelay: `${80 + i * 80}ms` }}
          >
            <span className="mr-3 font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
            {line}
          </li>
        ))}
      </ol>
    </Stage>
  );
}

function End() {
  return (
    <Stage ink>
      <h2 className="present-item font-display text-6xl font-medium tracking-tight sm:text-8xl">
        One sitting.
      </h2>
      <p className="present-item mt-8 max-w-lg text-lg text-paper-muted" style={{ animationDelay: "180ms" }}>
        Answer as the risk owner. Circle the stem. Commit. Sleep.
      </p>
      <p className="present-item mt-10 text-sm text-paper-muted" style={{ animationDelay: "300ms" }}>
        {HOST_NAME} · {HOST_EMAIL}
      </p>
    </Stage>
  );
}
