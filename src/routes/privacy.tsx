import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/layout";
import { HOST_EMAIL, HOST_NAME, SITE_HOST } from "@/lib/brand";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: `Privacy — ${HOST_NAME}` },
      {
        name: "description",
        content: `How ${HOST_NAME} handles name, email, and payment data for the CISSP webinar on ${SITE_HOST}.`,
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy policy" updated="22 September 2026">
      <section>
        <h2>What this covers</h2>
        <p>
          {HOST_NAME} collects only what is needed to sell you a seat on the 4
          October CISSP webinar and to send the join link. Contact:{" "}
          <a href={`mailto:${HOST_EMAIL}`}>{HOST_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul className="list-disc pl-5">
          <li>Name and email you type on this site.</li>
          <li>Exam window you select (how soon you sit).</li>
          <li>Currency you choose (₹, $, or €).</li>
          <li>
            A local “you’re in” flag in your browser (localStorage). Not a
            tracking cookie.
          </li>
        </ul>
        <p className="mt-3">
          We do not ask for Aadhaar, passport, CISSP candidate ID, or exam
          scores.
        </p>
      </section>

      <section>
        <h2>Why</h2>
        <p>
          To hold your seat request and reply from {HOST_EMAIL} with how to
          pay and the join link. We do not sell lists, run ads on this data, or
          train models on it.
        </p>
      </section>

      <section>
        <h2>Who else sees it</h2>
        <ul className="list-disc pl-5">
          <li>
            Your mail app, when you send the seat request to {HOST_EMAIL}.
          </li>
          <li>
            Vercel — hosts this site. Request logs may include IP and user
            agent.
          </li>
        </ul>
        <p className="mt-3">
          Join links go to the email you give. Do not use a shared inbox you
          do not control.
        </p>
      </section>

      <section>
        <h2>How long</h2>
        <p>
          Enrolment and payment records are kept as long as needed for tax and
          to prove you bought a seat, then deleted on request unless the law
          requires a longer hold. Browser localStorage stays until you clear
          it.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Email {HOST_EMAIL} to see, correct, or delete the name and email we
          hold for you. If you are in the EU/UK you can also object or ask for
          a copy.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>This webinar is for adults. Do not enrol anyone under 18.</p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          Material changes will be dated on this page. Paying after a change
          means you accept the new text. Session terms are in the{" "}
          <Link to="/terms">terms of service</Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
