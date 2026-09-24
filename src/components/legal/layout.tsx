import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { HOST_EMAIL, HOST_NAME, SITE_HOST } from "@/lib/brand";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-bg text-fg min-h-dvh">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-sm bg-fg font-display text-lg font-medium italic text-bg">
              P
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-medium tracking-wide">{HOST_NAME}</span>
              <span className="mt-0.5 text-xs text-muted">{SITE_HOST}</span>
            </span>
          </Link>
          <Link to="/" className="text-sm text-muted transition-colors hover:text-fg">
            Back to the webinar
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-kicker font-medium uppercase text-accent">Legal</p>
        <h1 className="font-display mt-3 text-4xl font-medium tracking-tight">{title}</h1>
        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-fg [&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4 [&_li]:mt-2">
          {children}
        </div>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-2xl flex-wrap gap-4 px-4 py-8 text-sm text-muted sm:px-6">
          <Link to="/terms" className="hover:text-fg">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-fg">
            Privacy
          </Link>
          <a href={`mailto:${HOST_EMAIL}`} className="hover:text-fg">
            {HOST_EMAIL}
          </a>
        </div>
      </footer>
    </div>
  );
}
