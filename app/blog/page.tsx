import type { Metadata } from "next";
import { Brand, SITE } from "../_components/site";

export const metadata: Metadata = {
  title: "Blog · Aspirant Academy",
};

export default function BlogPage() {
  return (
    <div className="authwrap">
      <div className="authcard">
        <Brand href="/#top" />
        <h1>The Aspirant Academy Blog</h1>
        <p className="authsub">
          Study guides, band-score breakdowns, and strategy tips for Reading,
          Writing, Listening and Speaking — Academic and General Training.
        </p>
        <a href={SITE.routes.signup} className="btn btn--primary">Get notified of new posts</a>
        <p className="authnote">
          Coming soon — articles are on the way.
        </p>
        <p className="backhome"><a href="/#top">← Back to home</a></p>
      </div>
    </div>
  );
}
