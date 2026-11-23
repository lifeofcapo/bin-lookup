import { useEffect, useMemo, useState } from "react";
import { lookup, type LookupResult } from "@lifeofcapo/bin-lookup";
import { useLanguage } from "./LanguageContext.js";
import DocsPage from "./DocsPage.js";
import SchemeIcon from "./SchemeIcon.js";

const EXAMPLES = [
  { key: "exampleVisa", value: "4111 1111 1111 1111" },
  { key: "exampleMastercard", value: "5555 5555 5555 4444" },
  { key: "exampleAmex", value: "3782 822463 10005" },
  { key: "exampleMir", value: "2200 1234 5678 9012" },
  { key: "exampleReal", value: "341142" },
] as const;

const SCHEME_LABEL: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  mir: "Mir",
  discover: "Discover",
  jcb: "JCB",
  unionpay: "UnionPay",
  maestro: "Maestro",
  diners: "Diners Club",
};

function formatInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function Row({
  label,
  value,
  tag,
}: {
  label: string;
  value: React.ReactNode;
  tag?: string;
}) {
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <span className="row-value">
        {value}
        {tag ? <span className="tag">{tag}</span> : null}
      </span>
    </div>
  );
}

function getView(): "demo" | "docs" {
  return window.location.hash.startsWith("#docs") ? "docs" : "demo";
}

export default function App() {
  const { lang, setLang, t } = useLanguage();
  const [raw, setRaw] = useState("4111 1111 1111 1111");
  const [view, setView] = useState(getView);

  useEffect(() => {
    const onHashChange = () => setView(getView());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const result: LookupResult | null = useMemo(() => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 6) return null;
    return lookup(raw);
  }, [raw]);

  const digitsLen = raw.replace(/\D/g, "").length;
  const cardGlow = result?.scheme ? `glow-${result.scheme}` : "";

  return (
    <div className={view === "docs" ? "page page-wide" : "page"}>
      <nav className="topbar">
        <span className="wordmark">bin-lookup</span>
        <div className="topbar-right">
          <div className="view-switch">
            <a
              href="#"
              className={
                view === "demo" ? "view-tab view-tab-active" : "view-tab"
              }
            >
              {t("navDemo")}
            </a>
            <a
              href="#docs"
              className={
                view === "docs" ? "view-tab view-tab-active" : "view-tab"
              }
            >
              {t("navDocs")}
            </a>
          </div>
          <div className="lang-switch" role="group" aria-label="Language">
            <button
              className={lang === "en" ? "lang-active" : ""}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              className={lang === "ru" ? "lang-active" : ""}
              onClick={() => setLang("ru")}
              aria-pressed={lang === "ru"}
            >
              RU
            </button>
          </div>
        </div>
      </nav>

      <header className="hero">
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </header>

      {view === "docs" ? (
        <DocsPage />
      ) : (
        <main>
          <div className={`credit-card ${cardGlow}`}>
            <div className="credit-card-mesh" aria-hidden="true" />

            <div className="credit-card-top">
              <span className="credit-card-brand" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="credit-card-brand-mark">
                  <g
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  >
                    <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
                  </g>
                </svg>
              </span>

              <span className="credit-card-nfc" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  >
                    <path d="M8 5.5a11 11 0 0 1 0 13" opacity="0.45" />
                    <path d="M11.3 8a7 7 0 0 1 0 8" opacity="0.7" />
                    <path d="M14.6 10.3a3.3 3.3 0 0 1 0 3.4" />
                  </g>
                </svg>
              </span>

              <span className="credit-card-scheme">
                <SchemeIcon scheme={result?.scheme} bare />
              </span>
            </div>

            <div className="credit-card-number-row">
              <span className="credit-card-number-label">
                {t("inputLabel")}
              </span>
              <div className="credit-card-number">
                <span className="credit-card-number-display" aria-hidden="true">
                  {raw || t("placeholder")}
                </span>
                <input
                  id="pan"
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck={false}
                  value={raw}
                  onChange={(e) => setRaw(formatInput(e.target.value))}
                  placeholder={t("placeholder")}
                  className="credit-card-number-input"
                  aria-label={t("inputLabel")}
                />
              </div>
            </div>

            <div className="credit-card-bottom">
              <span className="credit-card-chip" aria-hidden="true">
                <svg viewBox="0 0 32 24">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="31"
                    height="23"
                    rx="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <path
                    d="M11 0.5V23.5M21 0.5V23.5M0.5 8H31.5M0.5 16H31.5M11 12H21"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              </span>

              <span className="credit-card-status">
                {digitsLen === 0
                  ? t("typeHint")
                  : result?.scheme
                    ? (SCHEME_LABEL[result.scheme] ?? result.scheme)
                    : digitsLen < 6
                      ? t("tooShort")
                      : t("notDetermined")}
              </span>
            </div>
          </div>

          <div className="examples">
            {EXAMPLES.map((ex) => (
              <button key={ex.value} onClick={() => setRaw(ex.value)}>
                {t(ex.key)}
              </button>
            ))}
          </div>

          {result ? (
            <section className="receipt" aria-live="polite">
              <Row
                label={t("scheme")}
                value={
                  result.scheme ? (
                    (SCHEME_LABEL[result.scheme] ?? result.scheme)
                  ) : (
                    <span className="muted">{t("notDetermined")}</span>
                  )
                }
                tag={
                  result.scheme
                    ? result.schemeSource === "range"
                      ? t("fromDataset")
                      : t("byPattern")
                    : undefined
                }
              />
              <Row
                label={t("bank")}
                value={
                  result.bank ?? (
                    <span className="muted">{t("noDataForBin")}</span>
                  )
                }
              />
              <Row
                label={t("country")}
                value={
                  result.country ?? (
                    <span className="muted">{t("noDataForBin")}</span>
                  )
                }
              />
              <Row
                label={t("cardType")}
                value={
                  result.cardType ?? (
                    <span className="muted">{t("notDetermined")}</span>
                  )
                }
              />
              <Row
                label={t("luhn")}
                value={
                  result.luhnValid === null ? (
                    <span className="muted">{t("tooShort")}</span>
                  ) : (
                    <span
                      className={
                        result.luhnValid ? "stamp stamp-ok" : "stamp stamp-bad"
                      }
                    >
                      {result.luhnValid ? t("luhnOk") : t("luhnBad")}
                    </span>
                  )
                }
              />
            </section>
          ) : null}

          <p className="disclaimer">
            {t("disclaimer1")}{" "}
            <a
              href="https://github.com/binlist/data"
              target="_blank"
              rel="noreferrer"
            >
              binlist/data
            </a>{" "}
            {t("disclaimer2")}
          </p>
        </main>
      )}

      <footer>
        <a
          href="https://github.com/lifeofcapo/bin-lookup"
          target="_blank"
          rel="noreferrer"
        >
          {t("sourceLink")}
        </a>
      </footer>
    </div>
  );
}
