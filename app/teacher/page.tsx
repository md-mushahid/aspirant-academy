import type { Metadata } from "next";
import { Brand, SITE } from "../_components/site";

export const metadata: Metadata = {
  title: "Teacher Mode · Aspirant Academy",
};

export default function TeacherPage() {
  return (
    <div className="authwrap">
      <div className="authcard">
        <Brand href="/#top" />
        <h1>Teacher Mode</h1>
        <p className="authsub">
          A workspace for IELTS teachers — grade Writing &amp; Speaking
          submissions, return band scores against every criterion, and give
          written feedback from one queue.
        </p>
        <a href={SITE.routes.signup} className="btn btn--primary">Request teacher access</a>
        <p className="authnote">
          Coming soon — the teacher grading queue is a later build slice.
        </p>
        <p className="backhome"><a href="/#top">← Back to home</a></p>
      </div>
    </div>
  );
}
