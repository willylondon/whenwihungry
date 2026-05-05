import {
  JAMAICAN_SEARCH_SYNONYMS,
  QUERY_ALIAS_MAP,
  SINGULAR_EXCEPTIONS
} from "@/lib/search/synonyms";

export type SearchQueryAnalysis = {
  normalized: string;
  exactTerms: string[];
  relatedTerms: string[];
  tokens: string[];
};

function unique(values: Array<string | null | undefined>) {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])];
}

export function normalizeSearchText(value: string | null | undefined) {
  if (!value) return "";

  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

  return normalized
    .replace(/\bice[\s-]*cream\b/g, "ice cream")
    .replace(/\bi scream\b/g, "ice cream")
    .replace(/\bfry chicken\b/g, "fried chicken")
    .replace(/\bcurried goat\b/g, "curry goat")
    .replace(/\bsea food\b/g, "seafood")
    .trim();
}

export function singularizeSearchToken(token: string) {
  const normalized = normalizeSearchText(token);

  if (!normalized) return "";
  if (SINGULAR_EXCEPTIONS[normalized]) return SINGULAR_EXCEPTIONS[normalized];
  if (normalized.endsWith("ies") && normalized.length > 4) {
    return `${normalized.slice(0, -3)}y`;
  }
  if (normalized.endsWith("ses") && normalized.length > 4) {
    return normalized.slice(0, -2);
  }
  if (normalized.endsWith("s") && normalized.length > 3 && !normalized.endsWith("ss")) {
    return normalized.slice(0, -1);
  }

  return normalized;
}

export function normalizeSearchQuery(value: string | null | undefined) {
  const cleaned = normalizeSearchText(value);

  if (!cleaned) return "";

  const singularized = cleaned
    .split(" ")
    .map((token) => singularizeSearchToken(token))
    .join(" ")
    .trim();

  return QUERY_ALIAS_MAP[singularized] ?? QUERY_ALIAS_MAP[cleaned] ?? singularized;
}

export function tokenizeSearchText(value: string | null | undefined) {
  const normalized = normalizeSearchText(value);

  if (!normalized) return [];

  return unique(
    normalized
      .split(" ")
      .map((token) => singularizeSearchToken(token))
      .filter((token) => token.length > 1)
  );
}

export function buildSearchQueryAnalysis(value: string | null | undefined): SearchQueryAnalysis {
  const base = normalizeSearchText(value);
  const normalized = normalizeSearchQuery(value);
  const synonymTerms = JAMAICAN_SEARCH_SYNONYMS[normalized] ?? [];
  const exactTerms = unique([base, normalized]);
  const relatedTerms = unique(
    synonymTerms.flatMap((term) => {
      const normalizedTerm = normalizeSearchQuery(term);
      const rawTerm = normalizeSearchText(term);
      return [rawTerm, normalizedTerm];
    })
  ).filter((term) => !exactTerms.includes(term));

  return {
    normalized,
    exactTerms,
    relatedTerms,
    tokens: unique(exactTerms.flatMap((term) => tokenizeSearchText(term)))
  };
}

export function normalizeStringArray(values: unknown) {
  if (!Array.isArray(values)) return [];

  return unique(values.map((value) => normalizeSearchText(String(value ?? ""))));
}

export function includesNormalizedPhrase(value: string, phrase: string) {
  const haystack = normalizeSearchText(value);
  const needle = normalizeSearchQuery(phrase);

  return Boolean(haystack && needle && haystack.includes(needle));
}

export function getTokenOverlapScore(queryTokens: string[], candidateTokens: string[]) {
  if (!queryTokens.length || !candidateTokens.length) return 0;

  const candidateSet = new Set(candidateTokens);
  const matched = queryTokens.filter((token) => candidateSet.has(token));

  return matched.length / queryTokens.length;
}
