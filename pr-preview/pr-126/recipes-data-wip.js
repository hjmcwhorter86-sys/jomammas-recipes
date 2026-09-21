// Work-in-progress recipes: things that have actually been made but aren't
// ready for the main site (no photo, no final ingredient list, still being
// tweaked). Gated behind the `wipRecipes` feature flag; rendered by
// wip-recipes.js on wip-recipes.html. Kept in a separate file/array from
// window.recipes (recipes-data.js) so a half-working recipe never has a
// chance to show up in the main list, search, or categories.
//
// Each entry:
//   id:          string    - unique slug
//   title:       string
//   dateAdded:   string    - "YYYY-MM-DD"
//   servings:    string | null
//   source:      string | null - where the recipe came from, e.g. "Claude chat"
//   ingredients: (string | { title: string, items: string[] })[]
//                             - freeform, one line each; no structured
//                             qty/unit needed since these aren't going
//                             through nutrition calculations. Use the
//                             {title, items} form to group ingredients
//                             into labeled sections (e.g. "Grits" /
//                             "Shrimp") when a recipe has more than one
//                             component; plain strings render as a single
//                             flat list.
//   steps:       string[]  - freeform, optional; omit or leave empty if not
//                             worth writing out yet
//   whatWorked:  string[]  - what turned out well, keep for next time
//   needsWork:   string[]  - what to fix before this becomes a real recipe
//   notes:       string | null - anything else worth remembering

window.wipRecipes = [
  {
    id: "cajun-shrimp-and-cheesy-grits",
    title: "Cajun Shrimp and Cheesy Grits",
    dateAdded: "2026-09-21",
    servings: "4",
    source: "Claude chat",
    ingredients: [
      {
        title: "Grits",
        items: [
          "1 cup quick grits",
          "3 cups water",
          "1 cup milk",
          "1/2 cup heavy cream",
          "4 tbsp butter, divided",
          "3/4 cup parmesan, grated",
          "4 oz sliced Gouda, torn into pieces",
          "3/4 tsp salt",
        ],
      },
      {
        title: "Shrimp",
        items: [
          "1 lb large shrimp, peeled and deveined, thawed",
          "1 tbsp Cajun seasoning (use less if using a salty blend like Slap Ya Mama)",
          "3 garlic cloves, minced",
          "1/2 cup heavy cream",
          "1/4 cup parmesan, grated",
          "1 lemon, juiced",
          "2 green onions, sliced, for garnish",
        ],
      },
    ],
    steps: [
      "Pat the shrimp dry and toss with the Cajun seasoning in a bowl. Set aside while you start the grits.",
      "In a saucepan, bring the water, milk, and salt to a boil. Whisk in the grits slowly to avoid clumps.",
      "Reduce heat to low and simmer, stirring often, until thick and creamy, about 7 minutes.",
      "Stir in the heavy cream, 2 tbsp of the butter, parmesan, and Gouda until fully melted and smooth. Taste and add more salt if needed. Cover and keep warm on the lowest heat, stirring occasionally.",
      "Melt the remaining butter in a large skillet over medium-high heat. Add the seasoned shrimp in a single layer and cook until pink and just opaque, about 3 minutes.",
      "Add the garlic to the skillet and stir for about 30 seconds until fragrant. Remove shrimp to a plate.",
      "Pour the heavy cream into the same skillet, scraping up any browned bits. Simmer until it thickens slightly, about 2 minutes.",
      "Stir in the parmesan until melted, then squeeze in the lemon juice. Return the shrimp to the skillet and toss to coat in the sauce.",
      "Spoon the cheesy grits into bowls, top with shrimp and sauce, and scatter green onions on top.",
    ],
    whatWorked: [
      "Shrimp and sauce are a keeper as written.",
    ],
    needsWork: [
      "Grits came out soupy, too much liquid for the amount of cheese added. Rework the grits ratio next time, maybe start with Sunny Anderson's cheesy grits base instead and just swap in the shrimp from this recipe.",
    ],
    notes: null,
  },
];
