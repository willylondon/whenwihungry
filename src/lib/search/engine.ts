import type { Place } from "@/data/places";
import {
  buildSearchQueryAnalysis,
  getTokenOverlapScore,
  includesNormalizedPhrase,
  normalizeSearchQuery,
  normalizeSearchText,
  normalizeStringArray,
  tokenizeSearchText
} from "@/lib/search/helpers";

export type SearchableRestaurantRecord = Record<string, any> & {
  address?: string | null;
  admin_reviews?: Record<string, any> | Array<Record<string, any>> | null;
  aliases?: string[] | null;
  area?: string | null;
  best_dish?: string | string[] | null;
  category?: string | null;
  cuisine?: string | null;
  cuisine_type?: string | null;
  description?: string | null;
  dish_tags?: string[] | null;
  dishes?: Array<Record<string, any>> | null;
  location_tags?: string[] | null;
  menu_items?: string[] | null;
  name?: string | null;
  parish?: string | null;
  price_level?: number | null;
  price_range?: string | null;
  search_keywords?: string[] | null;
  search_text?: string | null;
  town?: string | null;
  vibe_tags?: string[] | null;
  meal_tags?: string[] | null;
};

export type RestaurantSearchDocument = {
  name: string;
  description: string;
  cuisine: string;
  category: string;
  parish: string;
  area: string;
  town: string;
  address: string;
  price_level: number;
  price_range: string;
  dish_tags: string[];
  vibe_tags: string[];
  meal_tags: string[];
  location_tags: string[];
  search_keywords: string[];
  critic_review_body: string;
  public_listing_summary: string;
  search_blob: string;
  search_text: string;
  aliases: string[];
  tokens: string[];
};

type RankedRestaurant = {
  matchReason: string;
  score: number;
};

function toArray<T>(value: T | T[] | null | undefined) {
  if (!value) return [] as T[];
  return Array.isArray(value) ? value : [value];
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeFlexibleStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return unique(value.map((item) => normalizeSearchText(String(item ?? ""))).filter(Boolean));
  }

  if (typeof value === "string") {
    return unique(
      value
        .split(",")
        .map((item) => normalizeSearchText(item))
        .filter(Boolean)
    );
  }

  return [];
}

function buildCriticReviewBody(record: SearchableRestaurantRecord) {
  const review = toArray(record.admin_reviews)[0];

  return normalizeSearchText(
    [
      review?.headline,
      review?.honest_take,
      ...(Array.isArray(review?.pros) ? review.pros : []),
      ...(Array.isArray(review?.cons) ? review.cons : []),
      review?.verdict
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function buildDerivedDishTags(sourceText: string) {
  const derived = new Set<string>();

  if (includesNormalizedPhrase(sourceText, "curry goat")) {
    derived.add("curry goat");
  }
  if (includesNormalizedPhrase(sourceText, "fried fish")) {
    derived.add("fried fish");
  }
  if (includesNormalizedPhrase(sourceText, "steam fish") || includesNormalizedPhrase(sourceText, "steamed fish")) {
    derived.add("steamed fish");
    derived.add("fish");
  }
  if (includesNormalizedPhrase(sourceText, "ice cream")) {
    derived.add("ice cream");
  }
  if (includesNormalizedPhrase(sourceText, "patty")) {
    derived.add("patty");
  }
  if (includesNormalizedPhrase(sourceText, "oxtail")) {
    derived.add("oxtail");
  }
  if (includesNormalizedPhrase(sourceText, "pizza")) {
    derived.add("pizza");
  }
  if (includesNormalizedPhrase(sourceText, "seafood")) {
    derived.add("seafood");
  }
  if (includesNormalizedPhrase(sourceText, "fish")) {
    derived.add("fish");
  }
  if (includesNormalizedPhrase(sourceText, "jerk")) {
    derived.add("jerk");
  }
  if (includesNormalizedPhrase(sourceText, "jerk chicken") || includesNormalizedPhrase(sourceText, "chicken")) {
    derived.add("jerk chicken");
    derived.add("chicken");
  }
  if (includesNormalizedPhrase(sourceText, "jerk pork") || includesNormalizedPhrase(sourceText, "pork")) {
    derived.add("jerk pork");
    derived.add("pork");
  }
  if (includesNormalizedPhrase(sourceText, "dessert")) {
    derived.add("dessert");
  }
  if (includesNormalizedPhrase(sourceText, "jamaican")) {
    derived.add("jamaican");
  }

  return unique([...derived]);
}

function buildDerivedVibeTags(record: SearchableRestaurantRecord, sourceText: string) {
  const derived = new Set<string>();
  const priceLevel = Number(record.price_level ?? 0);
  const priceRange = String(record.price_range ?? "").trim();
  const cheapSignal = [
    "cafeteria",
    "cook shop",
    "cookshop",
    "grill",
    "homestyle",
    "lunch",
    "patty",
    "quick"
  ].some((term) => includesNormalizedPhrase(sourceText, term));
  const isCheap =
    priceRange.length > 0
      ? priceRange.length <= 1 || (priceRange.length <= 2 && cheapSignal)
      : priceLevel > 0
        ? priceLevel <= 1 || (priceLevel <= 2 && cheapSignal)
        : cheapSignal;
  const isDateNight =
    priceLevel >= 3 ||
    priceRange.length >= 3 ||
    ["cocktail", "historic", "premium", "rooftop", "romantic", "upscale", "wine"].some((term) =>
      includesNormalizedPhrase(sourceText, term)
    );

  if (isCheap) {
    derived.add("cheap eats");
    derived.add("affordable");
    derived.add("budget");
  }

  if (isDateNight) {
    derived.add("date night");
    derived.add("romantic");
    derived.add("special occasion");
  }

  if (includesNormalizedPhrase(sourceText, "beach") || includesNormalizedPhrase(sourceText, "beachside")) {
    derived.add("beachside");
  }

  return unique([...derived]);
}

function buildDerivedMealTags(sourceText: string) {
  const derived = new Set<string>();

  if (includesNormalizedPhrase(sourceText, "breakfast") || includesNormalizedPhrase(sourceText, "coffee")) {
    derived.add("breakfast");
  }
  if (includesNormalizedPhrase(sourceText, "lunch")) {
    derived.add("lunch");
    derived.add("cheap eats");
  }
  if (includesNormalizedPhrase(sourceText, "dinner")) {
    derived.add("dinner");
  }

  return unique([...derived]);
}

function buildDerivedLocationTags(record: SearchableRestaurantRecord, sourceText: string) {
  const derived = new Set<string>();
  const parish = normalizeSearchText(record.parish);
  const area = normalizeSearchText(record.area);

  if (parish) {
    derived.add(parish);
    derived.add(parish.replace(/\./g, ""));
  }
  if (area) {
    derived.add(area);
  }
  if (includesNormalizedPhrase(sourceText, "downtown kingston")) {
    derived.add("downtown kingston");
  }
  if (includesNormalizedPhrase(sourceText, "portmore")) {
    derived.add("portmore");
  }
  if (includesNormalizedPhrase(sourceText, "hellshire")) {
    derived.add("hellshire");
  }

  return unique([...derived]);
}

export function buildRestaurantSearchDocument(record: SearchableRestaurantRecord): RestaurantSearchDocument {
  const dishRows = toArray(record.dishes);
  const name = normalizeSearchText(record.name);
  const description = normalizeSearchText(record.description);
  const cuisine = normalizeSearchText(record.cuisine_type || record.cuisine);
  const category = normalizeSearchText(record.category);
  const parish = normalizeSearchText(record.parish);
  const area = normalizeSearchText(record.area);
  const town = normalizeSearchText(record.town ?? record.area);
  const address = normalizeSearchText(record.address);
  const bestDish = normalizeSearchText(
    Array.isArray(record.best_dish) ? record.best_dish.join(" ") : record.best_dish
  );
  const priceLevel = Number(record.price_level ?? 0);
  const priceRange = normalizeSearchText(record.price_range);
  const baseKeywords = normalizeStringArray(record.search_keywords);
  const baseDishTags = normalizeStringArray(record.dish_tags);
  const baseVibeTags = normalizeStringArray(record.vibe_tags);
  const baseMealTags = normalizeStringArray(record.meal_tags);
  const baseLocationTags = normalizeStringArray(record.location_tags);
  const baseAliases = normalizeFlexibleStringArray(record.aliases);
  const baseMenuItems = normalizeFlexibleStringArray(record.menu_items);
  const criticReviewBody = buildCriticReviewBody(record);
  const dishNames = normalizeStringArray(
    dishRows.flatMap((dish) => [dish?.name, dish?.normalized_name, ...(Array.isArray(dish?.tags) ? dish.tags : [])])
  );
  const dishText = normalizeSearchText(
    dishRows
      .flatMap((dish) => [dish?.name, dish?.normalized_name, ...(Array.isArray(dish?.tags) ? dish.tags : [])])
      .filter(Boolean)
      .join(" ")
  );
  const sourceText = normalizeSearchText(
    [
      name,
      description,
      cuisine,
      category,
      parish,
      area,
      town,
      address,
      record.search_text,
      dishText,
      criticReviewBody,
      baseKeywords.join(" ")
    ]
      .filter(Boolean)
      .join(" ")
  );

  const dishTags = unique([
    ...baseDishTags,
    ...dishNames,
    ...buildDerivedDishTags(sourceText)
  ]);
  const vibeTags = unique([...baseVibeTags, ...buildDerivedVibeTags(record, sourceText)]);
  const mealTags = unique([...baseMealTags, ...buildDerivedMealTags(sourceText)]);
  const locationTags = unique([...baseLocationTags, ...buildDerivedLocationTags(record, sourceText)]);
  const menuItems = unique([...baseMenuItems, ...dishNames]);
  const searchKeywords = unique([
    ...baseKeywords,
    name,
    cuisine,
    category,
    parish,
    area,
    town
  ]);
  const publicListingSummary = normalizeSearchText(
    [
      record.name,
      record.description,
      record.category,
      record.cuisine_type,
      record.area,
      record.parish,
      record.address,
      record.price_range,
      ...searchKeywords,
      ...dishTags,
      ...vibeTags,
      ...mealTags,
      ...locationTags
    ]
      .filter(Boolean)
      .join(" ")
  );
  const aliases = unique(
    [
      ...baseAliases,
      name,
      normalizeSearchQuery(record.name),
      area,
      parish,
      category,
      cuisine,
      ...searchKeywords,
      ...dishTags,
      ...locationTags
    ].filter(Boolean)
  );
  const searchBlob = normalizeSearchText(
    [
      name,
      description,
      cuisine,
      category,
      parish,
      area,
      address,
      bestDish,
      ...dishTags,
      ...vibeTags,
      ...mealTags,
      ...locationTags,
      ...menuItems,
      ...searchKeywords,
      ...aliases
    ]
      .filter(Boolean)
      .join(" ")
  );
  const searchText = normalizeSearchText(
    [sourceText, publicListingSummary, criticReviewBody, searchBlob, ...dishTags, ...vibeTags, ...mealTags, ...locationTags]
      .filter(Boolean)
      .join(" ")
  );

  return {
    name,
    description,
    cuisine,
    category,
    parish,
    area,
    town,
    address,
    price_level: priceLevel,
    price_range: priceRange,
    dish_tags: dishTags,
    vibe_tags: vibeTags,
    meal_tags: mealTags,
    location_tags: locationTags,
    search_keywords: searchKeywords,
    critic_review_body: criticReviewBody,
    public_listing_summary: publicListingSummary,
    search_blob: searchBlob,
    search_text: searchText,
    aliases,
    tokens: tokenizeSearchText(
      [
        name,
        description,
        cuisine,
        category,
        parish,
        area,
        town,
        address,
        ...dishTags,
        ...vibeTags,
        ...mealTags,
        ...locationTags,
        ...menuItems,
        ...searchKeywords,
        ...aliases,
        bestDish,
        criticReviewBody,
        publicListingSummary,
        searchBlob
      ].join(" ")
    )
  };
}

function exactArrayMatch(values: string[], terms: string[]) {
  return terms.some((term) => values.includes(term));
}

function partialArrayMatch(values: string[], terms: string[]) {
  return terms.some((term) => values.some((value) => value.includes(term)));
}

function scoreRestaurant(doc: RestaurantSearchDocument, query: string): RankedRestaurant | null {
  const analysis = buildSearchQueryAnalysis(query);

  if (!analysis.normalized) {
    return null;
  }

  let score = 0;
  let strongestScore = 0;
  let matchReason = "Related match";

  const addScore = (points: number, reason: string) => {
    score += points;
    if (points > strongestScore) {
      strongestScore = points;
      matchReason = reason;
    }
  };

  const queryWords = analysis.tokens;
  const hasBlobWordMatch =
    queryWords.length > 0 && queryWords.every((word) => doc.search_blob.includes(word));
  const hasBlobPhraseMatch = Boolean(analysis.normalized && doc.search_blob.includes(analysis.normalized));

  if (hasBlobPhraseMatch) {
    addScore(360, "Exact search match");
  } else if (hasBlobWordMatch) {
    addScore(280, "Search text match");
  }

  if (analysis.exactTerms.some((term) => doc.name === term)) {
    addScore(340, "Exact name match");
  } else if (partialArrayMatch([doc.name], analysis.exactTerms)) {
    addScore(260, "Name match");
  }

  if (exactArrayMatch(doc.dish_tags, analysis.exactTerms) || exactArrayMatch(doc.search_keywords, analysis.exactTerms)) {
    addScore(300, "Exact dish/tag match");
  } else if (partialArrayMatch([...doc.dish_tags, ...doc.search_keywords], analysis.exactTerms)) {
    addScore(230, "Dish/tag match");
  }

  if (
    exactArrayMatch([doc.parish, doc.area, doc.town, ...doc.location_tags], analysis.exactTerms) ||
    partialArrayMatch([doc.parish, doc.area, doc.town, ...doc.location_tags], analysis.exactTerms)
  ) {
    addScore(210, "Parish/area match");
  }

  if (
    exactArrayMatch([doc.category, doc.cuisine], analysis.exactTerms) ||
    partialArrayMatch([doc.category, doc.cuisine], analysis.exactTerms)
  ) {
    addScore(180, "Category/cuisine match");
  }

  if (
    analysis.exactTerms.some((term) =>
      [doc.description, doc.search_text, doc.search_blob, doc.critic_review_body, doc.public_listing_summary].some((value) =>
        value.includes(term)
      )
    )
  ) {
    addScore(140, "Description/search match");
  }

  if (exactArrayMatch(doc.dish_tags, analysis.relatedTerms) || partialArrayMatch(doc.dish_tags, analysis.relatedTerms)) {
    addScore(130, "Related dish/tag match");
  }
  if (
    exactArrayMatch([...doc.vibe_tags, ...doc.meal_tags], analysis.relatedTerms) ||
    partialArrayMatch([...doc.vibe_tags, ...doc.meal_tags], analysis.relatedTerms)
  ) {
    addScore(120, "Related vibe match");
  }
  if (
    exactArrayMatch([doc.parish, doc.area, doc.town, ...doc.location_tags], analysis.relatedTerms) ||
    partialArrayMatch([doc.parish, doc.area, doc.town, ...doc.location_tags], analysis.relatedTerms)
  ) {
    addScore(115, "Related location match");
  }
  if (
    partialArrayMatch([doc.category, doc.cuisine, ...doc.search_keywords], analysis.relatedTerms) ||
    analysis.relatedTerms.some((term) => doc.search_text.includes(term))
  ) {
    addScore(110, "Related category/cuisine match");
  }

  const overlap = getTokenOverlapScore(analysis.tokens, doc.tokens);

  if (overlap >= 0.5) {
    addScore(Math.round(overlap * 100), "Fuzzy related match");
  } else if (overlap >= 0.25) {
    addScore(Math.round(overlap * 60), "Fuzzy related match");
  }

  if (doc.vibe_tags.includes("cheap eats") && analysis.normalized === "cheap eats") {
    addScore(240 + Math.max(0, 40 - doc.price_level * 10), "Cheap eats match");
  }
  if (doc.vibe_tags.includes("date night") && analysis.normalized === "date night") {
    addScore(220 + doc.price_level * 10, "Date night match");
  }

  if (!score) {
    return null;
  }

  return {
    score,
    matchReason
  };
}

export function rankPlacesForQuery<TPlace extends Place>(
  query: string,
  candidates: Array<TPlace & { search_document: RestaurantSearchDocument }>
) {
  return candidates
    .map((candidate) => {
      const ranking = scoreRestaurant(candidate.search_document, query);

      if (!ranking) {
        return null;
      }

      return {
        ...candidate,
        final_score: ranking.score,
        match_reason: ranking.matchReason
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const scoreGap = Number((right as any).final_score ?? 0) - Number((left as any).final_score ?? 0);

      if (scoreGap !== 0) return scoreGap;

      return (right as any).reviewCount - (left as any).reviewCount;
    }) as Array<TPlace & { search_document: RestaurantSearchDocument; final_score: number; match_reason: string }>;
}
