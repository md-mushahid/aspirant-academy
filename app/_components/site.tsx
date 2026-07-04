// Shared site chrome: brand identity, logo, photo placeholders, line icons.
// Files/folders under app/ prefixed with "_" are NOT treated as routes.

export const SITE = {
  name: "Aspirant Academy",
  facebook: "https://www.facebook.com/profile.php?id=61589357884966",
  // Fake routes for the marketing skeleton — real auth is a later slice.
  routes: {
    login: "/login",
    signup: "/signup",
    premium: "/signup?plan=premium",
    practice: "/practice",
    calculator: "/calculator",
    listening: "/listening",
    studyPlan: "/study-plan",
    dashboard: "/dashboard",
  },
};

/** Gradient "rising band" logo mark inside the brand tile. */
export function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 16.5L9 11l3.5 3.5L20 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 6H20v5.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Full brand lockup: logo tile + wordmark, linking home. */
export function Brand({ href = "/#top" }: { href?: string }) {
  return (
    <a href={href} className="brand" aria-label={`${SITE.name} home`}>
      <span className="brand__mark"><Logo /></span>
      <span>Aspirant&nbsp;Academy</span>
    </a>
  );
}

/**
 * Designed photo placeholder. Looks intentional (sized, labeled) so the layout
 * reads correctly before real photography exists — swap in an <img> later.
 */
export function PhotoSlot({
  label,
  sub,
  dim,
  className = "",
  ratio,
  bare = false,
  src,
}: {
  label: string;
  sub?: string;
  dim?: string;
  className?: string;
  ratio?: string;
  bare?: boolean;
  src?: string;
}) {
  return (
    <div
      className={`photoslot ${bare ? "photoslot--bare" : ""} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="img"
      aria-label={label || "image"}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} loading="lazy" />
      ) : bare ? null : (
      <div className="photoslot__inner">
        <svg className="photoslot__icon" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" />
          <path d="M4 17l4.5-4 3 2.5L15 11l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="photoslot__label">{label}</span>
        {sub ? <span className="photoslot__sub">{sub}</span> : null}
        <span className="photoslot__dim">{dim ? dim : "Swap in your photo"}</span>
      </div>
      )}
    </div>
  );
}

/** Social-proof star rating badge. */
export function Rating({
  score = "4.8",
  count = "500+",
  onGreen = false,
  center = false,
}: {
  score?: string;
  count?: string;
  onGreen?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`rating ${onGreen ? "rating--onGreen" : ""} ${center ? "rating--center" : ""}`}>
      <span className="rating__stars" aria-hidden="true">★★★★★</span>
      <span className="rating__text">
        <b>{score}</b> from {count} students
      </span>
    </div>
  );
}

/** Minimal stroked line icons — an editorial alternative to emoji. */
const ICON_PATHS: Record<string, React.ReactNode> = {
  video: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M10 9.5l5 2.5-5 2.5z" /></>,
  test: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
  bolt: <path d="M13 3L5 13h5l-1 8 8-11h-5z" />,
  chat: <path d="M4 5h16v10H9l-5 4V5z" />,
  chart: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>,
  shield: <><path d="M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6z" /><path d="M9 12l2 2 4-4" /></>,
  book: <><path d="M4 5c2-1 5-1 8 0v14c-3-1-6-1-8 0z" /><path d="M20 5c-2-1-5-1-8 0v14c3-1 6-1 8 0z" /></>,
  headphones: <><path d="M4 13a8 8 0 0116 0" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /></>,
  pen: <><path d="M14 4l6 6L9 21H3v-6z" /><path d="M12 6l6 6" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" /></>,
};

export function Icon({ name, size = 22 }: { name: keyof typeof ICON_PATHS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}
