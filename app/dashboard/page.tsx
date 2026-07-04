import type { Metadata } from "next";
import { Brand, SITE } from "../_components/site";

export const metadata: Metadata = { title: "Dashboard (demo) · Aspirant Academy" };

// Sample data — a preview of the real student dashboard.
const ATTEMPTS = [
  { d: "Apr 2", b: 5.5 },
  { d: "Apr 20", b: 6.0 },
  { d: "May 5", b: 6.0 },
  { d: "May 22", b: 6.5 },
  { d: "Jun 10", b: 6.5 },
  { d: "Jun 28", b: 7.0 },
];
const SKILLS = [
  { name: "Listening", b: 7.5 },
  { name: "Reading", b: 7.0 },
  { name: "Writing", b: 6.0 },
  { name: "Speaking", b: 6.5 },
];
const TARGET = 7.5;

function Chart() {
  const W = 320, H = 130, pad = 14;
  const min = 5, max = 8;
  const xs = (i: number) => pad + (i / (ATTEMPTS.length - 1)) * (W - pad * 2);
  const ys = (b: number) => H - pad - ((b - min) / (max - min)) * (H - pad * 2);
  const pts = ATTEMPTS.map((a, i) => `${xs(i).toFixed(1)},${ys(a.b).toFixed(1)}`);
  const line = pts.join(" ");
  const area = `${pad},${H - pad} ${line} ${(W - pad).toFixed(1)},${H - pad}`;
  const ty = ys(TARGET);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Band progress over attempts">
      <line x1={pad} y1={ty} x2={W - pad} y2={ty} stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 4" />
      <polygon points={area} fill="var(--green)" opacity="0.08" />
      <polyline points={line} fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {ATTEMPTS.map((a, i) => (
        <circle key={i} cx={xs(i)} cy={ys(a.b)} r="3.5" fill="#fff" stroke="var(--green)" strokeWidth="2" />
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <header className="toolnav">
        <div className="container toolnav__inner">
          <Brand href="/#top" />
          <a href="/#top" className="back">← Back to home</a>
        </div>
      </header>

      <div className="dashwrap">
        <div className="dashhead">
          <div>
            <h1>Welcome back, Tanvir</h1>
            <p>Target Band {TARGET.toFixed(1)} · exam in 5 weeks · keep going.</p>
          </div>
          <span className="demobadge">◆ Demo — sample data</span>
        </div>

        <div className="dashgrid">
          <div className="dcard">
            <h3>Projected band</h3>
            <div className="dstat">7.0 <small>/ 9</small></div>
            <div className="dmeta">▲ +1.5 since April</div>
          </div>
          <div className="dcard">
            <h3>Tests taken</h3>
            <div className="dstat">14</div>
            <div className="dmeta">3 this week</div>
          </div>
          <div className="dcard">
            <h3>Study streak</h3>
            <div className="dstat">12 <small>days</small></div>
            <div className="dmeta">Best: 18 days</div>
          </div>

          <div className="dcard dcard--wide">
            <h3>Band progress</h3>
            <Chart />
            <div className="dmeta">Gold line = your target ({TARGET.toFixed(1)}). Latest mock: 7.0.</div>
          </div>

          <div className="dcard">
            <h3>Skill breakdown</h3>
            {SKILLS.map((s) => (
              <div className="skill" key={s.name}>
                <span className="skill__name">{s.name}</span>
                <span className="skill__bar"><i style={{ width: `${(s.b / 9) * 100}%` }} /></span>
                <span className="skill__val">{s.b.toFixed(1)}</span>
              </div>
            ))}
          </div>

          <div className="dcard dcard--wide">
            <h3>Recent attempts</h3>
            {[...ATTEMPTS].reverse().map((a, i) => (
              <div className="attempt" key={i}>
                <div>
                  <b>{i === 0 ? "Full mock test" : "Section practice"}</b><br />
                  <small>{a.d}, 2026</small>
                </div>
                <span className="attempt__band">{a.b.toFixed(1)}</span>
              </div>
            ))}
          </div>

          <div className="dcard">
            <h3>Recommended next</h3>
            <ul className="plan__list">
              <li>Focus on <strong>Writing</strong> — your lowest band.</li>
              <li>Submit one essay for teacher feedback.</li>
              <li>Two full mocks before exam week.</li>
            </ul>
            <div style={{ marginTop: 18 }}>
              <a href={SITE.routes.practice} className="btn btn--primary" style={{ width: "100%" }}>Take a mock now</a>
            </div>
          </div>
        </div>

        <p className="result__sub" style={{ textAlign: "center", marginTop: 24, fontSize: 13 }}>
          This is a preview with sample data. Your real dashboard fills in as you practise —{" "}
          <a href={SITE.routes.signup} style={{ color: "var(--green)", fontWeight: 600 }}>create a free account</a>.
        </p>
      </div>
    </div>
  );
}
