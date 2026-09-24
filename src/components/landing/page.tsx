import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  Clock3,
  Mail,
  Share2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EnrollDialog } from "@/components/landing/enroll-dialog";
import { CurrencyProvider, CurrencySelect, useMoney } from "@/components/landing/currency";
import { StemDrill } from "@/components/landing/stem-drill";
import { EXAM_USD, USD_INR } from "@/lib/currency";
import { HOST_EMAIL, HOST_NAME, SITE_HOST } from "@/lib/brand";
import {
  agenda,
  attemptBeats,
  failPatterns,
  faqsFor,
  outcomes,
  readEnrollment,
  sessionWhen,
  sessionWhenShort,
  stories,
  walkOutWith,
  writeEnrollment,
  type Enrollment,
} from "@/lib/session";

export function LandingPage() {
  return (
    <CurrencyProvider>
      <LandingInner />
    </CurrencyProvider>
  );
}

function LandingInner() {
  const [open, setOpen] = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const { session } = useMoney();

  useEffect(() => {
    const existing = readEnrollment();
    const paid = new URLSearchParams(window.location.search).get("paid") === "1";
    if (paid && existing && !existing.paid) {
      const next = { ...existing, paid: true };
      writeEnrollment(next);
      setEnrollment(next);
      setOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }
    setEnrollment(existing);
    if (paid) setOpen(true);
  }, []);

  function reserve() {
    setOpen(true);
  }

  const cta = enrollment?.paid ? "You’re in" : `Reserve · ${session}`;

  return (
    <div className="bg-bg text-fg">
      <a
        href="#main"
        className="bg-fg text-bg sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <TopBar />
      <Header onReserve={reserve} cta={cta} />
      <main id="main" className="pb-24 lg:pb-0">
        <Hero onReserve={reserve} cta={cta} />
        <CostOfFail onReserve={reserve} cta={cta} />
        <Outcomes onReserve={reserve} cta={cta} />
        <Attempt />
        <Audience onReserve={reserve} cta={cta} />
        <Agenda />
        <Host />
        <Stories />
        <Price onReserve={reserve} cta={cta} />
        <Faq />
        <Close onReserve={reserve} cta={cta} />
      </main>
      <Footer />
      <StickyBar
        onReserve={reserve}
        enrolled={Boolean(enrollment?.paid)}
      />
      <EnrollDialog
        open={open}
        onOpenChange={setOpen}
        onPaid={(next) => {
          setEnrollment(next);
        }}
      />
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-elevated text-fg">
      <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 px-4 py-2 text-center text-xs text-muted sm:px-6">
        <span className="text-fg">{sessionWhen()}</span>
        <span aria-hidden="true" className="text-border">
          ·
        </span>
        <span>Live only · no recording</span>
        <span aria-hidden="true" className="hidden text-border sm:inline">
          ·
        </span>
        <span className="hidden sm:inline">Pay in ₹ $ €</span>
      </p>
    </div>
  );
}

function Header({ onReserve, cta }: { onReserve: () => void; cta: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#main" className="flex items-center gap-2.5">
          <Mark />
        </a>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#attempt" className="transition-colors duration-150 hover:text-fg">
            First attempt
          </a>
          <a href="#you-get" className="transition-colors duration-150 hover:text-fg">
            You get
          </a>
          <a href="#plan" className="transition-colors duration-150 hover:text-fg">
            Plan
          </a>
          <a href="#faq" className="transition-colors duration-150 hover:text-fg">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <CurrencySelect compact />
          <Button size="sm" onClick={onReserve} className="hidden sm:inline-flex">
            {cta}
          </Button>
        </div>
      </div>
    </header>
  );
}

function Mark() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-sm bg-fg font-display text-lg font-medium italic text-bg">
        P
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-medium tracking-wide">{HOST_NAME}</span>
        <span className="mt-0.5 text-xs text-muted">{SITE_HOST}</span>
      </span>
    </span>
  );
}

function Hero({
  onReserve,
  cta,
}: {
  onReserve: () => void;
  cta: string;
}) {
  const { session, exam } = useMoney();
  return (
    <section className="relative">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        <p className="fs-enter text-kicker font-medium uppercase text-accent">
          {sessionWhen()} · {session}
        </p>
        <h1
          className="fs-enter font-display mt-4 text-display font-medium tracking-tight"
          style={{ animationDelay: "80ms" }}
        >
          I passed CISSP on the <em className="font-normal italic">first attempt.</em> These two hours are how.
        </h1>
        <p
          className="fs-enter mt-5 max-w-xl text-base text-muted sm:text-lg"
          style={{ animationDelay: "140ms" }}
        >
          Not a CBK lecture. The thinking switch, CAT pacing, stem words, and
          48-hour plan I used so I never paid the {exam} exam twice. Live only
          — no recording. You leave with a drill you can sit this week.
        </p>
        <div
          className="fs-enter mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animationDelay: "200ms" }}
        >
          <Button size="lg" onClick={onReserve}>
            {cta}
            <ArrowRight />
          </Button>
          <a
            href="#you-get"
            className="inline-flex h-12 items-center justify-center px-2 text-sm text-muted transition-colors duration-150 hover:text-fg"
          >
            See exactly what you get
          </a>
        </div>
        <div className="fs-enter" style={{ animationDelay: "260ms" }}>
          <StemDrill onReserve={onReserve} cta={cta} />
          <p className="mt-3 text-xs text-muted">{sessionWhen()} · live only · no recording</p>
        </div>
      </div>
    </section>
  );
}

function CostOfFail({ onReserve, cta }: { onReserve: () => void; cta: string }) {
  const { session, exam, currency } = useMoney();
  const examNote =
    currency === "INR"
      ? `Official fee $${EXAM_USD} at ₹${USD_INR}. You pay this even if you fail.`
      : "Official ISC2 fee. You pay this even if you fail.";
  return (
    <section className="border-y border-border">
      <div className="mx-auto grid max-w-6xl gap-0 px-0 sm:grid-cols-3">
        <CostCell k="CISSP exam" v={exam} d={examNote} />
        <CostCell k="A retake" v={`+${exam}`} d="Plus 30 days you cannot sit. The expensive lesson." />
        <CostCell k="This webinar" v={session} d="Same room in every currency. One price. No second tier." />
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          The exam fee is the number that matters. {session} is the hedge against paying it twice.
        </p>
        <Button onClick={onReserve}>
          {cta}
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}

function CostCell({ k, v, d }: { k: string; v: string; d: string }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border px-6 py-8 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-xs uppercase tracking-wider text-subtle">{k}</p>
      <p className="font-display text-3xl font-medium tracking-tight">{v}</p>
      <p className="text-sm text-muted">{d}</p>
    </div>
  );
}

function Attempt() {
  return (
    <section id="attempt" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <p className="text-kicker font-medium uppercase text-accent">How I cleared it first time</p>
      <h2 className="font-display mt-3 max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl">
        I sat CISSP one time. I passed. I was six weeks from buying a retake.
      </h2>
      <p className="mt-4 max-w-2xl text-muted">
        This is not a victory lap. It is the three things I changed after my
        practice scores stalled — the same three we drill in the room.
      </p>
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {attemptBeats.map((beat) => (
          <article key={beat.k} className="flex flex-col gap-3">
            <span className="font-mono text-xs text-accent">{beat.k}</span>
            <h3 className="font-display text-2xl font-medium tracking-tight">{beat.title}</h3>
            <p className="text-sm text-muted">{beat.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Outcomes({ onReserve, cta }: { onReserve: () => void; cta: string }) {
  return (
    <section id="you-get" className="border-y border-border bg-paper text-paper-fg">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <p className="text-kicker font-medium uppercase text-paper-muted">
          What you get in this webinar
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
          Two live hours. Six things you can use on exam day — not a slide dump.
        </h2>
        <p className="mt-4 max-w-xl text-paper-muted">
          {sessionWhen()}. Cameras optional. Notes expected. No recording.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((item, i) => (
            <article
              key={item.title}
              className="flex flex-col gap-3 rounded-xl bg-paper p-5 shadow-[var(--shadow-paper)]"
            >
              <span className="font-mono text-xs text-paper-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="text-sm text-paper-muted">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="font-display text-2xl font-medium tracking-tight">You walk out with</h3>
            <p className="mt-3 text-sm text-paper-muted">
              Not a certificate. A kit you can sit the same week.
            </p>
            <Button variant="paper" size="lg" className="mt-8" onClick={onReserve}>
              {cta}
              <ArrowRight />
            </Button>
          </div>
          <ul className="flex flex-col gap-3 lg:col-span-7">
            {walkOutWith.map((line) => (
              <li key={line} className="flex gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span className="text-paper-muted">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Audience({ onReserve, cta }: { onReserve: () => void; cta: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-kicker font-medium uppercase text-accent">Who this is for</p>
          <h2 className="font-display mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            You’ve already studied. You’re still at risk of answering like an engineer.
          </h2>
          <p className="mt-4 max-w-prose text-muted">
            This is not a CBK tour. It is a tactics room for people who intend
            to walk out of Pearson VUE once.
          </p>
          <Button size="lg" className="mt-8" onClick={onReserve}>
            {cta}
            <ArrowRight />
          </Button>
        </div>
        <div className="grid gap-4">
          <AudienceCard
            title="Sit with us if"
            items={[
              "Your exam is inside eight weeks.",
              "Practice tests stall around 65–75%.",
              "You keep missing BEST / FIRST stems.",
              "You would rather not fund a retake.",
            ]}
          />
          <AudienceCard
            title="Skip it if"
            items={[
              "You want dumps or 'actual questions'.",
              "You want a 40-hour teaching bootcamp.",
              "You sit tomorrow and have not opened the book.",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function AudienceCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-muted">
            <Check className="mt-0.5 size-4 shrink-0 text-fg" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Agenda() {
  return (
    <section id="plan" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-kicker font-medium uppercase text-accent">Two hours, timed</p>
          <h2 className="font-display mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            {sessionWhen()}. Not a webinar that wanders.
          </h2>
          <p className="mt-4 text-muted">
            Cameras optional. Notes expected. Bring one practice item you keep
            missing. There is no recording.
          </p>
          <div className="relative mt-8 overflow-hidden rounded-xl">
            <img
              src="/images/session.jpg"
              alt="Security-architect desk: brass padlock, notebook, and an architecture diagram on a tablet."
              width={1792}
              height={1008}
              className="aspect-video w-full object-cover"
            />
          </div>
        </div>
        <ol className="lg:col-span-7">
          {agenda.map((row) => (
            <li
              key={row.t}
              className="grid grid-cols-12 gap-4 border-b border-border py-5 first:pt-0 last:border-b-0"
            >
              <span className="col-span-3 font-mono text-xs text-accent tabular-nums sm:col-span-2">
                {row.t}
              </span>
              <div className="col-span-9 sm:col-span-10">
                <h3 className="text-base font-medium">{row.title}</h3>
                <p className="mt-1 text-sm text-muted">{row.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Host() {
  return (
    <section id="host" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <p className="text-kicker font-medium uppercase text-accent">{HOST_NAME}</p>
      <h2 className="font-display mt-3 max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl">
        I teach the sitting I actually had — not the one I wish I’d had.
      </h2>
      <div className="mt-4 flex max-w-prose flex-col gap-4 text-muted">
        <p>
          Independent. Not ISC2. No unofficial item banks. I passed CISSP on
          the first attempt after my mocks stalled. I run the same room so you
          do not fund the retake I almost bought.
        </p>
        <p>
          Questions before you sit:{" "}
          <a
            href={`mailto:${HOST_EMAIL}`}
            className="text-fg underline-offset-4 hover:underline"
          >
            {HOST_EMAIL}
          </a>
          . If you want dumps, leave. If you want the thinking switch, the stem
          drill, and a 48-hour plan that fits a working week — sit with us.
        </p>
      </div>
      <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
        <li className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
          <Clock3 className="size-4 text-accent" />
          <p className="mt-3 font-medium">{sessionWhen()}</p>
          <p className="mt-1 text-muted">Two hours. Block it. Live only.</p>
        </li>
        <li className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
          <Shield className="size-4 text-accent" />
          <p className="mt-3 font-medium">Independent</p>
          <p className="mt-1 text-muted">Not affiliated with ISC2. No unofficial item banks.</p>
        </li>
        <li className="rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]">
          <Calendar className="size-4 text-accent" />
          <p className="mt-3 font-medium">Live only</p>
          <p className="mt-1 text-muted">No recording. Take notes. Miss it and this sitting is gone.</p>
        </li>
      </ul>
    </section>
  );
}

function Stories() {
  const { session } = useMoney();
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <p className="text-kicker font-medium uppercase text-accent">After the room</p>
        <h2 className="font-display mt-3 max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">
          People who almost talked themselves out of {session}.
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {stories.map((s) => (
            <figure
              key={s.name}
              className="flex flex-col justify-between gap-6 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
            >
              <blockquote className="font-display text-xl font-medium leading-snug tracking-tight">
                {s.quote}
              </blockquote>
              <figcaption className="text-sm">
                <p className="font-medium">{s.name}</p>
                <p className="text-muted">{s.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Price({
  onReserve,
  cta,
}: {
  onReserve: () => void;
  cta: string;
}) {
  const { session, exam } = useMoney();
  return (
    <section id="reserve" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid gap-10 rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)] sm:p-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-kicker font-medium uppercase text-accent">One price</p>
          <h2 className="font-display mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            {session}. Not {exam} twice.
          </h2>
          <p className="mt-4 max-w-prose text-muted">
            ₹199, $3.99, or €3.99 is the same seat. No early-bird, no coupon, no
            dearer chat price. {sessionWhen()}. Live only — no recording. I reply
            from {HOST_EMAIL} with how to pay. The join link follows payment.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {failPatterns.map((line) => (
              <li key={line} className="flex gap-3 text-sm">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                <span className="text-muted">{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="flex flex-col justify-between gap-6 rounded-xl bg-bg p-6 shadow-[var(--shadow-border)] lg:col-span-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-subtle">{sessionWhen()}</p>
            <p className="font-display mt-2 text-4xl font-medium tracking-tight">{session}</p>
            <p className="mt-2 text-sm text-muted">One seat. Against an exam of {exam}.</p>
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-subtle">Pay in</p>
              <CurrencySelect />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={onReserve} className="w-full">
              {cta}
              <ArrowRight />
            </Button>
            <p className="text-center text-xs text-muted">
              Pay after you reserve. Join link only once payment lands.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Faq() {
  const { session } = useMoney();
  const items = faqsFor(session);
  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-28">
        <div className="lg:col-span-4">
          <p className="text-kicker font-medium uppercase text-accent">Objections</p>
          <h2 className="font-display mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
            The reasons people hesitate. Answered.
          </h2>
        </div>
        <div className="lg:col-span-8">
          <Accordion type="single" collapsible>
            {items.map((item, i) => (
              <AccordionItem key={item.q} value={`q-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function Close({
  onReserve,
  cta,
}: {
  onReserve: () => void;
  cta: string;
}) {
  const { session } = useMoney();
  return (
    <section className="bg-paper text-paper-fg">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <p className="text-kicker font-medium uppercase text-paper-muted">
          {sessionWhen()} · {session}
        </p>
        <h2 className="font-display mt-4 text-3xl font-medium tracking-tight sm:text-5xl">
          Don’t be the engineer who knew the material and still sat it twice.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-paper-muted">
          {sessionWhen()}. {session}. The CAT will not give you a review screen. This room will.
        </p>
        <Button variant="paper" size="lg" className="mt-8" onClick={onReserve}>
          {cta}
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <Mark />
          <p className="mt-3 max-w-md">
            Independent CISSP first-attempt briefing by {HOST_NAME}. {sessionWhen()}.
            Live only — no recording. Not affiliated with, endorsed by, or
            sponsored by ISC2. CISSP is a registered mark of ISC2, Inc.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end">
            <Link to="/terms" className="text-fg transition-colors duration-150 hover:text-accent">
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-fg transition-colors duration-150 hover:text-accent"
            >
              Privacy
            </Link>
            <Link to="/present" className="text-fg transition-colors duration-150 hover:text-accent">
              Room
            </Link>
          </div>
          <a
            href={`mailto:${HOST_EMAIL}`}
            className="inline-flex items-center gap-2 text-fg transition-colors duration-150 hover:text-accent"
          >
            <Mail className="size-4" />
            {HOST_EMAIL}
          </a>
          <ShareLink />
          <p>© {new Date().getFullYear()} {HOST_NAME}</p>
        </div>
      </div>
    </footer>
  );
}

function ShareLink() {
  async function share() {
    const url = window.location.href;
    const payload = {
      title: `${HOST_NAME} — CISSP first-attempt webinar`,
      text: `${sessionWhen()}. Live, no recording. ${HOST_NAME}.`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(url);
      toast("Link copied.");
    } catch {
      /* cancelled */
    }
  }
  return (
    <button
      type="button"
      onClick={() => void share()}
      className="inline-flex items-center gap-2 text-fg transition-colors duration-150 hover:text-accent"
    >
      <Share2 className="size-4" />
      Share this page
    </button>
  );
}

function StickyBar({
  onReserve,
  enrolled,
}: {
  onReserve: () => void;
  enrolled: boolean;
}) {
  const { session } = useMoney();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 lg:hidden">
      <div className="flex items-center gap-3 px-4 py-3 pb-safe">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {enrolled ? "You’re in" : session}
          </p>
          <p className="truncate text-xs text-muted">{sessionWhenShort()}</p>
        </div>
        <Button size="sm" onClick={onReserve} className="shrink-0">
          {enrolled ? "View" : "Reserve"}
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
