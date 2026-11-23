// Minimal inline logotype marks for each card network. Kept intentionally
// simple/geometric (not pixel-accurate brand logos) so there is nothing to
// license — just a recognizable silhouette that swaps as the user types.
//
// Two render modes:
//  - default: a small rounded "badge" with its own background, used in
//    standalone contexts (lists, docs, etc).
//  - bare: no background rectangle, just the mark/wordtype, meant to sit
//    directly on top of the gradient card surface (brand-colored where the
//    brand has a strong signature color, otherwise plain white).

type IconProps = { bare?: boolean };

function Badge({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 30" className="scheme-icon" aria-hidden="true">
      <rect width="48" height="30" rx="5" fill={bg} />
      {children}
    </svg>
  );
}

function Visa({ bare }: IconProps) {
  if (bare) {
    return (
      <svg
        viewBox="0 0 48 30"
        className="scheme-icon scheme-icon-bare"
        aria-hidden="true"
      >
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fontFamily="IBM Plex Sans, sans-serif"
          fontWeight="700"
          fontStyle="italic"
          fontSize="15"
          fill="#fff"
        >
          VISA
        </text>
      </svg>
    );
  }
  return (
    <Badge bg="#1a1f71">
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fontFamily="IBM Plex Sans, sans-serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="13"
        fill="#fff"
      >
        VISA
      </text>
    </Badge>
  );
}

function Mastercard({ bare }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 30"
      className={bare ? "scheme-icon scheme-icon-bare" : "scheme-icon"}
      aria-hidden="true"
    >
      {!bare && <rect width="48" height="30" rx="5" fill="#16171a" />}
      <circle cx="20" cy="15" r="9" fill="#eb001b" />
      <circle cx="28" cy="15" r="9" fill="#f79e1b" fillOpacity="0.92" />
    </svg>
  );
}

function Amex({ bare }: IconProps) {
  if (bare) {
    return (
      <svg
        viewBox="0 0 48 30"
        className="scheme-icon scheme-icon-bare"
        aria-hidden="true"
      >
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fontFamily="IBM Plex Sans, sans-serif"
          fontWeight="700"
          fontSize="11"
          fill="#fff"
        >
          AMEX
        </text>
      </svg>
    );
  }
  return (
    <Badge bg="#2e77bc">
      <text
        x="24"
        y="19"
        textAnchor="middle"
        fontFamily="IBM Plex Sans, sans-serif"
        fontWeight="700"
        fontSize="9.5"
        fill="#fff"
      >
        AMEX
      </text>
    </Badge>
  );
}

function Mir({ bare }: IconProps) {
  if (bare) {
    return (
      <svg
        viewBox="0 0 48 30"
        className="scheme-icon scheme-icon-bare"
        aria-hidden="true"
      >
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fontFamily="IBM Plex Sans, sans-serif"
          fontWeight="700"
          fontSize="13"
          fill="#fff"
        >
          МИР
        </text>
      </svg>
    );
  }
  return (
    <Badge bg="#0f754e">
      <text
        x="24"
        y="19.5"
        textAnchor="middle"
        fontFamily="IBM Plex Sans, sans-serif"
        fontWeight="700"
        fontSize="11"
        fill="#fff"
      >
        МИР
      </text>
    </Badge>
  );
}

function Maestro({ bare }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 30"
      className={bare ? "scheme-icon scheme-icon-bare" : "scheme-icon"}
      aria-hidden="true"
    >
      {!bare && <rect width="48" height="30" rx="5" fill="#16171a" />}
      <circle cx="20" cy="15" r="9" fill="#0099df" />
      <circle cx="28" cy="15" r="9" fill="#ed0006" fillOpacity="0.9" />
    </svg>
  );
}

function Discover({ bare }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 30"
      className={bare ? "scheme-icon scheme-icon-bare" : "scheme-icon"}
      aria-hidden="true"
    >
      {!bare && <rect width="48" height="30" rx="5" fill="#1b1b1b" />}
      <circle cx="37" cy="15" r="6" fill="#f68121" />
      <text
        x="18"
        y="19"
        textAnchor="middle"
        fontFamily="IBM Plex Sans, sans-serif"
        fontWeight="600"
        fontSize="8"
        fill="#fff"
      >
        DISC
      </text>
    </svg>
  );
}

function Jcb({ bare }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 30"
      className={bare ? "scheme-icon scheme-icon-bare" : "scheme-icon"}
      aria-hidden="true"
    >
      {!bare && <rect width="48" height="30" rx="5" fill="#0b0b0b" />}
      <rect x="9" y="7" width="9" height="16" rx="2" fill="#0e4c96" />
      <rect x="19.5" y="7" width="9" height="16" rx="2" fill="#d2242a" />
      <rect x="30" y="7" width="9" height="16" rx="2" fill="#0a8a3d" />
    </svg>
  );
}

function UnionPay({ bare }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 30"
      className={bare ? "scheme-icon scheme-icon-bare" : "scheme-icon"}
      aria-hidden="true"
    >
      {!bare && <rect width="48" height="30" rx="5" fill="#0b0b0b" />}
      <rect x="10" y="7" width="9" height="16" rx="2" fill="#e21836" />
      <rect x="19.5" y="7" width="9" height="16" rx="2" fill="#00447c" />
      <rect x="29" y="7" width="9" height="16" rx="2" fill="#007b84" />
    </svg>
  );
}

function Diners({ bare }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 30"
      className={bare ? "scheme-icon scheme-icon-bare" : "scheme-icon"}
      aria-hidden="true"
    >
      {!bare && <rect width="48" height="30" rx="5" fill="#111" />}
      <circle
        cx="24"
        cy="15"
        r="9"
        fill="none"
        stroke={bare ? "#fff" : "#9ecbe8"}
        strokeWidth="2"
      />
      <rect
        x="22.4"
        y="7"
        width="3.2"
        height="16"
        fill={bare ? "#fff" : "#9ecbe8"}
      />
    </svg>
  );
}

function Generic({ bare }: IconProps) {
  if (bare) {
    // Nothing recognizable yet — keep the card surface clean.
    return null;
  }
  return (
    <svg
      viewBox="0 0 48 30"
      className="scheme-icon scheme-icon-generic"
      aria-hidden="true"
    >
      <rect
        width="48"
        height="30"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="3 3"
      />
      <rect x="9" y="12" width="30" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}

const ICONS: Record<string, (p: IconProps) => JSX.Element | null> = {
  visa: Visa,
  mastercard: Mastercard,
  amex: Amex,
  mir: Mir,
  maestro: Maestro,
  discover: Discover,
  jcb: Jcb,
  unionpay: UnionPay,
  diners: Diners,
};

export default function SchemeIcon({
  scheme,
  bare,
}: {
  scheme?: string | null;
  bare?: boolean;
}) {
  const Icon = (scheme && ICONS[scheme]) || Generic;
  return <Icon bare={bare} />;
}
