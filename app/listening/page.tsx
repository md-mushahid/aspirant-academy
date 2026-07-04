"use client";

import { useState } from "react";
import { Brand, SITE } from "../_components/site";

const AUDIO = `Good morning, and thank you for calling the Riverside Community Centre. I'll tell you about our new pottery course. The course starts on the fourth of March and runs for eight weeks. Classes are held every Tuesday evening, and the total cost is forty-five pounds, including all materials. Class size is limited to twelve people, so early booking is recommended. To register, please call our office and ask for Maria. Thank you.`;

type Q = { id: number; text: string; answer: string; accept?: string[] };
const QUESTIONS: Q[] = [
  { id: 1, text: "The course is a ______ course.", answer: "pottery" },
  { id: 2, text: "It starts on the ______ of March.", answer: "fourth", accept: ["4th", "4"] },
  { id: 3, text: "The course runs for ______ weeks.", answer: "eight", accept: ["8"] },
  { id: 4, text: "Classes are held every ______ evening.", answer: "tuesday" },
  { id: 5, text: "The total cost is ______ pounds.", answer: "forty-five", accept: ["45", "forty five"] },
  { id: 6, text: "To register, ask for ______.", answer: "maria" },
];

function rawToBand(raw: number): number {
  const t: [number, number][] = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3]];
  for (const [m, b] of t) if (raw >= m) return b;
  return 2.5;
}
const norm = (s: string) => s.trim().toLowerCase();

export default function ListeningPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  const play = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) { setUnsupported(true); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(AUDIO);
    u.rate = 0.95; u.pitch = 1;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(u);
  };
  const stop = () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); setPlaying(false); };

  const isCorrect = (q: Q) => { const a = norm(answers[q.id] || ""); return !!a && (a === norm(q.answer) || (q.accept || []).some((x) => norm(x) === a)); };
  const correct = QUESTIONS.filter(isCorrect).length;
  const projectedRaw = Math.round((correct / QUESTIONS.length) * 40);
  const band = rawToBand(projectedRaw);

  const reset = () => { setAnswers({}); setSubmitted(false); stop(); window.scrollTo({ top: 0, behavior: "smooth" }); };

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
          <h1>Listening — form completion</h1>
          <p>Press play to hear the recording (read by your browser), then complete the notes and submit for instant marking.</p>
        </div>

        {submitted && (
          <div className="toolcard" style={{ marginBottom: 24 }}>
            <div className="result">
              <span className="result__sub">Projected Listening band</span>
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
          <div className="audioplayer">
            {playing ? (
              <button type="button" className="btn btn--ghost" onClick={stop}>■ Stop</button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={play}>▶ Play audio</button>
            )}
            <span className={`eq ${playing ? "on" : ""}`}><i /><i /><i /><i /></span>
            <small>{unsupported ? "Your browser doesn’t support audio playback — read the transcript below." : "Uses your browser’s built-in voice. Headphones recommended."}</small>
          </div>

          {unsupported && <div className="passage"><h4>Transcript</h4>{AUDIO}</div>}

          {QUESTIONS.map((q) => {
            const chosen = answers[q.id] || "";
            const ok = isCorrect(q);
            return (
              <div className="q" key={q.id}>
                <div className="q__num">
                  Question {q.id}
                  {submitted && <span className={`qtag ${ok ? "qtag--ok" : "qtag--no"}`}>{ok ? "✓ Correct" : "✗ Incorrect"}</span>}
                </div>
                <div className="q__text">{q.text}</div>
                <input className="gapinput" type="text" placeholder="Type your answer" value={chosen} disabled={submitted}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} />
                {submitted && !ok && <div className="qans">Answer: <strong>{q.answer}</strong></div>}
              </div>
            );
          })}

          {!submitted && (
            <div className="toolbtns">
              <button type="button" className="btn btn--primary btn--lg" onClick={() => { setSubmitted(true); stop(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Submit &amp; get my band</button>
              <a href={SITE.routes.practice} className="btn btn--ghost btn--lg">Try Reading instead</a>
            </div>
          )}
        </div>

        <p className="result__sub" style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
          Demo uses text-to-speech. Full tests use professionally recorded audio with all four sections.
        </p>
      </div>
    </div>
  );
}
