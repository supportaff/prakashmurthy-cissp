import { Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CurrencySelect, useMoney } from "@/components/landing/currency";
import { HOST_EMAIL, HOST_NAME } from "@/lib/brand";
import {
  enrollMailto,
  examWindows,
  readEnrollment,
  writeEnrollment,
  type Enrollment,
  type ExamWindow,
} from "@/lib/session";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaid: (enrollment: Enrollment) => void;
};

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function EnrollDialog({ open, onOpenChange, onPaid }: Props) {
  const { session, currency } = useMoney();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [windowId, setWindowId] = useState<ExamWindow>("8w");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Enrollment | null>(null);

  useEffect(() => {
    if (!open) return;
    const existing = readEnrollment();
    if (existing?.paid) {
      setDone(existing);
      onPaid(existing);
    }
  }, [open]);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    const mail = email.trim().toLowerCase();
    if (trimmed.length < 2) {
      setError("Put the name you want on the reply.");
      return;
    }
    if (!isEmail(mail)) {
      setError("That email does not look usable for the join link.");
      return;
    }
    const enrollment: Enrollment = {
      name: trimmed,
      email: mail,
      window: windowId,
      currency,
      price: session,
      paid: true,
      at: new Date().toISOString(),
    };
    writeEnrollment(enrollment);
    setDone(enrollment);
    onPaid(enrollment);
    window.location.href = enrollMailto(enrollment);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {done ? (
          <Success enrollment={done} />
        ) : (
          <>
            <DialogHeader>
              <p className="text-kicker font-medium uppercase text-accent">Reserve a seat</p>
              <DialogTitle>Two live hours · {session}</DialogTitle>
              <DialogDescription>
                Pick ₹, $, or €. This opens an email to {HOST_EMAIL}. I reply
                with how to pay and the join link. Live only, no recording.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-subtle">Pay in</p>
              <CurrencySelect />
            </div>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <Field label="Full name" htmlFor="fs-name">
                <Input
                  id="fs-name"
                  autoComplete="name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  placeholder="Priya Sharma"
                />
              </Field>
              <Field label="Email for the join link" htmlFor="fs-email">
                <Input
                  id="fs-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="you@company.com"
                />
              </Field>
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium">When do you sit CISSP?</legend>
                <p className="text-xs text-muted">
                  I pitch the 2 hours at the window you actually have.
                </p>
                <div className="grid gap-2">
                  {examWindows.map((w) => {
                    const active = windowId === w.id;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setWindowId(w.id)}
                        className={cn(
                          "flex h-12 items-center justify-between rounded-md px-3 text-left text-sm transition-[box-shadow,background-color] duration-150 ease-out",
                          active
                            ? "bg-elevated shadow-[var(--shadow-border-hover)]"
                            : "bg-transparent shadow-[var(--shadow-border)] hover:bg-elevated",
                        )}
                      >
                        <span>{w.label}</span>
                        <span className="text-xs text-muted">{w.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <Button type="submit" size="lg" className="w-full">
                Email my seat · {session}
              </Button>
              <p className="text-center text-xs text-muted">
                By reserving you agree to the{" "}
                <Link to="/terms" className="text-fg underline underline-offset-4">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-fg underline underline-offset-4">
                  Privacy policy
                </Link>
                . Live only — no recording.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function Success({ enrollment }: { enrollment: Enrollment }) {
  return (
    <>
      <DialogHeader>
        <span className="flex size-10 items-center justify-center rounded-md bg-elevated shadow-[var(--shadow-border)]">
          <Check className="size-4" />
        </span>
        <DialogTitle>You’re in, {enrollment.name.split(" ")[0]}.</DialogTitle>
        <DialogDescription>
          Seat request goes to {HOST_EMAIL}. Finish the email that opened, then
          watch {enrollment.email}.
        </DialogDescription>
      </DialogHeader>
      <ol className="flex flex-col gap-3 text-sm">
        <li className="flex gap-3">
          <span className="w-4 shrink-0 font-mono text-xs text-muted">1</span>
          Watch {enrollment.email} for the join link.
        </li>
        <li className="flex gap-3">
          <span className="w-4 shrink-0 font-mono text-xs text-muted">2</span>
          Live only — no recording. Take notes.
        </li>
        <li className="flex gap-3">
          <span className="w-4 shrink-0 font-mono text-xs text-muted">3</span>
          Bring one practice question you keep missing. We use those in the stem drill.
        </li>
      </ol>
      <Button type="button" variant="outline" size="lg" className="w-full" asChild>
        <a href={enrollMailto(enrollment)}>
          Email {HOST_NAME}
          <Mail />
        </a>
      </Button>
    </>
  );
}
