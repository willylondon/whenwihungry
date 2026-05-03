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
  }
];
