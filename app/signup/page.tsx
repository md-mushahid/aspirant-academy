import type { Metadata } from "next";
import { Brand, SITE } from "../_components/site";

export const metadata: Metadata = {
  title: "Create your account · Aspirant Academy",
};

// In Next 15, searchParams is async.
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const isPremium = plan === "premium";

  return (
    <div className="authwrap">
      <div className="authcard">
        <Brand href="/#top" />
        <h1>{isPremium ? "Start with Premium" : "Create your free account"}</h1>
        <p className="authsub">
          {isPremium
            ? "Full course library, unlimited tests, and teacher grading."
            : "Preview lessons free and take your first practice test."}
        </p>

        {isPremium && (
          <div className="planpill--wrap">
            <span className="planpill">★ Premium Annual · ৳6,000/yr (৳500/mo)</span>
          </div>
        )}

        {/* Marketing skeleton: no auth backend wired yet. */}
        <form>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" placeholder="Your name" autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create a password" autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn--primary">
            {isPremium ? "Continue to secure checkout" : "Create free account"}
          </button>
        </form>

        <div className="divider">or</div>
        <button type="button" className="btn oauth">
          <span aria-hidden="true">🇬</span> Sign up with Google
        </button>

        <p className="authfoot">
          Already have an account? <a href={SITE.routes.login}>Log in</a>
        </p>

        <p className="authnote">
          Demo page — accounts and payments are a later build slice, so this form isn’t wired to a backend yet.
        </p>
        <p className="backhome"><a href="/#top">← Back to home</a></p>
      </div>
    </div>
  );
}
