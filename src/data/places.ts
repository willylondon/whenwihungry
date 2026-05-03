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
};

export const places: Place[] = [
  {
    slug: "scotchies-mobay",
    name: "Scotchies",
    parish: "St. James",
    area: "Montego Bay",
    type: "Jerk Centre",
    category: "Jerk",
    rating: 4.8,
    reviewCount: 3200,
    priceRange: "$$",
    image: "/images/restaurants/scotchies-mobay.jpg",
    description:
      "The real deal. Open-fire jerk chicken and pork, festival, and bammy on Falmouth Road — the one every Mobay local sends you to.",
    address: "Falmouth Road, Montego Bay, St. James",
    phone: "(876) 953-8041",
    website: "https://scotchiesjamaica.com",
    hours: ["Mon-Thu: 11am-10pm", "Fri-Sat: 11am-11pm", "Sun: 12pm-9pm"],
    features: ["Jerk Chicken", "Jerk Pork", "Festival", "Outdoor Seating"],
    featured: true,
    lat: 18.5135,
    lng: -77.8860,
    reviews: [
      {
        author: "Nia",
        date: "Apr 18, 2026",
        rating: 5,
        comment: "Smoky, juicy, and exactly the kind of stop you brag about afterward."
      },
      {
        author: "Dwayne",
        date: "Apr 12, 2026",
        rating: 5,
        comment: "The jerk pork had proper fire and the festival balanced it perfectly."
      }
    ]
  },
  {
    slug: "devon-house-kingston",
    name: "Devon House I-Scream",
    parish: "Kingston",
    area: "New Kingston",
    type: "Dessert Shop",
    category: "Cheap Eats",
    rating: 4.8,
    reviewCount: 5214,
    priceRange: "$",
    image: "/images/restaurants/devon-house-kingston.jpg",
    description:
      "World-famous coconut, rum raisin, and soursop ice cream scooped at the gates of the historic Devon House mansion.",
    address: "26 Hope Road, Kingston",
    phone: "(876) 926-0815",
    website: "https://devonhousejamaica.com",
    hours: ["Daily: 11am-10pm"],
    features: ["Ice Cream", "Dessert", "Historic Venue", "Family-Friendly"],
    featured: true,
    lat: 18.0163,
    lng: -76.7869,
    reviews: [
      {
        author: "Sade",
        date: "Apr 27, 2026",
        rating: 5,
        comment: "The rum raisin cone is non-negotiable. I order it every single time."
      }
    ]
  },
  {
    slug: "ricks-cafe-negril",
    name: "Rick's Cafe",
    parish: "Westmoreland",
    area: "Negril",
    type: "Bar & Restaurant",
    category: "Date Night",
    rating: 4.6,
    reviewCount: 18231,
    priceRange: "$$$",
    image: "/images/restaurants/ricks-cafe-negril.jpg",
    description:
      "Sunset cliffs, cliff diving, cocktails, and grilled seafood — the most iconic stop on Negril's West End.",
    address: "West End Road, Negril, Westmoreland",
    phone: "(876) 957-0380",
    website: "https://rickscafejamaica.com",
    hours: ["Daily: 10am-10pm"],
    features: ["Cliff Diving", "Sunset Views", "Cocktails", "Seafood"],
    featured: true,
    lat: 18.2709,
    lng: -78.3619,
    reviews: [
      {
        author: "Marlon",
        date: "Apr 24, 2026",
        rating: 5,
        comment: "The sunset from the cliff is an experience. The jerk fish is serious too."
      }
    ]
  },
  {
    slug: "little-ochie",
    name: "Little Ochie",
    parish: "St. Elizabeth",
    area: "Alligator Pond",
    type: "Seafood Restaurant",
    category: "Seafood",
    rating: 4.6,
    reviewCount: 2189,
    priceRange: "$$",
    image: "/images/restaurants/little-ochie.jpg",
    description:
      "Fresh catch cooked roadside at the water's edge. Steamed fish, curried conch, and lobster that define coastal Jamaican dining.",
    address: "Alligator Pond, St. Elizabeth",
    phone: "(876) 877-3341",
    website: "https://littleochie.com",
    hours: ["Daily: 10am-9pm"],
    features: ["Fresh Catch", "Lobster", "Seaside Dining", "Cook to Order"],
    featured: true,
    lat: 17.8682,
    lng: -77.5701,
    reviews: [
      {
        author: "Rhea",
        date: "Apr 3, 2026",
        rating: 5,
        comment: "Crisp fish, proper pepper sauce, and the breeze sells the whole thing."
      }
    ]
  },
  {
    slug: "miss-ts-kitchen",
    name: "Miss T's Kitchen",
    parish: "St. Ann",
    area: "Ocho Rios",
    type: "Restaurant",
    category: "Cook Shop",
    rating: 4.5,
    reviewCount: 2514,
    priceRange: "$$",
    image: "/images/restaurants/miss-ts-kitchen.jpg",
    description:
      "Home-style Jamaican cooking in the heart of Ocho Rios. The kind of ackee and codfish and ox tail that makes tourists become regulars.",
    address: "65 Main Street, Ocho Rios, St. Ann",
    phone: "(876) 622-5523",
    website: "https://misstskitchen.com",
    hours: ["Daily: 11am-10pm"],
    features: ["Ackee & Saltfish", "Oxtail", "Garden Dining", "Authentic Jamaican"],
    featured: true,
    lat: 18.4086,
    lng: -77.1002,
    reviews: [
      {
        author: "Kemar",
        date: "Apr 8, 2026",
        rating: 5,
        comment: "Best oxtail I've had outside of my grandmother's kitchen."
      }
    ]
  },
  {
    slug: "boston-jerk-centre",
    name: "Boston Jerk Centre",
    parish: "Portland",
    area: "Port Antonio",
    type: "Jerk Centre",
    category: "Jerk",
    rating: 4.5,
    reviewCount: 1952,
    priceRange: "$$",
    image: "/images/restaurants/boston-jerk-centre.jpg",
    description:
      "Birthplace of Jamaican jerk. The pimento wood smoke, the open pits, and the marinade here is what every imitation is trying to copy.",
    address: "Boston Bay, Port Antonio, Portland",
    phone: "(876) 555-1123",
    website: "",
    hours: ["Daily: 10am-10pm"],
    features: ["Original Jerk", "Pimento Wood", "Breadfruit", "Festivals"],
    featured: true,
    lat: 18.1565,
    lng: -76.3503,
    reviews: [
      {
        author: "Akeem",
        date: "Apr 14, 2026",
        rating: 5,
        comment: "This is the standard. Everything else is a tribute act."
      }
    ]
  },
  {
    slug: "pier-1-mobay",
    name: "Pier 1 on the Waterfront",
    parish: "St. James",
    area: "Montego Bay",
    type: "Restaurant & Bar",
    category: "Date Night",
    rating: 4.5,
    reviewCount: 5912,
    priceRange: "$$",
    image: "/images/restaurants/pier-1-mobay.jpg",
    description:
      "Food, music, and dancing right on the Montego Bay waterfront. The Friday night party here is legendary.",
    address: "Howard Cooke Blvd, Montego Bay, St. James",
    phone: "(876) 952-2452",
    website: "https://pier1jamaica.com",
    hours: ["Daily: 11am-11pm"],
    features: ["Waterfront", "Live Music", "Seafood", "Cocktails"],
    lat: 18.4716,
    lng: -77.9255,
    reviews: [
      {
        author: "Janelle",
        date: "Apr 21, 2026",
        rating: 5,
        comment: "The vibe on a Friday night is unmatched. Grilled lobster was perfect."
      }
    ]
  },
  {
    slug: "strawberry-hill",
    name: "Strawberry Hill",
    parish: "St. Andrew",
    area: "Irish Town",
    type: "Fine Dining",
    category: "Date Night",
    rating: 4.6,
    reviewCount: 832,
    priceRange: "$$$",
    image: "/images/restaurants/strawberry-hill.jpg",
    description:
      "Blue Mountain mist and elevated New Jamaican cuisine — the brunch here is quietly one of the best on the island.",
    address: "Irish Town, St. Andrew",
    phone: "(876) 944-8400",
    website: "https://strawberryhillhotel.com",
    hours: ["Daily: 7am-10pm"],
    features: ["Blue Mountain Views", "Brunch", "Fine Dining", "Boutique Hotel"],
    featured: true,
    lat: 18.0478,
    lng: -76.7231,
    reviews: [
      {
        author: "Tasha",
        date: "Apr 6, 2026",
        rating: 5,
        comment: "Brunch in the clouds. The views and the food are equally stunning."
      }
    ]
  }
];

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
