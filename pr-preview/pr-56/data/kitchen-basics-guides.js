// "Kitchen Basics" primer guides — reference pages that are too complex to fit
// the recipe-card/recipe-detail model (no ingredients or steps), but should
// still show up alongside recipes in the Kitchen Basics category grid.
//
// Each guide is rendered as a normal recipe-style card (app.js merges this
// list into `recipes`), but the card's `url` field points at its own
// standalone HTML page instead of recipe-detail.html.
window.kitchenBasicsGuides = [
  {
    id: "oils-and-fats",
    type: "guide",
    url: "kitchen-basics-oils-fats.html",
    title: "Oils & Fats 101",
    description: "Smoke points, flavor strength, and a healthy-fat spectrum — how to pick the right oil, butter, or fat for the job.",
    image: "images/fats-and-oils.png",
    category: "Kitchen Basics",
    tags: ["guide", "oils", "fats", "how to", "Kitchen Basics"],
  },
];
