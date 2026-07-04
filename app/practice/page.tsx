"use client";

import { useState } from "react";
import { Brand, SITE } from "../_components/site";

type Q =
  | { id: number; type: "choice"; text: string; options: string[]; answer: string }
  | { id: number; type: "gap"; text: string; answer: string; accept?: string[] };

const PASSAGE = `Urban green spaces — parks, community gardens and tree-lined streets — do more than beautify a city. Research consistently links access to nature with lower stress, better concentration and improved physical health. In dense cities, even small pockets of greenery measurably cool the surrounding air, reducing the "urban heat island" effect on hot days. Planners increasingly treat green space not as decoration but as essential infrastructure, on a par with roads and drainage. Yet access is uneven: wealthier neighbourhoods typically enjoy far more green space per resident than poorer ones, a gap that many cities are now under pressure to close.`;

const QUESTIONS: Q[] = [
  { id: 1, type: "choice", text: "According to the passage, urban green spaces mainly serve to…", options: ["decorate the city only", "provide health and environmental benefits", "replace roads and drainage", "increase property prices"], answer: "provide health and environmental benefits" },
  { id: 2, type: "choice", text: "True, False or Not Given: Green spaces can lower the temperature of nearby air.", options: ["True", "False", "Not Given"], answer: "True" },
  { id: 3, type: "choice", text: "True, False or Not Given: All city neighbourhoods have equal access to green space.", options: ["True", "False", "Not Given"], answer: "False" },
  { id: 4, type: "choice", text: "True, False or Not Given: Community gardens are the most popular type of green space.", options: ["True", "False", "Not Given"], answer: "Not Given" },
  { id: 5, type: "gap", text: "Complete the sentence: Planners now treat green space as essential ______, like roads and drainage.", answer: "infrastructure" },
  { id: 6, type: "gap", text: "Complete the sentence: Access to nature is linked with lower ______, better concentration and improved health.", answer: "stress" },
  { id: 7, type: "choice", text: "The ‘urban heat island’ effect refers to cities being…", options: ["cooler than rural areas", "warmer than surrounding areas", "surrounded by water", "short of green space"], answer: "warmer than surrounding areas" },
  { id: 8, type: "gap", text: "Complete the sentence: ______ neighbourhoods typically enjoy more green space per resident.", answer: "wealthier", accept: ["richer"] },
];

// Academic Reading raw (0–40) → band (approximate public conversion).
function rawToBand(raw: number): number {
  const table: [number, number][] = [
    [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5],
    [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3],
  ];
  for (const [min, band] of table) if (raw >= min) return band;
  return 2.5;
}

function norm(s: string) {
  return s.trim().toLowerCase();
}

export default function PracticePage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = (q: Q) => {
    const a = norm(answers[q.id] || "");
    if (!a) return false;
    if (q.type === "gap") return a === norm(q.answer) || (q.accept || []).some((x) => norm(x) === a);
    return a === norm(q.answer);
  };

  const correct = QUESTIONS.filter(isCorrect).length;
  const projectedRaw = Math.round((correct / QUESTIONS.length) * 40);
  const band = rawToBand(projectedRaw);

  const reset = () => { setAnswers({}); setSubmitted(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

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
          <span className="eyebrow">Free mock test</span>
          <h1>Reading — sample set</h1>
          <p>Answer the questions below, then submit to get instant marking and a projected band. No account needed.</p>
        </div>

        {submitted && (
          <div className="toolcard" style={{ marginBottom: 24 }}>
            <div className="result">
              <span className="result__sub">Projected Reading band</span>
              <div className="result__band">{band.toFixed(1)}</div>
              <div className="result__sub">{correct} / {QUESTIONS.length} correct · ≈ {projectedRaw}/40 on a full test</div>
              <div className="result__bar"><i style={{ width: `${(correct / QUESTIONS.length) * 100}%` }} /></div>
            </div>
            <div className="toolbtns" style={{ justifyContent: "center" }}>
              <button type="button" className="btn btn--ghost" onClick={reset}>Try again</button>
              <a href={SITE.routes.signup} className="btn btn--primary">Unlock full tests</a>
            </div>
          </div>
        )}

        <div className="toolcard">
          <div className="toolmeta"><span className="chip">Passage</span> Read, then answer all {QUESTIONS.length} questions</div>
          <div className="passage">
            <h4>Urban green spaces</h4>
            {PASSAGE}
          </div>

          {QUESTIONS.map((q) => {
            const chosen = answers[q.id] || "";
            const done = submitted;
            const ok = isCorrect(q);
            return (
              <div className="q" key={q.id}>
                <div className="q__num">
                  Question {q.id}
                  {done && <span className={`qtag ${ok ? "qtag--ok" : "qtag--no"}`}>{ok ? "✓ Correct" : "✗ Incorrect"}</span>}
                </div>
                <div className="q__text">{q.text}</div>

                {q.type === "choice" ? (
                  q.options.map((opt) => {
                    let cls = "opt";
                    if (chosen === opt) cls += " opt--sel";
                    if (done && opt === q.answer) cls += " opt--correct";
                    if (done && chosen === opt && opt !== q.answer) cls += " opt--wrong";
                    return (
                      <label className={cls} key={opt}>
                        <input type="radio" name={`q${q.id}`} value={opt} checked={chosen === opt}
                          disabled={done} onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))} />
                        {opt}
                      </label>
                    );
                  })
                ) : (
                  <>
                    <input className="gapinput" type="text" placeholder="Type your answer" value={chosen}
                      disabled={done} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} />
                    {done && !ok && <div className="qans">Answer: <strong>{q.answer}</strong></div>}
                  </>
                )}
              </div>
            );
          })}

          {!submitted && (
            <div className="toolbtns">
              <button type="button" className="btn btn--primary btn--lg" onClick={() => { setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Submit &amp; get my band
              </button>
              <a href={SITE.routes.calculator} className="btn btn--ghost btn--lg">Band calculator</a>
            </div>
          )}
        </div>

        <p className="result__sub" style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
          Sample set for practice. Full timed tests with all four skills are available with a free account.
        </p>
      </div>
    </div>
  );
}
