import type { Metadata } from "next";
import { Brand, SITE } from "../_components/site";

export const metadata: Metadata = {
  title: "Log in · Aspirant Academy",
};

export default function LoginPage() {
  return (
    <div className="authwrap">
      <div className="authcard">
        <Brand href="/#top" />
        <h1>Welcome back</h1>
        <p className="authsub">Log in to continue your IELTS prep.</p>

        {/* Marketing skeleton: no auth backend wired yet. */}
        <form>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn--primary">Log in</button>
        </form>

        <div className="divider">or</div>
        <button type="button" className="btn oauth">
          <span aria-hidden="true">🇬</span> Continue with Google
        </button>

        <p className="authfoot">
          New to Aspirant Academy? <a href={SITE.routes.signup}>Create an account</a>
        </p>

        <p className="authnote">
          Demo page — authentication is a later build slice, so the form isn’t wired to a backend yet.
        </p>
        <p className="backhome"><a href="/#top">← Back to home</a></p>
      </div>
    </div>
  );
}
