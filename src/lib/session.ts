import { HOST_EMAIL, HOST_NAME, mailtoHost } from "@/lib/brand";
import type { Currency } from "@/lib/currency";

export const ENROLL_KEY = "prakash:enroll";

/** One sitting. Shown so people can block it. Not a countdown. */
export const SESSION_WHEN = "Sunday 4 October, 11:00–13:00 IST";

export type Enrollment = {
  name: string;
  email: string;
  window: ExamWindow;
  currency: Currency;
  price: string;
  paid?: boolean;
  at: string;
};

export type ExamWindow = "2w" | "8w" | "later";

export const examWindows: { id: ExamWindow; label: string; hint: string }[] = [
  { id: "2w", label: "Within 2 weeks", hint: "Pacing and stems first" },
  { id: "8w", label: "Within 8 weeks", hint: "The usual window" },
  { id: "later", label: "Still dating the OSG", hint: "Come anyway" },
];

export function enrollMailto(enrollment: Enrollment): string {
  const windowLabel = examWindows.find((w) => w.id === enrollment.window)?.label ?? enrollment.window;
  return mailtoHost(
    `CISSP seat — ${enrollment.name} — ${enrollment.price}`,
    [
      `New seat for ${SESSION_WHEN}.`,
      ``,
      `Name: ${enrollment.name}`,
      `Email: ${enrollment.email}`,
      `Seat requested: ${enrollment.price} (${enrollment.currency})`,
      `Exam window: ${windowLabel}`,
      ``,
      `Please send the join link to ${enrollment.email}.`,
    ].join("\n"),
  );
}

export function readEnrollment(): Enrollment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ENROLL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Enrollment;
    if (!parsed?.name || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeEnrollment(enrollment: Enrollment): void {
  localStorage.setItem(ENROLL_KEY, JSON.stringify(enrollment));
}

export const domains = [
  { n: "01", name: "Security and Risk Management", weight: 16, trap: "You pick the technical control. The exam wants the governance move." },
  { n: "02", name: "Asset Security", weight: 10, trap: "Classification and ownership beat encryption-as-a-reflex." },
  { n: "03", name: "Security Architecture and Engineering", weight: 13, trap: "Models and principles, not product features." },
  { n: "04", name: "Communication and Network Security", weight: 13, trap: "Design the network, don't configure the router." },
  { n: "05", name: "Identity and Access Management", weight: 13, trap: "Lifecycle and least privilege over the shiny protocol." },
  { n: "06", name: "Security Assessment and Testing", weight: 12, trap: "Evidence and scope, not 'run the scanner'." },
  { n: "07", name: "Security Operations", weight: 13, trap: "Incident order of operations — contain, then hunt." },
  { n: "08", name: "Software Development Security", weight: 10, trap: "Secure SDLC and the role you are being asked to play." },
] as const;

export const agenda = [
  { t: "01", title: "How I almost failed before I sat", body: "The practice-score trap I was in, and why CAT ends people who 'know the book'." },
  { t: "02", title: "The manager test", body: "A short drill. Same fact pattern, four stems. You'll feel the gap between engineer-brain and CISSP-brain." },
  { t: "03", title: "Stem words that rewrite the answer", body: "BEST, MOST, FIRST, NOT, LEAST — and the ethics tie-break when two answers both 'work'." },
  { t: "04", title: "Domain trap map", body: "Where first-timers bleed. Weighted to the 16% and 13% domains, not a tour of all eight." },
  { t: "05", title: "The 48-hour plan + your missed item", body: "What to stop studying. Sleep. Exam-day protocol. We run one question you keep missing." },
] as const;

export const outcomes = [
  {
    title: "The thinking switch that got me through",
    body: "How I stopped answering as the engineer who configures the control, and started answering as the person who owns the risk.",
  },
  {
    title: "CAT rules that fail prepared people",
    body: "No skip. No flag. No review screen. You leave with a per-item pace that does not panic at question 100.",
  },
  {
    title: "Stem-word drill, live",
    body: "BEST, MOST, FIRST, NOT, LEAST. Same fact pattern, different correct answer. We drill until it is automatic.",
  },
  {
    title: "Domain trap map",
    body: "Where first-timers bleed, weighted to Security & Risk (16%) and the 13% domains — not a tour of topics you already know.",
  },
  {
    title: "A 48-hour exam plan you can follow",
    body: "What to stop studying, what to sleep on, exam-day protocol, and the ethics tie-break I actually used.",
  },
  {
    title: "Your missed question, in the room",
    body: "Bring one practice item you keep getting wrong. We run it live. Take notes — there is no recording.",
  },
] as const;

export const walkOutWith = [
  "The CAT pacing card — seconds per item, and why a 'hard' exam is often a good sign",
  "The manager-vs-engineer drill: same fact, four stems, one correct answer",
  "A stem-word decoder for BEST / FIRST / MOST / NOT / LEAST plus the ethics tie-break",
  "Domain trap map weighted to 16% and 13% — where first-timers actually bleed",
  "The 48-hour cut list: what I stopped studying, what I slept on",
  "One of your missed questions torn down live",
  "Your own notes. Live only — no recording of this session",
] as const;

export const attemptBeats = [
  {
    k: "01",
    title: "I was failing my own mocks as an engineer",
    body: "Six weeks out I sat at 68–74%. I knew the crypto. I knew the ports. I was still picking the option that would impress a senior engineer. CISSP does not hire that person.",
  },
  {
    k: "02",
    title: "Three habits flipped the sitting",
    body: "I trained like CAT — commit, no flag, no coming back. I circled the stem word before I touched the options. I spent the last 48 hours on ethics, Domain 1, and sleep — not a new chapter.",
  },
  {
    k: "03",
    title: "Exam day I answered as the risk owner",
    body: "I walked in once. I answered as the person who would still have a job if the control failed. The CAT stopped me. I passed. That sitting — not a CBK tour — is this webinar.",
  },
] as const;

export const tipsPreview = [
  {
    k: "01",
    title: "Answer as the risk owner",
    body: "If the option needs a CLI, a CVE, or a brand-name tool, it is usually the distractor. CISSP promotes the person who chooses the business-correct control — not the cleverest one.",
  },
  {
    k: "02",
    title: "The stem is the exam",
    body: "BEST, FIRST, MOST, and NOT are not flavour. They change the correct answer on the same fact pattern. We drill this until it is automatic.",
  },
  {
    k: "03",
    title: "You cannot go back",
    body: "English CISSP is CAT. No skip, no flag, no review screen. People who trained on linear practice tests walk in with a muscle that does not exist in the room.",
  },
] as const;

export function faqsFor(price: string) {
  return [
    {
      q: `${price} is suspiciously cheap. Is this a pitch for a long paid course?`,
      a: `No. ${SESSION_WHEN}. One price, one room. No slide-deck upsell. If I ever run a longer cohort, it is a separate product with a separate page.`,
    },
    {
      q: "How do I pay, and how do I join?",
      a: `Send a seat request at the price you picked (₹199, $3.99, or €3.99). I reply from ${HOST_EMAIL} with how to pay. The join link goes out after payment, for ${SESSION_WHEN}.`,
    },
    {
      q: "Is this affiliated with ISC2?",
      a: `No. ${HOST_NAME} is independent. I teach how candidates actually pass the current CAT. I do not represent ISC2, and I do not use unofficial item banks.`,
    },
    {
      q: "Will you share dumps or 'real questions'?",
      a: "No. That is cheating, it gets people banned, and it is a stupid way to fail a rotating item bank. We teach stems, mindset, pacing, and domain traps.",
    },
    {
      q: "I haven't finished the OSG. Should I still come?",
      a: "Yes if your exam is inside eight weeks. This briefing does not teach the CBK from zero. It stops you from studying like an engineer into a manager's exam.",
    },
    {
      q: "I already have an exam booked. Too late?",
      a: "If your exam is already behind you, this room will not help that sitting. If it is still ahead, come. Do not cram a new domain the night before.",
    },
    {
      q: "Do I get a recording?",
      a: `No. ${SESSION_WHEN} is live only. Take notes. Miss it and there is no replay.`,
    },
    {
      q: "Where are the terms and privacy policy?",
      a: "Footer of this site — Terms and Privacy. Reserving a seat means you agree to both.",
    },
    {
      q: "What about the 5-year experience rule?",
      a: "You still need it to become CISSP (or you take the Associate path). You do not need it to sit this briefing. Plenty of Associates use it to pass the exam first.",
    },
  ];
}

export const stories = [
  {
    quote:
      "I was answering as a network engineer. The manager drill was uncomfortable and then obvious. Passed at 100 questions the week after.",
    name: "Rohan K.",
    role: "Cloud security · Pune",
  },
  {
    quote:
      "I treated CAT like CEH — flag and return. That habit does not exist in this exam. The pacing section alone was the seat.",
    name: "Meera S.",
    role: "GRC analyst · Hyderabad",
  },
  {
    quote:
      "I almost skipped it because the price felt unserious. That was the whole problem. Highest-return two hours of my prep.",
    name: "Arjun M.",
    role: "AppSec · Bengaluru",
  },
] as const;

export const failPatterns = [
  "Picking the technical fix when the stem asked for a governance decision.",
  "Training on linear mocks, then freezing when CAT refused to go back.",
  "Over-studying cryptography comfort topics while Domain 1 sits at 16%.",
  "Treating ethics as a poster instead of a tie-break.",
  "Sitting at a 68% practice average and hoping the real exam is kinder.",
] as const;
