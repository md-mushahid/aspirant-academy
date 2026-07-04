import { Brand, Icon, PhotoSlot, SITE } from "./_components/site";

// Study/education-themed placeholder images (Unsplash for scenes, pravatar for
// faces). All URLs verified to load. Swap for your own photography later.
const ux = (id: string, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

// People-free study scenes for scenes; male portraits only for the two faces.
const IMG = {
  hero: ux("1481627834876-b7833e8f5570", 1200), // books / open study desk
  instructor: ux("1500648767791-00dcc994a43e", 900), // male instructor portrait
  lesson: ux("1519682337058-a94d519337bc", 1200), // notebook & desk
  mock: ux("1457369804613-52c61a468e7d", 1200), // open books / notes
  feedback: ux("1490633874781-1c63cc424610", 1200), // books & study
  life: [
    ux("1531346878377-a5be20888e57", 800), // library
    ux("1521587760476-6c12a4b040da", 800), // library shelves
    ux("1550399105-c4db5fb85c18", 800), // library aisle
    ux("1512820790803-83ca734da794", 800), // stack of books
    ux("1481277542470-605612bd2d61", 800), // books on a desk
    ux("1544716278-ca5e3f4abd8c", 800), // library reading room
  ],
  avatar: "https://randomuser.me/api/portraits/men/32.jpg", // male (guaranteed)
  news: [
    ux("1513258496099-48168024aec0", 800), // books
    ux("1497633762265-9d179a990aa6", 800), // stack of books
    ux("1507842217343-583bb7270b66", 800), // open book
  ],
};

export default function HomePage() {
  return (
    <>
      {/* ---------------- Utility bar ---------------- */}
      <div className="utilbar">
        <div className="container utilbar__inner">
          <a href={SITE.routes.calculator}>Band Calculator</a>
          <span className="utilbar__sep" />
          <a href={SITE.routes.listening}>Listening Test</a>
          <span className="utilbar__sep" />
          <a href={SITE.routes.studyPlan}>Study Plan</a>
          <span className="utilbar__sep" />
          <a href="/teacher">Teacher Mode</a>
        </div>
      </div>

      {/* ---------------- Nav (on green) ---------------- */}
      <header className="nav nav--green" id="top">
        <div className="container nav__inner">
          <Brand href="#top" />
          <nav className="nav__links">
            <a href="#prepare">How it works</a>
            <a href={SITE.routes.practice}>Mock Tests</a>
            <a href={SITE.routes.dashboard}>Dashboard</a>
            <a href="/blog">Blog</a>
          </nav>
          <div className="nav__right">
            <a href={SITE.routes.login} style={{ fontWeight: 500, fontSize: 15 }}>Log in</a>
            <a href={SITE.routes.signup} className="btn btn--primary">Get started</a>
          </div>
          <details className="navmenu">
            <summary aria-label="Open menu"><span className="navmenu__bars" /></summary>
            <div className="navmenu__panel">
              <a href="#prepare">How it works</a>
              <a href={SITE.routes.practice}>Mock Tests</a>
              <a href={SITE.routes.dashboard}>Dashboard</a>
              <a href="/blog">Blog</a>
              <div className="navmenu__sep" />
              <a href={SITE.routes.calculator}>Band Calculator</a>
              <a href={SITE.routes.listening}>Listening Test</a>
              <a href={SITE.routes.studyPlan}>Study Plan</a>
              <a href="/teacher">Teacher Mode</a>
              <div className="navmenu__sep" />
              <a href={SITE.routes.login}>Log in</a>
              <a href={SITE.routes.signup} className="btn btn--primary">Get started</a>
            </div>
          </details>
        </div>
      </header>

      <main>
        {/* ---------------- Hero (green split, Overlake-style) ---------------- */}
        <section className="ghero">
          <div className="ghero__trees" />
          <div className="container ghero__inner">
            <div className="ghero__body">
              <p className="ghero__eyebrow">At Aspirant Academy, we’re all about</p>
              <h1>Preparation is a journey worth mastering.</h1>
              <p className="ghero__sub">
                Learn the exam the way it’s marked, practise with real tests, and
                get feedback from teachers who’ve scored Band 9 — calmly, one
                skill at a time.
              </p>
              <div className="ghero__cta">
                <a href={SITE.routes.signup} className="btn btn--gold btn--lg">Start learning free</a>
                <a href={SITE.routes.practice} className="btn btn--video btn--lg"><span className="vplay" /> Try a free mock test</a>
              </div>
              <div className="ghero__dots"><i className="on" /><i /><i /><i /></div>
            </div>
            <div className="ghero__photo">
              <PhotoSlot label="A focused learner" src={IMG.hero} />
            </div>
          </div>
        </section>

        {/* ---------------- Mission ---------------- */}
        <section className="section">
          <div className="container intro center reveal">
            <span className="eyebrow">Our approach</span>
            <h2 className="h2">We teach the exam the way it’s actually marked.</h2>
            <p className="lead">
              Every lesson is strategy-first. Every test mirrors the real format.
              Every essay and recording comes back with a band score and notes you
              can act on.
            </p>
          </div>
        </section>

        {/* ---------------- Stat band (Owl's Eye View) ---------------- */}
        <section className="greenband" style={{ paddingBlock: 76 }}>
          <div className="container">
            <div className="statband reveal">
              <StatIcon icon="book" value="4" label="Skills, one platform" />
              <StatIcon icon="chart" value="9.0" label="Top band coached" />
              <StatIcon icon="test" value="2" label="Academic & General" />
              <StatIcon icon="video" value="5 min" label="Free lesson previews" />
            </div>
          </div>
        </section>

        {/* ---------------- Lead-instructor note ---------------- */}
        <section className="section">
          <div className="container note reveal">
            <PhotoSlot className="note__photo" label="Lead instructor portrait" src={IMG.instructor} />
            <div>
              <span className="eyebrow">From our lead instructor</span>
              <blockquote>
                “Most students don’t need more tests — they need to understand why
                they lost the marks. That’s what we teach: the examiner’s logic,
                one skill at a time, until your target band feels inevitable.”
              </blockquote>
              <div className="note__sign">
                <b>Aspirant Academy</b>
                <span>Your IELTS instructors · Band 9.0 · 10+ years</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Editorial rows ---------------- */}
        <section className="section" style={{ paddingTop: 0 }} id="prepare">
          <div className="container">
            <div className="feature reveal">
              <div className="feature__body">
                <span className="eyebrow">Learn</span>
                <h2>Video lessons that get to the point.</h2>
                <p className="lead">Short, strategy-first lessons for every question type — Academic and General Training. Preview the first five minutes of any paid lesson, free.</p>
                <a href={SITE.routes.signup} className="feature__link">Browse lessons →</a>
              </div>
              <div className="feature__media"><PhotoSlot label="A calm video-lesson view" src={IMG.lesson} /></div>
            </div>

            <div className="feature feature--flip reveal" id="results">
              <div className="feature__body">
                <span className="eyebrow">Practise</span>
                <h2>Real, timed mock tests.</h2>
                <p className="lead">Full-length papers built to the exam format. Reading and Listening are marked the moment you submit, with your band and a clear per-question review.</p>
                <a href={SITE.routes.signup} className="feature__link">Take a mock →</a>
              </div>
              <div className="feature__media"><PhotoSlot label="Band score + review screen" src={IMG.mock} /></div>
            </div>

            <div className="feature reveal">
              <div className="feature__body">
                <span className="eyebrow">Improve</span>
                <h2>Feedback from real teachers.</h2>
                <p className="lead">Writing and Speaking come back with a band score against every criterion, plus written notes that tell you exactly what to fix next — no guesswork.</p>
                <a href={SITE.routes.signup} className="feature__link">See feedback →</a>
              </div>
              <div className="feature__media"><PhotoSlot label="Marked essay with notes" src={IMG.feedback} /></div>
            </div>
          </div>
        </section>

        {/* ---------------- Student-life mosaic ---------------- */}
        <section className="section" style={{ paddingTop: 0 }} id="life">
          <div className="container">
            <div className="center reveal" style={{ marginBottom: 44 }}>
              <span className="eyebrow">Life at Aspirant Academy</span>
              <h2 className="h2">Real learners, real progress.</h2>
            </div>
            <div className="mosaic reveal">
              <PhotoSlot label="Study group" src={IMG.life[0]} />
              <PhotoSlot label="Speaking practice" src={IMG.life[1]} />
              <PhotoSlot label="Celebrating results" src={IMG.life[2]} />
              <PhotoSlot label="Focused study" src={IMG.life[3]} />
              <PhotoSlot label="Teacher & student" src={IMG.life[4]} />
              <PhotoSlot label="Mobile learning" src={IMG.life[5]} />
            </div>
          </div>
        </section>

        {/* ---------------- Quicklinks ---------------- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="center reveal" style={{ marginBottom: 44 }}>
              <span className="eyebrow">Free tools</span>
              <h2 className="h2">Try it now — no account needed.</h2>
            </div>
            <div className="quicklinks reveal">
              <QuickLink icon="test" title="Reading mock" body="Sit a Reading sample and get instant auto-marking with a projected band." href={SITE.routes.practice} cta="Start the test →" />
              <QuickLink icon="headphones" title="Listening mock" body="A form-completion test with audio read aloud, marked instantly." href={SITE.routes.listening} cta="Start listening →" />
              <QuickLink icon="chart" title="Band calculator" body="Enter your four section scores for your overall band, official rounding." href={SITE.routes.calculator} cta="Calculate →" />
              <QuickLink icon="pen" title="Study plan" body="Answer five questions for a personalised weekly plan to your target band." href={SITE.routes.studyPlan} cta="Build my plan →" />
            </div>
          </div>
        </section>

        {/* ---------------- Testimonial ---------------- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="testimonial reveal">
              <blockquote>
                “The feedback was the difference. A teacher marked my essays
                against the real criteria — I went from stuck at 6 to a 7.5.”
              </blockquote>
              <div className="testimonial__who">
                <div className="testimonial__avatar"><PhotoSlot label="Student" src={IMG.avatar} /></div>
                <div>
                  <b>Tanvir A.</b>
                  <span>Academic · Band 7.5</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Recent articles ---------------- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="center reveal" style={{ marginBottom: 44 }}>
              <span className="eyebrow">From the blog</span>
              <h2 className="h2">Study guides &amp; band-score tips.</h2>
            </div>
            <div className="news reveal">
              <NewsCard date="Jun 28, 2026" title="How to build a Band 8 Writing Task 2 argument" src={IMG.news[0]} />
              <NewsCard date="Jun 15, 2026" title="Listening: the 6 traps that cost you easy marks" src={IMG.news[1]} />
              <NewsCard date="Jun 02, 2026" title="Speaking Part 2: turn the cue card into fluency" src={IMG.news[2]} />
            </div>
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="section" style={{ paddingTop: 0 }} id="pricing">
          <div className="container">
            <div className="ctabanner reveal">
              <div className="ctabanner__inner">
                <h2 className="h2">Get started here.</h2>
                <p className="lead">Preview lessons, sit a full mock test, and see your first band score today — no card required.</p>
                <div className="cta__actions">
                  <a href={SITE.routes.signup} className="btn btn--onDark btn--lg">Start free</a>
                  <a href={SITE.routes.premium} className="btn btn--video btn--lg">Go Premium</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__about">
              <Brand href="#top" />
              <p>Calm, expert-led IELTS preparation — lessons, real practice tests, and band-score feedback for Academic &amp; General Training.</p>
              <div className="socials">
                <a className="s-fb" href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.5-1.5H17V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8v3h2.6v8z" /></svg>
                </a>
                <a className="s-ig" href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" /></svg>
                </a>
                <a className="s-yt" href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12zM9.8 15.3V8.7l6 3.3z" /></svg>
                </a>
              </div>
              <p style={{ fontSize: 13.5, color: "#92a091", margin: 0 }}>hello@aspirantacademy.com</p>
            </div>
            <div>
              <h5>Product</h5>
              <ul>
                <li><a href="#prepare">How it works</a></li>
                <li><a href="#results">Mock tests</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="/teacher">Teacher Mode</a></li>
              </ul>
            </div>
            <div>
              <h5>Company</h5>
              <ul>
                <li><a href="/blog">Blog</a></li>
                <li><a href="#life">Community</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
            <div>
              <h5>Get started</h5>
              <ul>
                <li><a href={SITE.routes.signup}>Create account</a></li>
                <li><a href={SITE.routes.login}>Log in</a></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© 2026 Aspirant Academy. All rights reserved.</span>
            <span>Not affiliated with the IELTS partners (British Council, IDP, Cambridge).</span>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ---------------- presentational helpers ---------------- */

type IconName = "video" | "test" | "bolt" | "chat" | "chart" | "shield" | "book" | "headphones" | "pen" | "mic";

function StatIcon({ icon, value, label }: { icon: IconName; value: string; label: string }) {
  return (
    <div className="stat">
      <div className="stat__icon"><Icon name={icon} /></div>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function QuickLink({ icon, title, body, href, cta }: { icon: IconName; title: string; body: string; href: string; cta: string }) {
  return (
    <article className="quicklink">
      <div className="qicon"><Icon name={icon} /></div>
      <h3>{title}</h3>
      <p>{body}</p>
      <a href={href} className="feature__link">{cta}</a>
    </article>
  );
}

function NewsCard({ date, title, src }: { date: string; title: string; src?: string }) {
  return (
    <a href="/blog" className="newscard">
      <PhotoSlot className="newscard__media" label={title} src={src} bare={!src} />
      <div className="newscard__body">
        <span className="newscard__date">{date}</span>
        <h3>{title}</h3>
      </div>
    </a>
  );
}
