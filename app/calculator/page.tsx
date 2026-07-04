"use client";

import { useState } from "react";
import { Brand, SITE } from "../_components/site";

type Skill = "Listening" | "Reading" | "Writing" | "Speaking";
const SKILLS: Skill[] = ["Listening", "Reading", "Writing", "Speaking"];

// Official IELTS overall band = average of four, rounded to the nearest half band
// (an average ending in .25 rounds up to .5; .75 rounds up to the next whole).
function overallBand(scores: number[]): number {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(avg * 2) / 2;
}

function clamp(n: number) {
  return Math.max(0, Math.min(9, Math.round(n * 2) / 2));
}

export default function CalculatorPage() {
  const [scores, setScores] = useState<Record<Skill, number>>({
    Listening: 6.5,
    Reading: 6.5,
    Writing: 6,
    Speaking: 6.5,
  });

  const set = (skill: Skill, delta: number) =>
    setScores((s) => ({ ...s, [skill]: clamp(s[skill] + delta) }));

  const overall = overallBand(SKILLS.map((s) => scores[s]));

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
          <h1>IELTS Band Score Calculator</h1>
          <p>Enter your four section scores to see your overall band — calculated with the official rounding rule.</p>
        </div>

        <div className="toolcard">
          {SKILLS.map((skill) => (
            <div className="calc__row" key={skill}>
              <label>
                {skill}
                <small>Band 0–9, in half steps</small>
              </label>
              <div className="stepper">
                <button type="button" aria-label={`Decrease ${skill}`} onClick={() => set(skill, -0.5)}>−</button>
                <b>{scores[skill].toFixed(1)}</b>
                <button type="button" aria-label={`Increase ${skill}`} onClick={() => set(skill, 0.5)}>+</button>
              </div>
            </div>
          ))}

          <div className="calc__out">
            <span>Your overall band score</span>
            <b className="big">{overall.toFixed(1)}</b>
            <span>Average {(SKILLS.reduce((a, s) => a + scores[s], 0) / 4).toFixed(2)} → rounded to nearest half band</span>
          </div>

          <div className="toolbtns" style={{ justifyContent: "center" }}>
            <a href={SITE.routes.signup} className="btn btn--primary">Practise to raise this band</a>
            <a href={SITE.routes.practice} className="btn btn--ghost">Try a free mock test</a>
          </div>
        </div>

        <p className="result__sub" style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
          Estimate only. Official band scores come from IELTS.
        </p>
      </div>
    </div>
  );
}
