export type Review = {
  author: string;
  date: string;
  rating: number;
  comment: string;
};

export type Place = {
  slug: string;
  name: string;
  parish: string;
  area: string;
  type: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  image: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  hours: string[];
  features: string[];
  tiktokUrl?: string;
  featured?: boolean;
  reviews: Review[];
  lat?: number;
  lng?: number;
  is_verified?: boolean;
  admin_verdict?: string;
  admin_score?: number;
  community_score?: number;
  match_reason?: string;
};

export const places: Place[] = [];


export const categories = [
  "Jerk",
  "Cook Shop",
  "Lunch Run",
  "Seafood",
  "Patties",
  "Date Night",
  "Cheap Eats",
  "Late Night"
];

export const latestPosts = [
  {
    slug: "kingston-lunch-run",
    title: "Best Kingston lunch runs when you only have 30 minutes",
    excerpt:
      "A fast shortlist of places that move quickly without serving forgettable food."
  },
  {
    slug: "mobay-jerk-map",
    title: "Where the jerk is actually worth the detour in Montego Bay",
    excerpt:
      "The smoky stops that feel local, dependable, and ready for repeat visits."
  },
  {
    slug: "breakfast-bread-guide",
    title: "Breakfast, cocoa bread, and the spots that still get it right",
    excerpt:
      "Soft bread, serious fillings, and the morning stops worth waking up for."
  }
];

export const testimonials = [
  {
    name: "Althea Brown",
    role: "Weekend explorer",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98a?auto=format&fit=crop&w=150&q=80",
    quote:
      "I finally have one place to check before deciding where to eat, and the vibe feels Jamaican instead of generic."
  },
  {
    name: "Romain Sinclair",
    role: "Kingston office worker",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&q=80",
    quote:
      "The filters are the part I wanted. I can jump straight to lunch trucks and highly rated quick bites."
  }
];
