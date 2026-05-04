export type Verdict = "run-go-get-it" | "worth-it" | "mid" | "save-your-money";

export type ContentSection = {
  heading: string;
  text: string;
};

export type ReviewPost = {
  slug: string;
  title: string;
  dek: string;
  seoTitle: string;
  seoDescription: string;
  restaurant: string;
  location: string;
  parish: string;
  area: string;
  category: string;
  publishedAt: string;
  readTime: string;
  /** @deprecated use verdict instead */
  rating: string;
  priceVibe: string;
  bestItem: string;
  worstItem: string;
  valueRating: "Low" | "Fair" | "High" | "Robbery";
  waitTime: string;
  goodFor: string;
  image: string;
  images: string[];
  videoUrl: string;
  verdict: Verdict;
  quote: string;
  highlights: string[];
  whatIOrdered: string;
  whatSurprisedMe: string;
  honestTake: string;
  contentSections: ContentSection[];
  isHiddenGem: boolean;
  isFeatured: boolean;
};

export const reviewPosts: ReviewPost[] = [
  {
    slug: "scotchies-mobay-jerk-worth-the-stop",
    title: "Scotchies Mobay: Jerk Worth the Stop Before the Airport Run",
    dek: "Smoke, heat, festival, and enough consistency to make this one easy to recommend.",
    seoTitle: "Scotchies Montego Bay Jerk Chicken Review — WhenWiHungry",
    seoDescription:
      "A WhenWiHungry review of Scotchies in Montego Bay, covering the jerk chicken, festival, sauce, price vibe, and whether it is worth the stop.",
    restaurant: "Scotchies",
    location: "Montego Bay, St. James",
    parish: "St. James",
    area: "Montego Bay",
    category: "Jerk",
    publishedAt: "2026-04-28",
    readTime: "4 min read",
    rating: "WWH Approved",
    priceVibe: "$$",
    bestItem: "Jerk chicken with extra sauce",
    worstItem: "The bread — skip it",
    valueRating: "Fair",
    waitTime: "15–25 mins",
    goodFor: "Airport runs, first-time visitors, reliable jerk cravings",
    image: "/images/restaurants/scotchies-mobay.jpg",
    images: [
      "/images/restaurants/scotchies-mobay.jpg"
    ],
    videoUrl: "https://vt.tiktok.com/ZS9Q8gU2B/",
    verdict: "run-go-get-it",
    quote: "The smoke hits before the plate lands. This is not trying to be fancy — it's trying to be remembered.",
    highlights: ["Worth the drive", "Bring cash", "Proper smoke"],
    whatIOrdered: "Jerk chicken quarter, festival, extra bottle of sauce on the side. Kept it simple.",
    whatSurprisedMe:
      "The festival was actually good. Most places treat it as an afterthought. Here it holds its own.",
    honestTake:
      "Scotchies is one of those spots that earns its reputation. The char is real, the smoke is real, and the seasoning sits deep enough to matter. Not every visit will be perfect — that's jerk. But this one delivered.",
    contentSections: [
      {
        heading: "The First Bite",
        text: "The chicken has the kind of smoke you notice before the plate lands. It is not trying to be fancy. It is trying to be remembered."
      },
      {
        heading: "What Worked",
        text: "The seasoning sits deep enough, the char gives it attitude, and the festival brings the sweet balance you want beside heat."
      },
      {
        heading: "Who Should Go",
        text: "This is for people who want a reliable jerk stop with energy. If you are passing through Mobay and need one safe recommendation, this is on the list."
      }
    ],
    isHiddenGem: false,
    isFeatured: true
  },
  {
    slug: "usain-bolt-tracks-and-records-kingston",
    title: "Usain Bolt's Tracks & Records: Does the Food Match the Name?",
    dek: "It's a sports bar with a massive name attached. But is it just a tourist trap or a genuine local spot?",
    seoTitle: "Usain Bolt's Tracks & Records Kingston Review — WhenWiHungry",
    seoDescription:
      "Honest review of Usain Bolt's Tracks & Records in Kingston. Is the food actually good? WhenWiHungry breaks it down.",
    restaurant: "Usain Bolt's Tracks & Records",
    location: "Kingston, St. Andrew",
    parish: "St. Andrew",
    area: "Kingston",
    category: "Sports Bar",
    publishedAt: "2026-04-15",
    readTime: "3 min read",
    rating: "Worth It",
    priceVibe: "$$",
    bestItem: "Jerk chicken spring rolls",
    worstItem: "The wait times on busy nights",
    valueRating: "Fair",
    waitTime: "20–30 mins",
    goodFor: "Match days, group link ups, taking visitors",
    image: "/images/restaurants/usain-bolt-s-tracks-records-kingston.jpg",
    images: [
      "/images/restaurants/usain-bolt-s-tracks-records-kingston.jpg"
    ],
    videoUrl: "https://vt.tiktok.com/ZS9Q8mN8F/",
    verdict: "worth-it",
    quote: "A sports bar that actually remembers it needs to serve good food. Surprising, but true.",
    highlights: ["Great atmosphere", "Consistent", "Massive screens"],
    whatIOrdered: "Jerk chicken spring rolls, wings, and a Red Stripe.",
    whatSurprisedMe:
      "The spring rolls aren't just a gimmick. They actually hit the right balance of heat and crunch.",
    honestTake:
      "Tracks & Records could have easily coasted on Usain Bolt's name and served mediocre bar food. They didn't. It's properly seasoned, the vibes are right for a game night, and the service holds up. It's not a cheap night out, but it delivers on the promise.",
    contentSections: [
      {
        heading: "The Situation",
        text: "You want somewhere to watch a match with a group, but you don't want to compromise on food. This is the spot."
      },
      {
        heading: "The Food",
        text: "The jerk chicken spring rolls are the undisputed champion here. The wings hold their own. Stick to the bar food classics and you won't miss."
      }
    ],
    isHiddenGem: false,
    isFeatured: false
  },
  {
    slug: "devon-house-ice-cream-worth-the-line",
    title: "Devon House Scoop Shop: Is the Hype Worth the Line?",
    dek: "Everybody goes. But should you? Me break it down for you.",
    seoTitle: "Devon House Ice Cream Kingston Review — WhenWiHungry",
    seoDescription:
      "Is Devon House ice cream actually worth standing in that line? WhenWiHungry gives you the honest take.",
    restaurant: "Devon House Scoop Shop",
    location: "Kingston, St. Andrew",
    parish: "St. Andrew",
    area: "Kingston",
    category: "Dessert",
    publishedAt: "2026-04-02",
    readTime: "3 min read",
    rating: "Worth It",
    priceVibe: "$$",
    bestItem: "Rum raisin scoop",
    worstItem: "Vanilla — too basic",
    valueRating: "Fair",
    waitTime: "20–40 mins",
    goodFor: "Date nights, tourists, Sunday vibes",
    image: "/images/restaurants/devon-house-i-scream-kingston.jpg",
    images: [
      "/images/restaurants/devon-house-i-scream-kingston.jpg"
    ],
    videoUrl: "https://vt.tiktok.com/ZS9Q8qJs1/",
    verdict: "worth-it",
    quote: "The rum raisin alone is worth the pilgrimage. Everything else is bonus.",
    highlights: ["Iconic spot", "Rum raisin is elite", "Go on a weekday"],
    whatIOrdered: "Two scoops: rum raisin and Devon Stout. In a cone because I'm not wasting the experience.",
    whatSurprisedMe:
      "The Devon Stout flavour actually tastes like something real. Not novelty for novelty sake — genuinely good.",
    honestTake:
      "Yes, the line is long. Yes, the prices have crept up. But the rum raisin is still one of the best ice cream flavours in Jamaica, and the grounds make it feel like more than just ice cream. Worth it — go on a Tuesday.",
    contentSections: [
      {
        heading: "The Line",
        text: "Get there for the experience, not the speed. If you are in a rush, this is not the spot for you today."
      },
      {
        heading: "The Ice Cream",
        text: "Rum raisin is the non-negotiable. Devon Stout for the curious. Skip the plain vanilla — that's not why you came."
      }
    ],
    isHiddenGem: false,
    isFeatured: false
  },
  {
    slug: "miss-t-kitchen-ocho-rios",
    title: "Miss T's Kitchen Ocho Rios: Local Food Done Properly",
    dek: "Tourist town, local taste. This one surprised me.",
    seoTitle: "Miss T's Kitchen Ocho Rios Review — WhenWiHungry",
    seoDescription:
      "WhenWiHungry reviews Miss T's Kitchen in Ocho Rios. Is it tourist trap or genuinely good Jamaican food?",
    restaurant: "Miss T's Kitchen",
    location: "Ocho Rios, St. Ann",
    parish: "St. Ann",
    area: "Ocho Rios",
    category: "Local Food",
    publishedAt: "2026-03-18",
    readTime: "5 min read",
    rating: "WWH Approved",
    priceVibe: "$$",
    bestItem: "Oxtail with rice and peas",
    worstItem: "The fried plantain — underseasoned",
    valueRating: "Fair",
    waitTime: "25–35 mins",
    goodFor: "Tourists wanting real food, family dinners, special occasion",
    image: "/images/restaurants/miss-t-s-kitchen-st-ann.jpg",
    images: [
      "/images/restaurants/miss-t-s-kitchen-st-ann.jpg"
    ],
    videoUrl: "https://vt.tiktok.com/ZS9Q8uQst/",
    verdict: "run-go-get-it",
    quote: "In a tourist town full of mediocre plates, this one is genuinely cooking.",
    highlights: ["Real Jamaican flavour", "Nice atmosphere", "Worth the price"],
    whatIOrdered: "Oxtail, rice and peas, festival, and a ginger beer because I was feeling right.",
    whatSurprisedMe:
      "The oxtail didn't taste like it was made for foreigners. Full seasoning, proper tenderness. No shortcuts.",
    honestTake:
      "Most restaurants in Ocho Rios are coasting on the tourist money and serving food that barely clears the bar. Miss T's is actually trying. The oxtail is the standout — properly cooked, properly seasoned, the kind you want a second plate of.",
    contentSections: [
      {
        heading: "The Setting",
        text: "Feels warm. The atmosphere matches the food — unpretentious but takes itself seriously."
      },
      {
        heading: "The Oxtail",
        text: "This is the reason you go. Everything else supports it. Don't overthink the menu."
      }
    ],
    isHiddenGem: false,
    isFeatured: false
  },
  {
    slug: "little-ochie-seafood-alligator-pond",
    title: "Little Ochie Seafood: The Ultimate Seaside Experience",
    dek: "It's a pilgrimage for any Jamaican seafood lover. But does the massive hype hold up?",
    seoTitle: "Little Ochie Seafood Alligator Pond Review — WhenWiHungry",
    seoDescription:
      "WhenWiHungry reviews Little Ochie in Alligator Pond, St. Elizabeth — the ultimate spot for fresh Jamaican seafood.",
    restaurant: "Little Ochie",
    location: "Alligator Pond, St. Elizabeth",
    parish: "St. Elizabeth",
    area: "Alligator Pond",
    category: "Seafood",
    publishedAt: "2026-02-28",
    readTime: "4 min read",
    rating: "WWH Approved",
    priceVibe: "$$",
    bestItem: "Garlic crab and roasted fish",
    worstItem: "Finding a parking spot on a holiday",
    valueRating: "Fair",
    waitTime: "45–60 mins",
    goodFor: "Road trips, big groups, seafood lovers",
    image: "/images/restaurants/little-ochie-st-elizabeth.jpg",
    images: [
      "/images/restaurants/little-ochie-st-elizabeth.jpg"
    ],
    videoUrl: "https://www.tiktok.com/embed/v2/7567890123456789012",
    verdict: "run-go-get-it",
    quote: "It's the definition of a Jamaican culinary pilgrimage. The garlic crab alone is worth the drive.",
    highlights: ["Right on the beach", "Fresh catch", "Unmatched vibes"],
    whatIOrdered: "Garlic crab, roasted fish, bammy, and festival.",
    whatSurprisedMe:
      "Despite its massive popularity and scale, they haven't compromised on the seasoning. The garlic sauce is still lethal.",
    honestTake:
      "Little Ochie is an institution. You go, you wait, you drink a beer on the black sand, and you eat some of the most aggressively flavourful seafood on the island. The wait times can be brutal, but the food delivers on the promise.",
    contentSections: [
      {
        heading: "The Experience",
        text: "You pick your fish, you tell them how you want it, and you wait. The boats are literally right there. It doesn't get fresher."
      },
      {
        heading: "The Food",
        text: "The garlic crab is the star of the show. It's messy, it's spicy, and it's perfect. The roasted fish and bammy hold it down solidly."
      }
    ],
    isHiddenGem: false,
    isFeatured: true
  },
  {
    slug: "juici-patties-clarendon",
    title: "Juici Patties Clarendon: The Original Still Holds Up",
    dek: "Going back to where the empire started. Does the flagship taste better than the branches?",
    seoTitle: "Juici Patties Original Clarendon Review — WhenWiHungry",
    seoDescription:
      "WhenWiHungry reviews the original Juici Patties in Clarendon. Does the flagship location taste better?",
    restaurant: "Juici Patties",
    location: "Clarendon",
    parish: "Clarendon",
    area: "Clarendon",
    category: "Patty",
    publishedAt: "2026-01-20",
    readTime: "3 min read",
    rating: "Worth It",
    priceVibe: "$",
    bestItem: "Beef patty and coco bread",
    worstItem: "The lunch rush line",
    valueRating: "High",
    waitTime: "10–15 mins",
    goodFor: "Road trips, quick breakfast, consistent quality",
    image: "/images/restaurants/juici-patties-original-clarendon.jpg",
    images: [
      "/images/restaurants/juici-patties-original-clarendon.jpg"
    ],
    videoUrl: "https://www.tiktok.com/embed/v2/7678901234567890123",
    verdict: "worth-it",
    quote: "There's a reason they built an empire off this patty. At the original location, you can taste why.",
    highlights: ["Fresh out the oven", "Classic taste", "Fast service"],
    whatIOrdered: "Beef patty in a coco bread, box juice to wash it down.",
    whatSurprisedMe:
      "The filling-to-crust ratio at this specific location feels more generous than the city branches.",
    honestTake:
      "Juici Patties is the standard for a reason. While quality can vary from branch to branch across the island, the Clarendon location keeps the flag flying high. The crust is properly flaky, the beef is seasoned aggressively, and the coco bread is soft enough to soak up the glory.",
    contentSections: [
      {
        heading: "The Heritage",
        text: "This is where it all started. Eating a patty here feels like you're tapping into a piece of modern Jamaican food history."
      },
      {
        heading: "The Patty",
        text: "Consistently good. The crust flakes exactly how it should, and the filling hits that familiar, comforting note you expect."
      }
    ],
    isHiddenGem: false,
    isFeatured: false
  }
];
