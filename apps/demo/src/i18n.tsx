export type Lang = "en" | "ru";

export const translations = {
  en: {
    title: "bin-lookup",
    subtitle:
      "Offline card network, bank and country lookup from a BIN or full card number. No API key, no network request — everything runs in your browser.",
    inputLabel: "Card number or BIN (first 6–8 digits)",
    placeholder: "4111 1111 1111 1111",
    exampleVisa: "Visa (test)",
    exampleMastercard: "Mastercard (test)",
    exampleAmex: "Amex (test)",
    exampleMir: "Mir (range)",
    exampleReal: "Real BIN from dataset",
    scheme: "Card network",
    bank: "Issuing bank",
    country: "Country",
    cardType: "Card type",
    luhn: "Luhn checksum",
    notDetermined: "not determined",
    noDataForBin: "no data for this BIN",
    fromDataset: "from dataset",
    byPattern: "public pattern",
    luhnOk: "checksum is valid",
    luhnBad: "checksum does not match",
    tooShort: "too short to check",
    typeHint: "Enter at least 6 digits to see a result.",
    disclaimer1:
      "Card network is detected from public network specifications (reliable). Bank and country come from the open community dataset",
    disclaimer2:
      "— the official ISO IIN registry is not public, so this is best-effort, not guaranteed-complete data.",
    sourceLink: "Source on GitHub",
    navDemo: "Demo",
    navDocs: "Docs",
  },
  ru: {
    title: "bin-lookup",
    subtitle:
      "Офлайн определение банка, страны и платёжной системы по номеру карты или BIN. Без API-ключей, без сетевых запросов — всё считается в браузере.",
    inputLabel: "Номер карты или BIN (первые 6–8 цифр)",
    placeholder: "4111 1111 1111 1111",
    exampleVisa: "Visa (тест)",
    exampleMastercard: "Mastercard (тест)",
    exampleAmex: "Amex (тест)",
    exampleMir: "Мир (диапазон)",
    exampleReal: "Реальный BIN из датасета",
    scheme: "Платёжная система",
    bank: "Банк-эмитент",
    country: "Страна",
    cardType: "Тип карты",
    luhn: "Luhn-валидность",
    notDetermined: "не определено",
    noDataForBin: "нет данных по этому BIN",
    fromDataset: "из датасета",
    byPattern: "по публичному паттерну",
    luhnOk: "контрольная сумма сходится",
    luhnBad: "контрольная сумма не сходится",
    tooShort: "слишком короткий номер",
    typeHint: "Введите хотя бы 6 цифр, чтобы увидеть результат.",
    disclaimer1:
      "Платёжная система определяется по открытым спецификациям сетей (надёжно). Банк и страна берутся из открытого community-датасета",
    disclaimer2:
      "— официальный реестр ISO IIN закрыт, поэтому это best-effort данные, а не гарантированно полные.",
    sourceLink: "Исходный код на GitHub",
    navDemo: "Демо",
    navDocs: "Документация",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type TranslationKey = keyof (typeof translations)["en"];
