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
        content: `How ${HOST_NAME} handles the registration form for the CISSP webinar on ${SITE_HOST}.`,
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy policy">
      <section>
        <h2>What this covers</h2>
        <p>
          {HOST_NAME} collects only what is needed to hold your seat on the live
          CISSP webinar and to send the join link. Contact:{" "}
          <a href={`mailto:${HOST_EMAIL}`}>{HOST_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul className="list-disc pl-5">
          <li>Name, email, phone, and the other answers you submit on the registration form.</li>
          <li>Whether your exam is already scheduled, if you say so.</li>
        </ul>
        <p className="mt-3">
          We do not ask for Aadhaar, passport, CISSP candidate ID, or exam
          scores.
        </p>
      </section>

      <section>
        <h2>Why</h2>
        <p>
          To reply from {HOST_EMAIL} with the join link. We do not sell lists,
          run ads on this data, or train models on it.
        </p>
      </section>

      <section>
        <h2>Who else sees it</h2>
        <ul className="list-disc pl-5">
          <li>
            Google Forms, which stores the registration you submit.
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
          Registration answers are kept until the sitting is over, then deleted
          on request unless the law requires a longer hold.
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
          Material changes will be dated on this page. Sending the form after a
          change means you accept the new text. Session terms are in the{" "}
          <Link to="/terms">terms of service</Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
