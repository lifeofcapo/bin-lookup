import { useMemo, useState } from "react";
import { lookup, type LookupResult } from "bin-lookup";

const EXAMPLES = [
  { label: "Visa (тест)", value: "4111 1111 1111 1111" },
  { label: "Mastercard (тест)", value: "5555 5555 5555 4444" },
  { label: "Amex (тест)", value: "3782 822463 10005" },
  { label: "Mir (диапазон)", value: "2200 1234 5678 9012" },
  { label: "Реальный BIN из датасета", value: "341142" },
];

const SCHEME_LABEL: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  mir: "Мир",
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <span className="field-value">{children}</span>
    </div>
  );
}

function Badge({ ok, children }: { ok: boolean | null; children: React.ReactNode }) {
  const cls = ok === null ? "badge badge-neutral" : ok ? "badge badge-ok" : "badge badge-bad";
  return <span className={cls}>{children}</span>;
}

export default function App() {
  const [raw, setRaw] = useState("4111 1111 1111 1111");

  const result: LookupResult | null = useMemo(() => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 6) return null;
    return lookup(raw);
  }, [raw]);

  return (
    <div className="page">
      <header>
        <h1>bin-lookup</h1>
        <p className="subtitle">
          Офлайн определение банка, страны и платёжной системы по номеру карты / BIN.
          Без API-ключей, без сетевых запросов — всё считается прямо в браузере.
        </p>
      </header>

      <main className="card">
        <label htmlFor="pan">Номер карты или BIN (6–8 первых цифр)</label>
        <input
          id="pan"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          value={raw}
          onChange={(e) => setRaw(formatInput(e.target.value))}
          placeholder="4111 1111 1111 1111"
        />

        <div className="examples">
          {EXAMPLES.map((ex) => (
            <button key={ex.value} onClick={() => setRaw(ex.value)}>
              {ex.label}
            </button>
          ))}
        </div>

        {result ? (
          <div className="result">
            <Field label="Платёжная система">
              {result.scheme ? (
                <>
                  {SCHEME_LABEL[result.scheme] ?? result.scheme}{" "}
                  <Badge ok={result.schemeSource === "range"}>
                    {result.schemeSource === "range" ? "из датасета" : "по публичному паттерну"}
                  </Badge>
                </>
              ) : (
                <span className="muted">не определена</span>
              )}
            </Field>

            <Field label="Банк-эмитент">
              {result.bank ?? <span className="muted">нет данных по этому BIN</span>}
            </Field>

            <Field label="Страна">
              {result.country ?? <span className="muted">нет данных по этому BIN</span>}
            </Field>

            <Field label="Тип карты">
              {result.cardType ?? <span className="muted">нет данных</span>}
            </Field>

            <Field label="Luhn-валидность">
              {result.luhnValid === null ? (
                <span className="muted">слишком короткий номер для проверки</span>
              ) : (
                <Badge ok={result.luhnValid}>
                  {result.luhnValid ? "корректная контрольная сумма" : "контрольная сумма не сходится"}
                </Badge>
              )}
            </Field>
          </div>
        ) : (
          <p className="muted">Введите хотя бы 6 цифр, чтобы увидеть результат.</p>
        )}

        <p className="disclaimer">
          Платёжная система определяется по открытым спецификациям сетей (надёжно). Банк и
          страна берутся из открытого community-датасета{" "}
          <a href="https://github.com/binlist/data" target="_blank" rel="noreferrer">
            binlist/data
          </a>{" "}
          — официальный реестр ISO IIN закрыт и платен, поэтому это best-effort данные, а не
          гарантированно полные.
        </p>
      </main>

      <footer>
        {/* TODO: replace with your actual GitHub repo URL once published */}
        <a href="https://github.com/lifeofcapo/bin-lookup" target="_blank" rel="noreferrer">
          Исходный код на GitHub
        </a>
      </footer>
    </div>
  );
}
