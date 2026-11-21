import { useMemo, useState } from "react";
import { lookup, type LookupResult } from "bin-lookup";
import { useLanguage } from "./LanguageContext.js";

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

export default function App() {
  const { lang, setLang, t } = useLanguage();
  const [raw, setRaw] = useState("4111 1111 1111 1111");

  const result: LookupResult | null = useMemo(() => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 6) return null;
    return lookup(raw);
  }, [raw]);

  return (
    <div className="page">
      <nav className="topbar">
        <span className="wordmark">bin-lookup</span>
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
      </nav>

      <header className="hero">
        <h1>{t("title")}</h1>
        <p className="subtitle">{t("subtitle")}</p>
      </header>

      <main>
        <label htmlFor="pan">{t("inputLabel")}</label>
        <input
          id="pan"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          value={raw}
          onChange={(e) => setRaw(formatInput(e.target.value))}
          placeholder={t("placeholder")}
        />

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
        ) : (
          <p className="muted hint">{t("typeHint")}</p>
        )}

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
