export type ReviewPost = {
  slug: string;
  title: string;
  dek: string;
  seoTitle: string;
  seoDescription: string;
  restaurant: string;
  parish: string;
  area: string;
  category: string;
  publishedAt: string;
  readTime: string;
  rating: string;
  priceVibe: string;
  bestOrder: string;
  goodFor: string;
  image: string;
  verdict: string;
  highlights: string[];
  body: Array<{
    heading: string;
    text: string;
  }>;
};

export const reviewPosts: ReviewPost[] = [
  {
    slug: "scotchies-mobay-jerk-worth-the-stop",
    title: "Scotchies Mobay: jerk worth the stop before the airport run",
    dek: "Smoke, heat, festival, and enough consistency to make this one easy to recommend.",
    seoTitle: "Scotchies Montego Bay Jerk Chicken Review",
    seoDescription:
      "A WhenWiHungry review of Scotchies in Montego Bay, covering the jerk chicken, festival, sauce, price vibe, and whether it is worth the stop.",
    restaurant: "Scotchies",
    parish: "St. James",
    area: "Montego Bay",
    category: "Jerk",
    publishedAt: "2026-04-28",
    readTime: "4 min read",
    rating: "WWH Approved",
    priceVibe: "$$",
    bestOrder: "Jerk chicken, festival, extra sauce",
    goodFor: "Airport runs, first-time visitors, reliable jerk cravings",
    image:
      "https://images.pexels.com/photos/27556985/pexels-photo-27556985.jpeg?auto=compress&cs=tinysrgb&w=1600",
    verdict: "Go for the jerk chicken, stay for the festival, and do not skip the sauce.",
    highlights: ["Worth the drive", "Bring cash", "Proper smoke"],
    body: [
      {
        heading: "The first bite",
        text:
          "The chicken has the kind of smoke you notice before the plate lands. It is not trying to be fancy. It is trying to be remembered."
      },
      {
        heading: "What worked",
        text:
          "The seasoning sits deep enough, the char gives it attitude, and the festival brings the sweet balance you want beside heat."
      },
      {
        heading: "Who should go",
        text:
          "This is for people who want a reliable jerk stop with energy. If you are passing through Mobay and need one safe recommendation, this is on the list."
      }
    ]
  },
  {
    slug: "dockside-fry-fish-port-royal",
    title: "Dockside Fry Fish: crispy fish, pepper sauce, and Port Royal breeze",
    dek: "A seafood stop that works because the plate, the view, and the lime all understand the assignment.",
    seoTitle: "Port Royal Fried Fish Review",
    seoDescription:
      "A WhenWiHungry review of Dockside Fry Fish in Port Royal, with notes on fried fish, bammy, pepper sauce, timing, and the final verdict.",
    restaurant: "Dockside Fry Fish",
    parish: "Kingston",
    area: "Port Royal",
    category: "Seafood",
    publishedAt: "2026-04-19",
    readTime: "3 min read",
    rating: "Go Hungry",
    priceVibe: "$$",
    bestOrder: "Fried fish, bammy, lime, pepper sauce",
    goodFor: "Slow weekends, seafood cravings, taking visitors out",
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1600&q=80",
    verdict: "Order the fried fish with bammy and ask for extra pepper sauce.",
    highlights: ["Sauce serious", "Sea breeze", "Weekend plate"],
    body: [
      {
        heading: "The plate",
        text:
          "The fish comes out crisp, hot, and simple in the best way. This is not a plate that needs twenty distractions."
      },
      {
        heading: "The sauce test",
        text:
          "A good pepper sauce should wake the plate up without bullying it. This one does the job."
      },
      {
        heading: "Best time to go",
        text:
          "Go when you have time to sit. The breeze is part of the review."
      }
    ]
  },
  {
    slug: "patties-on-point-half-way-tree",
    title: "Patties on Point: the quick bite that actually holds up",
    dek: "Flaky crust, spicy beef, cocoa bread nearby, and a lunch rush that makes sense.",
    seoTitle: "Half Way Tree Patty Review",
    seoDescription:
      "A WhenWiHungry review of Patties on Point in Half Way Tree, covering crust, beef filling, cocoa bread, lunch timing, and verdict.",
    restaurant: "Patties on Point",
    parish: "St. Andrew",
    area: "Half Way Tree",
    category: "Patties",
    publishedAt: "2026-04-10",
    readTime: "3 min read",
    rating: "Lunch Safe",
    priceVibe: "$",
    bestOrder: "Spicy beef patty with cocoa bread",
    goodFor: "Fast lunch, errands, quick comfort food",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    verdict: "A dependable patty run when you need food fast and still care.",
    highlights: ["Lunch safe", "Quick bite", "Cocoa bread ready"],
    body: [
      {
        heading: "The crust",
        text:
          "A patty lives or dies by the crust. This one gives you enough flake without turning into crumbs before the second bite."
      },
      {
        heading: "The filling",
        text:
          "The beef has enough pepper to feel alive. Not reckless, not boring."
      },
      {
        heading: "The move",
        text:
          "Get two if lunch is your only real meal before evening. One is a snack. Two is a plan."
      }
    ]
  }
];
