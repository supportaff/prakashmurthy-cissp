import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal/layout";
import { HOST_EMAIL, HOST_NAME, SITE_HOST, SITE_URL } from "@/lib/brand";
import { SESSION_WHEN } from "@/lib/session";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: `Terms — ${HOST_NAME}` },
      {
        name: "description",
        content: `Terms for the live CISSP first-attempt webinar on ${SITE_HOST}.`,
      },
    ],
  }),
});

function TermsPage() {
  return (
    <LegalLayout title="Terms of service">
      <section>
        <h2>Who this is</h2>
        <p>
          These terms cover the live two-hour CISSP first-attempt webinar sold
          on {SITE_URL}. The operator is {HOST_NAME}. Contact:{" "}
          <a href={`mailto:${HOST_EMAIL}`}>{HOST_EMAIL}</a>.
        </p>
        <p className="mt-3">
          This is an independent briefing. It is not affiliated with, endorsed
          by, or sponsored by ISC2. CISSP is a registered mark of ISC2, Inc.
        </p>
      </section>

      <section>
        <h2>The session</h2>
        <p>
          One live sitting, {SESSION_WHEN}. You receive how to pay by email
          after you reserve. The join link follows payment. The session is live
          only. There is no recording and no replay.
        </p>
        <p className="mt-3">
          The briefing covers how {HOST_NAME} passed CISSP on a first attempt:
          mindset, CAT pacing, stem-word drills, and a 48-hour plan. It is not a
          CBK course, not an official ISC2 product, and not a dump of exam
          items.
        </p>
      </section>

      <section>
        <h2>Price and payment</h2>
        <p>
          The seat is ₹199, $3.99, or €3.99 depending on the currency you
          choose. You request the seat by email. {HOST_NAME} replies from{" "}
          {HOST_EMAIL} with how to pay and the join link. A paid seat is a
          licence to attend that live sitting, not a course subscription.
        </p>
      </section>

      <section>
        <h2>What you must not expect</h2>
        <ul className="list-disc pl-5">
          <li>A guaranteed pass. The exam is yours. This is a method briefing.</li>
          <li>A recording if you miss the sitting.</li>
          <li>Official ISC2 materials, dumps, or “real questions”.</li>
          <li>An upsell on the call. This product is the two hours.</li>
        </ul>
      </section>

      <section>
        <h2>Eligibility</h2>
        <p>
          You must be 18 or older. You do not need five years of experience to
          sit this briefing. You still need ISC2’s own experience (or Associate)
          rules to hold the CISSP credential.
        </p>
      </section>

      <section>
        <h2>Conduct and content</h2>
        <p>
          Notes you take are yours. You may not record the session, share the
          join link, or republish the drills as a paid product. {HOST_NAME} may
          remove anyone who asks for dumps or disrupts the room, without a
          second seat.
        </p>
      </section>

      <section>
        <h2>If something fails</h2>
        <p>
          If the host cannot run the sitting (illness, platform outage), you
          will be offered another live sitting or the fee back, at the host’s
          choice. If you do not attend a sitting that ran as advertised, the
          seat is used. Exam outcomes, employer decisions, and ISC2 results are
          outside this agreement.
        </p>
      </section>

      <section>
        <h2>Law</h2>
        <p>
          These terms are governed by the laws of India. Courts in India have
          jurisdiction, unless a mandatory consumer rule in your country says
          otherwise.
        </p>
        <p className="mt-3">
          Privacy is in the{" "}
          <Link to="/privacy">privacy policy</Link>. Paying means you have read
          both.
        </p>
      </section>
    </LegalLayout>
  );
}
