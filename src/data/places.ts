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
};

export const places: Place[] = [
  {
    slug: "scotchies-mobay",
    name: "Scotchies",
    parish: "St. James",
    area: "Montego Bay",
    type: "Jerk Centre",
    category: "Jerk",
    rating: 4.9,
    reviewCount: 412,
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    description:
      "Open-air jerk classics with smoky chicken, festival, and the kind of side-road energy people travel for.",
    address: "Falmouth Road, Montego Bay, St. James",
    phone: "(876) 953-8041",
    website: "https://example.com/scotchies",
    hours: ["Mon-Thu: 11am-10pm", "Fri-Sat: 11am-11pm", "Sun: 12pm-9pm"],
    features: ["Jerk Chicken", "Festival", "Late Night", "Outdoor Seating"],
    tiktokUrl: "https://www.tiktok.com/@whenwihungry",
    featured: true,
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
    slug: "pepper-thyme-kingston",
    name: "Pepper & Thyme",
    parish: "Kingston",
    area: "Liguanea",
    type: "Restaurant",
    category: "Date Night",
    rating: 4.8,
    reviewCount: 198,
    priceRange: "$$$",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    description:
      "A polished dining room with local produce, bold sauces, and date-night plating that still feels rooted here.",
    address: "6 Hope Road, Liguanea, Kingston",
    phone: "(876) 555-0101",
    website: "https://example.com/pepper-thyme",
    hours: ["Tue-Thu: 12pm-9pm", "Fri-Sat: 12pm-11pm", "Sun: 12pm-7pm"],
    features: ["Chef Specials", "Cocktails", "Fine Dining", "Reservations"],
    featured: true,
    reviews: [
      {
        author: "Sade",
        date: "Apr 27, 2026",
        rating: 5,
        comment: "Refined without losing soul. The escovitch snapper was serious."
      }
    ]
  },
  {
    slug: "patties-on-point-half-way-tree",
    name: "Patties on Point",
    parish: "St. Andrew",
    area: "Half Way Tree",
    type: "Bake Shop",
    category: "Patties",
    rating: 4.7,
    reviewCount: 256,
    priceRange: "$",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    description:
      "Fast, flaky, and always crowded at lunch. This is the stop for patties, cocoa bread, and a reliable quick fix.",
    address: "Half Way Tree Road, St. Andrew",
    phone: "(876) 555-0102",
    website: "https://example.com/patties-on-point",
    hours: ["Mon-Sat: 7am-7pm", "Sun: 8am-3pm"],
    features: ["Patties", "Breakfast", "Grab & Go"],
    featured: true,
    reviews: [
      {
        author: "Kemar",
        date: "Apr 8, 2026",
        rating: 4,
        comment: "Flaky crust, spicy beef, no long story. It does the job well."
      }
    ]
  },
  {
    slug: "dockside-fry-fish-port-royal",
    name: "Dockside Fry Fish",
    parish: "Kingston",
    area: "Port Royal",
    type: "Seafood Spot",
    category: "Seafood",
    rating: 4.8,
    reviewCount: 301,
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    description:
      "A water-edge stop for fried fish, bammy, festivals, and weekend lime energy.",
    address: "Main Street, Port Royal, Kingston",
    phone: "(876) 555-0103",
    website: "https://example.com/dockside",
    hours: ["Wed-Fri: 1pm-9pm", "Sat-Sun: 12pm-10pm"],
    features: ["Fried Fish", "Sea View", "Weekend Spot"],
    featured: true,
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
    slug: "yard-pan-lunch-truck",
    name: "Yard Pan",
    parish: "St. Andrew",
    area: "New Kingston",
    type: "Lunch Truck",
    category: "Lunch Run",
    rating: 4.6,
    reviewCount: 144,
    priceRange: "$",
    image:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
    description:
      "Pepper steak, curry chicken, and rice boxes for the weekday rush crowd in New Kingston.",
    address: "Trafalgar Road, New Kingston",
    phone: "(876) 555-0104",
    website: "https://example.com/yard-pan",
    hours: ["Mon-Fri: 11am-4pm"],
    features: ["Lunch Boxes", "Fast Service", "Street Food"],
    featured: true,
    reviews: [
      {
        author: "Akeem",
        date: "Apr 14, 2026",
        rating: 4,
        comment: "Quick and flavorful. Great weekday stop when the meetings are back to back."
      }
    ]
  },
  {
    slug: "blue-mountain-bites",
    name: "Blue Mountain Bites",
    parish: "St. Andrew",
    area: "Papine",
    type: "Cafe",
    category: "Cheap Eats",
    rating: 4.7,
    reviewCount: 167,
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    description:
      "Coffee-forward breakfast plates, local pastries, and enough quiet to ease into the day.",
    address: "Papine Square, St. Andrew",
    phone: "(876) 555-0105",
    website: "https://example.com/blue-mountain-bites",
    hours: ["Mon-Sat: 8am-5pm"],
    features: ["Coffee", "Breakfast", "Pastries"],
    featured: true,
    reviews: [
      {
        author: "Janelle",
        date: "Apr 21, 2026",
        rating: 5,
        comment: "Soft cocoa bread, strong coffee, and a calm morning rhythm."
      }
    ]
  },
  {
    slug: "mobay-market-kitchen",
    name: "Mobay Market Kitchen",
    parish: "St. James",
    area: "Sam Sharpe Square",
    type: "Cook Shop",
    category: "Cook Shop",
    rating: 4.5,
    reviewCount: 112,
    priceRange: "$",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    description:
      "Local lunch plates with steam-fresh vegetables, soup, and proper weekday comfort.",
    address: "Sam Sharpe Square, Montego Bay",
    phone: "(876) 555-0106",
    website: "https://example.com/mobay-market-kitchen",
    hours: ["Mon-Fri: 10am-5pm"],
    features: ["Cook Shop", "Lunch", "Soup"],
    reviews: [
      {
        author: "Tasha",
        date: "Apr 6, 2026",
        rating: 4,
        comment: "Affordable, filling, and made for repeat lunch runs."
      }
    ]
  },
  {
    slug: "ocho-rios-seaside-grill",
    name: "Ocho Rios Seaside Grill",
    parish: "St. Ann",
    area: "Ocho Rios",
    type: "Restaurant",
    category: "Seafood",
    rating: 4.4,
    reviewCount: 89,
    priceRange: "$$",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    description:
      "Vacation-friendly seafood plates that still keep enough local flavor to earn a second visit.",
    address: "Main Street, Ocho Rios, St. Ann",
    phone: "(876) 555-0107",
    website: "https://example.com/ocho-rios-seaside-grill",
    hours: ["Daily: 12pm-9pm"],
    features: ["Seafood", "Scenic", "Dinner"],
    reviews: [
      {
        author: "Marlon",
        date: "Apr 24, 2026",
        rating: 4,
        comment: "Lovely view and good fish. Strong option if you're in town."
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
    quote:
      "I finally have one place to check before deciding where to eat, and the vibe feels Jamaican instead of generic."
  },
  {
    name: "Romain Sinclair",
    role: "Kingston office worker",
    quote:
      "The filters are the part I wanted. I can jump straight to lunch trucks and highly rated quick bites."
  }
];
