import type { WrittenReview } from "./types";

const photo = (name: string, alt: string, caption: string) => ({ src: `/images/reviews/rok-hotel/${name}.jpg`, alt, caption });

export const rokReview = {
  number: 1,
  slug: "rok-hotel-kingston-comeback",
  path: "/reviews/rok-hotel-kingston-comeback",
  restaurant: "ROK Hotel Kingston",
  area: "Kingston",
  title: "Three hours waiting. One remarkable comeback.",
  seoTitle: "ROK Hotel Kingston Review: A Remarkable Comeback",
  dek: "A birthday lunch that went wrong. An invitation to return. And a Sunday meal that reminded me why a second chance can be worth taking.",
  teaser: "A birthday lunch that went wrong. An invitation to return. And a table that gave us something very different to talk about.",
  description: "An honest return to ROK Hotel Kingston: garlic cheese bread, pumpkin bisque, crab cakes and salmon — and the service that turned a disappointing visit around.",
  published: "2026-10-07",
  visited: "2026-10-04",
  readingMinutes: 4,
  verdict: "RUN_GO_GET_IT",
  hero: "/images/reviews/rok-hotel/salmon.jpg",
  heroAlt: "A browned salmon fillet over mashed potatoes and orange peri-peri sauce, with broccoli and vegetables",
  heroCaption: "The main event: salmon, mashed potatoes and peri-peri sauce. All photographs are from our visit.",
  scores: [{ label: "Food", value: "10/10" }, { label: "Service", value: "10/10" }],
  hosted: true,
  disclosureShort: "Complimentary return visit",
  disclosure: "ROK invited us back after a disappointing earlier visit. The October 4 meal was complimentary. These scores describe that hosted return visit, not an ordinary unannounced service.",
  body: [
    { type: "lead", text: "Would you go back to a restaurant after waiting three hours for your food? I did. But before we get to the golden bread, the crab cakes and that beautifully plated salmon, the first part of this story deserves its place at the table." },
    { type: "p", text: "A week earlier, we had gone to ROK Hotel Kingston to celebrate a birthday. We arrived at noon. After three o’clock, we still hadn’t been properly served. The service was rough, and the birthday guest never even received his meal. That is a hard way to remember a celebration." },
    { type: "p", text: "We raised the issue. ROK acknowledged that they had dropped the ball, gave us a substantial discount on that visit and invited us back. On Sunday, October 4, we returned. This time, they came correct." },
    { type: "h2", text: "A fresh start, straight from the kitchen" },
    { type: "p", text: "Executive Chef Oji Jaja personally treated us to a four-course experience. More than a chance to try another plate, this was an opportunity for the team to show what the visit could have been. From the supervisor to our waitress and the kitchen, the difference was enough for me to give the service a full 10 out of 10." },
    { type: "p", text: "The opening was milk garlic cheese bread: golden spirals with browned edges, piled together in a shallow bowl. Beside it came pumpkin bisque, a brilliant orange pool in a wide white bowl, finished with a small cluster of greens. The table was already making a very good argument for coming back." },
    { type: "pair", photos: [
      photo("bread", "Golden spirals of milk garlic cheese bread in a shallow bowl", "A golden beginning: milk garlic cheese bread."),
      photo("pumpkin-bisque", "Orange pumpkin bisque with a small garnish in a white bowl", "Pumpkin bisque, simply and elegantly presented.")
    ] },
    { type: "h2", text: "WhenWiHungry became WhenWiFull" },
    { type: "p", text: "Then came the crab cakes with spinach and tomato aioli. Their browned crusts, the glossy greens and that blue bowl made this one of the most inviting plates to photograph. There was colour, there was care in the presentation, and by this point there was considerably less room left for the next course." },
    { type: "photo", wide: true, photo: photo("crab-cakes", "Crab cakes with spinach, tomato aioli, microgreens and lime in a blue bowl", "Crab cakes, spinach and tomato aioli — a plate that deserved its close-up.") },
    { type: "quote", text: "“By this point, WhenWiHungry was WhenWiFull.”" },
    { type: "p", text: "The salmon arrived with mashed potatoes and peri-peri sauce: a deeply browned fillet against pale mash, green broccoli and a generous sweep of orange sauce. It looked ready for its moment. We, however, had reached our limit. We were so full that we had to box the main course." },
    { type: "p", text: "This was a generous meal. Even with the main course packed to go, my verdict on the experience was clear: 10 out of 10." },
    { type: "h2", text: "A passion-fruit finish" },
    { type: "p", text: "Dessert was a deconstructed passion-fruit pie with passion curd, cinnamon crumble, white-rum whipped cream, fresh blueberries and pavlova. Golden curd, small clouds of cream and dark berries gave the final plate a lovely contrast of colour. It was another reason to pause with the camera before reaching for a spoon." },
    { type: "photo", wide: true, photo: photo("passion-fruit", "Deconstructed passion-fruit dessert with crossed pavlova pieces, cream, blueberries and crumble", "The finale: deconstructed passion-fruit pie.") },
    { type: "h2", text: "Credit where it is due" },
    { type: "p", text: "My first two experiences at ROK were not the best. This visit does not erase them. It does show what happened when the team acknowledged a problem and made a deliberate effort to put it right." },
    { type: "p", text: "If I am going to speak about a disappointing experience, I should be just as willing to speak when the same team gets it right. To the supervisor, our lovely waitress, Chef Oji and everyone involved: you turned a bad experience into an amazing one. Third time really was a charm." }
  ],
  closing: {
    heading: "A comeback worth talking about.",
    scoresLine: "Food: 10/10. Service: 10/10.",
    paragraphs: [
      "Those are my scores for the October 4 return. The earlier disappointments were real, and so was the turnaround. This team earned its credit that Sunday.",
      "If a restaurant let you down, then invited you back to make it right, would you give it another chance?"
    ]
  },
  glance: {
    lines: ["October 4, 2026", "Kingston, Jamaica", "Complimentary return meal"],
    notes: [
      "2–4 King Street, Kingston. This review describes our meal at the hotel; it is not a review of an overnight stay.",
      "Menu and availability may change. No current menu prices are quoted in this review."
    ],
    officialLink: { href: "https://www.hilton.com/en/hotels/kinocup-rok-hotel-kingston/dining/", label: "Official dining information" }
  },
  address: { street: "2–4 King Street", locality: "Kingston", country: "JM" },
  placeSlug: "rok-hotel-kingston",
  parishSlug: "kingston"
} as const satisfies WrittenReview;
