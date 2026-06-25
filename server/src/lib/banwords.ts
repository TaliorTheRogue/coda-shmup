const reservedWords = [
  "admin",
  "administrator",
  "owner",
  "staff",
  "coda",
];

const offensiveWords = [
  "fuck",
  "fucker",
  "motherfucker",
  "bitch",
  "asshole",
  "connard",
  "connasse",
  "salope",
  "encule",
  "enculé",
  "pute",
  "hitler",
  "nazi",
  "neo-nazi",
  "neonazi",
  "88",
  "1488",
  "heilhitler",
  "kkk",
  "kukluxklan",
  "whitepower",
  "whitesupremacy",
  "genocide",
  "ethniccleansing",
  "raciste",
  "racism",
  "supremacist",
  "supremacy",
  "nigger",
  "nigga",
  "negre",
  "negro",
  "fag",
  "faggot",
  "pd",
  "pederaste",
  "tarlouze",
  "pedale",
  "retard",
];

const banwords = [
  ...reservedWords,
  ...offensiveWords,
];

export function containsBanword(value: string): boolean {
  const normalizedValue = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return banwords.some((word) =>
    normalizedValue.includes(
      word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    )
  );
}