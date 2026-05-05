export const EMPTY_SEARCH_SUGGESTIONS = [
  "jerk",
  "seafood",
  "curry goat",
  "Kingston",
  "Portmore",
  "cheap eats"
] as const;

export const QUERY_ALIAS_MAP: Record<string, string> = {
  "box food": "cheap eats",
  "cheap food": "cheap eats",
  "cook shop": "cheap eats",
  cookshop: "cheap eats",
  curry: "curry goat",
  "curried goat": "curry goat",
  "date nite": "date night",
  icecream: "ice cream",
  "i scream": "ice cream",
  patties: "patty",
  "sea food": "seafood",
  "steam fish": "steamed fish",
  "steamed fish": "steamed fish",
  "fry chicken": "fried chicken"
};

export const JAMAICAN_SEARCH_SYNONYMS: Record<string, string[]> = {
  "cheap eats": [
    "affordable",
    "budget",
    "cheap",
    "cook shop",
    "cookshop",
    "lunch run",
    "patty",
    "quick bite"
  ],
  "curry goat": [
    "curried goat",
    "curry",
    "goat curry",
    "jamaican curry"
  ],
  "date night": [
    "bistro",
    "cocktails",
    "fine dining",
    "romantic",
    "rooftop",
    "special occasion",
    "upscale",
    "view",
    "wine"
  ],
  fish: [
    "fried fish",
    "seafood",
    "steam fish",
    "steamed fish"
  ],
  "fried chicken": [
    "chicken",
    "cook shop",
    "crispy chicken",
    "fry chicken",
    "jamaican",
    "jerk chicken"
  ],
  "fried fish": [
    "beach fish",
    "fish",
    "hellshire",
    "seafood"
  ],
  hellshire: [
    "beach fish",
    "hellshire beach",
    "st catherine"
  ],
  "ice cream": [
    "dessert",
    "devon house",
    "icecream",
    "i scream",
    "scoop"
  ],
  "jerk chicken": [
    "chicken",
    "jerk",
    "jerk pit",
    "pimento",
    "smoked chicken"
  ],
  "jerk pork": [
    "jerk",
    "jerk pit",
    "pork"
  ],
  oxtail: [
    "authentic jamaican",
    "cook shop",
    "homestyle",
    "local food",
    "stew"
  ],
  patty: [
    "beef patty",
    "cheese patty",
    "pastry",
    "patties",
    "patty shop"
  ],
  pizza: [
    "italian",
    "jack sprat",
    "seafood pizza",
    "wood fired pizza"
  ],
  portmore: [
    "st catherine",
    "st. catherine"
  ],
  seafood: [
    "beach",
    "conch",
    "fish",
    "fried fish",
    "lobster",
    "seafood",
    "shrimp",
    "steam fish",
    "steamed fish"
  ],
  "steamed fish": [
    "fish",
    "seafood",
    "steam fish"
  ],
  "downtown kingston": [
    "downtown",
    "kingston",
    "orange street"
  ]
};

export const SINGULAR_EXCEPTIONS: Record<string, string> = {
  beef: "beef",
  chicken: "chicken",
  eats: "eats",
  fish: "fish",
  fries: "fries",
  jerk: "jerk",
  pork: "pork",
  seafood: "seafood"
};
