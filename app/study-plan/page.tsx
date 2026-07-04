"use client";

import { useState } from "react";
import { Brand, SITE } from "../_components/site";

type Skill = "Listening" | "Reading" | "Writing" | "Speaking";
const SKILLS: Skill[] = ["Listening", "Reading", "Writing", "Speaking"];

export default function StudyPlanPage() {
  const [target, setTarget] = useState(7);
  const [current, setCurrent] = useState(6);
  const [weak, setWeak] = useState<Skill>("Writing");
  const [weeks, setWeeks] = useState(8);
  const [hours, setHours] = useState(8);
  const [done, setDone] = useState(false);

  // Allocation: focus skill gets the largest share, one weekly mock, rest split.
  const weakH = Math.max(1, Math.round(hours * 0.45));
  const mockH = Math.max(1, Math.round(hours * 0.2));
  const others = SKILLS.filter((s) => s !== weak);
  const otherH = Math.max(0, hours - weakH - mockH);
  const perOther = Math.round(otherH / others.length);
  const gap = Math.max(0, target - current);

  const alloc: { label: string; h: number }[] = [
    { label: weak, h: weakH },
    ...others.map((s) => ({ label: s, h: perOther })),
    { label: "Mock tests", h: mockH },
  ];
  const maxH = Math.max(...alloc.map((a) => a.h), 1);

  const phase1 = Math.max(1, Math.round(weeks * 0.2));
  const phase3 = Math.max(1, Math.round(weeks * 0.25));
  const phase2 = Math.max(1, weeks - phase1 - phase3);

  return (
    <div>
      <header className="toolnav">
        <div className="container toolnav__inner">
          <Brand href="/#top" />
          <a href="/#top" className="back">← Back to home</a>
        </div>
      </header>

      <div className="toolwrap">
        <div className="toolhead">
          <span className="eyebrow">Free tool</span>
          <h1>Build my IELTS study plan</h1>
          <p>Answer five quick questions and get a personalised weekly plan focused on the skill that will move your band the most.</p>
        </div>

        <div className="toolcard">
          <div className="calc__row">
            <label>Target band<small>The score you need</small></label>
            <select className="select" value={target} onChange={(e) => setTarget(+e.target.value)}>
              {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => <option key={b} value={b}>{b.toFixed(1)}</option>)}
            </select>
          </div>
          <div className="calc__row">
            <label>Current band<small>Roughly where you are now</small></label>
            <select className="select" value={current} onChange={(e) => setCurrent(+e.target.value)}>
              {[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8].map((b) => <option key={b} value={b}>{b.toFixed(1)}</option>)}
            </select>
          </div>
          <div className="calc__row">
            <label>Weakest skill<small>Where you lose the most marks</small></label>
            <select className="select" value={weak} onChange={(e) => setWeak(e.target.value as Skill)}>
              {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="calc__row">
            <label>Weeks until exam</label>
            <select className="select" value={weeks} onChange={(e) => setWeeks(+e.target.value)}>
              {[2, 4, 6, 8, 12, 16].map((w) => <option key={w} value={w}>{w} weeks</option>)}
            </select>
          </div>
          <div className="calc__row">
            <label>Study hours / week</label>
            <select className="select" value={hours} onChange={(e) => setHours(+e.target.value)}>
              {[4, 6, 8, 10, 14, 20].map((h) => <option key={h} value={h}>{h} hours</option>)}
            </select>
          </div>

          {!done && (
            <div className="toolbtns">
              <button type="button" className="btn btn--primary btn--lg" onClick={() => setDone(true)}>Generate my plan</button>
            </div>
          )}
        </div>

        {done && (
          <div className="toolcard" style={{ marginTop: 24 }}>
            <div className="plan__head">
              <span>Your plan</span>
              <b>Reach Band {target.toFixed(1)} in {weeks} weeks</b>
              <span>{gap > 0 ? `A ${gap.toFixed(1)}-band climb — focused on ${weak}.` : `Maintain and sharpen — polish ${weak}.`}</span>
            </div>

            <div className="plan__section">
              <h3>Your weekly {hours} hours</h3>
              <div className="alloc">
                {alloc.map((a) => (
                  <div className="alloc__row" key={a.label}>
                    <b>{a.label}</b>
                    <div className="alloc__bar"><i style={{ width: `${(a.h / maxH) * 100}%` }} /></div>
                    <span>{a.h} hr{a.h === 1 ? "" : "s"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="plan__section">
              <h3>Three phases</h3>
              <ul className="plan__list">
                <li><strong>Weeks 1–{phase1}: Diagnose.</strong> Sit one full mock, then categorise every lost mark by question type — especially in {weak}.</li>
                <li><strong>Weeks {phase1 + 1}–{phase1 + phase2}: Drill.</strong> Spend ~45% of your time on {weak} with targeted, timed practice; keep the other skills warm.</li>
                <li><strong>Final {phase3} week{phase3 === 1 ? "" : "s"}: Rehearse.</strong> Two full timed mocks per week under exam conditions; confirm you hit Band {target.toFixed(1)} twice in a row.</li>
              </ul>
            </div>

            <div className="plan__section">
              <h3>Every week</h3>
              <ul className="plan__list">
                <li>One full-length or section mock, marked the same day.</li>
                <li>Review errors before new practice — fix causes, not symptoms.</li>
                {(weak === "Writing" || weak === "Speaking")
                  ? <li>Submit {weak} for teacher feedback and act on one criterion at a time.</li>
                  : <li>Re-attempt every wrong {weak} question until the trap is obvious.</li>}
              </ul>
            </div>

            <div className="toolbtns" style={{ justifyContent: "center" }}>
              <a href={SITE.routes.signup} className="btn btn--primary">Start this plan free</a>
              <a href={SITE.routes.practice} className="btn btn--ghost">Take a mock now</a>
              <button type="button" className="btn btn--ghost" onClick={() => setDone(false)}>Adjust answers</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
