// Ingredient nutrition database for JoMama's Recipes.
//
// Keyed by ingredient name (lowercase), matching the `name` field of
// structured ingredient entries in recipes-data.js as closely as possible.
// Values are per 100g (solids, by weight) or per 100ml (liquids, by volume) -
// see the `per` field on each entry.
//
// Fields:
//   per:         "100g" or "100ml"
//   calories:    calories per 100g/100ml
//   protein:     grams of protein per 100g/100ml
//   fat:         grams of fat per 100g/100ml
//   fiber:       grams of fiber per 100g/100ml
//   carbs:       grams of TOTAL carbs per 100g/100ml (net carbs = carbs - fiber)
//   unitWeights: grams per count-unit, e.g. { egg: 50, clove: 3 }. Empty {}
//                if this ingredient is never measured by count.
//   verified:    true once the user has confirmed these numbers
//   source:      free-text note on where the numbers came from
//
// No sodium field - this site only tracks calories, protein, fat, fiber and
// carbs.
//
// ---------------------------------------------------------------------------
// HOW TO ADD INGREDIENTS TO THIS DATABASE (for future Claude sessions)
// ---------------------------------------------------------------------------
// 1. Scan recipes-data.js for ingredient `name` values that are NOT yet a key
//    in this file.
//
// 2. For each missing ingredient, look up nutrition per 100g (or per 100ml
//    for liquids) using a reliable source - USDA FoodData Central is
//    preferred for whole/raw ingredients. For branded or processed products
//    (e.g. "Barilla Protein+ pasta", "light butter / Smart Balance"), use the
//    brand's own nutrition label values.
//
// 3. For ingredients that recipes measure by count (eggs, garlic cloves,
//    green onions, slices of bacon, etc.), also add a typical weight-per-unit
//    to `unitWeights`.
//
// 4. For ingredients a recipe measures by VOLUME (cups, tbsp, tsp) but that
//    aren't naturally liquid (flour, sugar, honey, shredded cheese), add a
//    density entry (grams per ml) to data/units.js -> densities.
//
// 5. Add the new entry with `verified: false` and a `source` note describing
//    where the numbers came from.
//
// 6. Batch up new entries (suggest 10-15 at a time) and present them to the
//    user as a simple table: ingredient name | calories | protein | fat |
//    fiber | carbs | unit weight (if applicable) | source. Ask the user to
//    confirm or correct each value - especially for branded/processed
//    products where exact values vary by brand and the user may have a
//    specific product in mind.
//
// 7. Once the user confirms a batch, set `verified: true` for those entries
//    (updating values per their feedback first, if needed).
//
// 8. Repeat in batches until the ingredients used across recipes all have
//    verified entries. Unverified entries can still be used for rough
//    estimates by a future "computed nutrition" feature, but should be
//    visually flagged (e.g. with an asterisk) until verified.
// ---------------------------------------------------------------------------
window.ingredientNutrition = {
  "ground beef (80/20)": {
    per: "100g",
    calories: 254,
    protein: 17,
    fat: 20,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "USDA FoodData Central, raw 80/20 ground beef"
  },

  "egg": {
    per: "100g",
    calories: 143,
    protein: 13,
    fat: 10,
    fiber: 0,
    carbs: 1.1,
    unitWeights: { egg: 50 },
    verified: false,
    source: "USDA, 1 large egg ~ 50g edible portion"
  },

  "garlic": {
    per: "100g",
    calories: 149,
    protein: 6.4,
    fat: 0.5,
    fiber: 2.1,
    carbs: 31,
    unitWeights: { clove: 3 },
    verified: false,
    source: "USDA"
  }
};
