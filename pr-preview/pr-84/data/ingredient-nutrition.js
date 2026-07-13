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
  "ground beef (93/7)": {
    per: "100g",
    calories: 152,
    protein: 20.5,
    fat: 7.1,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "93/7 lean ground beef label: 170 cal / 8g fat / 0g carbs / 23g protein per 4 oz (112g), per user-provided photo. Canonical for all ground beef per user (recipes standardize on lean 93/7)."
  },

  "egg": {
    per: "100g",
    calories: 120,
    protein: 12,
    fat: 8,
    fiber: 0,
    carbs: 0,
    unitWeights: { egg: 50 },
    verified: true,
    source: "Eggland's Best large eggs label: 60 cal / 4g fat / 6g protein / 0g carbs per 1 egg (50g), per user-provided photo"
  },

  "garlic": {
    per: "100g",
    calories: 149,
    protein: 6.4,
    fat: 0.5,
    fiber: 2.1,
    carbs: 33.1,
    unitWeights: { clove: 3 },
    verified: true,
    source: "USDA FoodData Central, raw garlic — confirmed by user (fresh cloves, no commercial label applies). Jarred minced garlic is a separate, more dilute entry."
  },
  "jarred minced garlic": {
    per: "100g",
    calories: 100,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 20,
    unitWeights: {},
    verified: true,
    source: "Great Value Minced Garlic (jarred) label: 5 cal / 0g fat / 0g protein per 1 tsp (5g); carbs ~1g/serving derived from the 5 cal (label carb line was partly obscured). Per user-provided photo."
  },
  "chicken breast": {
    per: "100g",
    calories: 98,
    protein: 22.3,
    fat: 0.9,
    fiber: 0,
    carbs: 0,
    unitWeights: { "chicken breast": 170 },
    verified: true,
    source: "Perdue thin-sliced boneless skinless chicken breast label: 110 cal / 1g fat / 0g carbs / 25g protein per 4 oz (112g), per user-provided photo. User confirms same per-lb values as any boneless skinless breast."
  },
  "chicken tenders": {
    per: "100g",
    calories: 120,
    protein: 22.5,
    fat: 2.6,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "flour": {
    per: "100g",
    calories: 367,
    protein: 10,
    fat: 0,
    fiber: 2.7,
    carbs: 76.7,
    unitWeights: {},
    verified: true,
    source: "Bleached all-purpose wheat flour label: 110 cal / 0g fat / 23g carbs / <1g fiber / 3g protein per 1/4 cup (30g), per user-provided photo (fiber ~2.7g/100g per USDA, label rounds to <1g/serving)"
  },
  "cornflakes": {
    per: "100g",
    calories: 357,
    protein: 7.5,
    fat: 0.4,
    fiber: 3,
    carbs: 84,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "garlic powder": {
    per: "100g",
    calories: 331,
    protein: 16.6,
    fat: 0.7,
    fiber: 9,
    carbs: 72.7,
    unitWeights: {},
    verified: true,
    source: "USDA reference, garlic powder (~331 cal/100g, negligible at recipe amounts). User opted not to label-check."
  },
  "onion powder": {
    per: "100g",
    calories: 341,
    protein: 10.4,
    fat: 1,
    fiber: 15.2,
    carbs: 79.1,
    unitWeights: {},
    verified: true,
    source: "USDA reference, onion powder (~341 cal/100g, negligible at recipe amounts). User opted not to label-check."
  },
  "sweet chili sauce": {
    per: "100g",
    calories: 200,
    protein: 0.5,
    fat: 0.2,
    fiber: 0.5,
    carbs: 49,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "sriracha": {
    per: "100g",
    calories: 93,
    protein: 1.9,
    fat: 0.9,
    fiber: 1,
    carbs: 19,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "honey": {
    per: "100g",
    calories: 286,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 81,
    unitWeights: {},
    verified: true,
    source: "Great Value honey label: 60 cal / 0g fat / 17g carbs / 0g protein per 1 tbsp (21g), per user-provided photo"
  },
  "kosher salt": {
    per: "100g",
    calories: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Sodium chloride — 0 calories/macros. User-confirmed."
  },
  "black pepper": {
    per: "100g",
    calories: 251,
    protein: 10.4,
    fat: 3.3,
    fiber: 25.3,
    carbs: 64,
    unitWeights: {},
    verified: true,
    source: "USDA reference, ground black pepper (~251 cal/100g but ~3 cal per tsp — negligible at recipe amounts). User opted not to label-check."
  },
  "paprika": {
    per: "100g",
    calories: 282,
    protein: 14.1,
    fat: 12.7,
    fiber: 35,
    carbs: 54,
    unitWeights: {},
    verified: true,
    source: "USDA reference, paprika (~282 cal/100g, negligible at recipe amounts). User opted not to label-check."
  },
  "light butter": {
    per: "100g",
    calories: 357,
    protein: 1,
    fat: 40,
    fiber: 0,
    carbs: 1,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "protein pasta": {
    per: "100g",
    calories: 340,
    protein: 17,
    fat: 2,
    fiber: 10,
    carbs: 68,
    unitWeights: {},
    verified: true,
    source: "Barilla Protein+ pasta label (angel hair & penne, identical): per 100g 340 cal / 17g protein / 2g fat / 10g fiber / 68g carbs, per user-provided photo"
  },
  "1% milk": {
    per: "100ml",
    calories: 42,
    protein: 3.4,
    fat: 1,
    fiber: 0,
    carbs: 5,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "sodium citrate": {
    per: "100g",
    calories: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "reduced fat parmesan": {
    per: "100g",
    calories: 350,
    protein: 36,
    fat: 18,
    fiber: 0,
    carbs: 4,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "skim milk": {
    per: "100ml",
    calories: 34,
    protein: 3.4,
    fat: 0.1,
    fiber: 0,
    carbs: 5,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "half and half": {
    per: "100ml",
    calories: 133,
    protein: 3.3,
    fat: 11.7,
    fiber: 0,
    carbs: 3.3,
    unitWeights: {},
    verified: true,
    source: "Great Value Half & Half label: 40 cal / 3.5g fat / 1g carbs / 1g protein per 2 tbsp (30mL), per user-provided photo"
  },
  "light margarine": {
    per: "100g",
    calories: 250,
    protein: 0,
    fat: 28.6,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "I Can't Believe It's Not Butter! Light buttery spread (27% oils) label: 35 cal / 4g fat / 0g carbs / 0g protein per 1 tbsp (14g), per user-provided photo"
  },
  "pepper jack cheese": {
    per: "100g",
    calories: 331,
    protein: 19,
    fat: 27,
    fiber: 0,
    carbs: 1,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "diced pickled jalapeños": {
    per: "100g",
    calories: 17,
    protein: 0.9,
    fat: 0.4,
    fiber: 2.2,
    carbs: 3,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "low fat cottage cheese": {
    per: "100g",
    calories: 72,
    protein: 12,
    fat: 1,
    fiber: 0,
    carbs: 4,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "nonfat greek yogurt": {
    per: "100g",
    calories: 59,
    protein: 10,
    fat: 0.4,
    fiber: 0,
    carbs: 3.6,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "box sugar free cheesecake or vanilla pudding mix": {
    per: "100g",
    calories: 320,
    protein: 4,
    fat: 0,
    fiber: 2,
    carbs: 76,
    unitWeights: { "box sugar free cheesecake or vanilla pudding mix": 26 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "scoop vanilla protein powder": {
    per: "100g",
    calories: 380,
    protein: 75,
    fat: 5,
    fiber: 2,
    carbs: 8,
    unitWeights: { "scoop vanilla protein powder": 30 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "jordan's skinny syrup vanilla or vanilla caramel": {
    per: "100ml",
    calories: 5,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 2,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "ketchup": {
    per: "100g",
    calories: 112,
    protein: 1.1,
    fat: 0.2,
    fiber: 0.3,
    carbs: 27,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "mustard": {
    per: "100g",
    calories: 66,
    protein: 4,
    fat: 4,
    fiber: 3.3,
    carbs: 6,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "worcestershire sauce": {
    per: "100ml",
    calories: 78,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 19.5,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "olive oil": {
    per: "100g",
    calories: 884,
    protein: 0,
    fat: 100,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Filippo Berio Extra Virgin Olive Oil label: 120 cal / 14g fat / 0g carbs / 0g protein per 1 tbsp (15mL), per user-provided photo. Per-100g value is the standard 884 cal / 100g fat for culinary oils, consistent with the label within its rounding."
  },
  "packets brown gravy mix": {
    per: "100g",
    calories: 320,
    protein: 8,
    fat: 4,
    fiber: 2,
    carbs: 64,
    unitWeights: { "packets brown gravy mix": 25 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "hot water": {
    per: "100ml",
    calories: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "water": {
    per: "100ml",
    calories: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "dry white wine": {
    per: "100ml",
    calories: 82,
    protein: 0.1,
    fat: 0,
    fiber: 0,
    carbs: 2.6,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "better than bouillon seasoned lobster base": {
    per: "100g",
    calories: 100,
    protein: 8,
    fat: 2,
    fiber: 0,
    carbs: 10,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "tomato paste": {
    per: "100g",
    calories: 91,
    protein: 3,
    fat: 0,
    fiber: 3,
    carbs: 18.2,
    unitWeights: {},
    verified: true,
    source: "Great Value Tomato Paste label: 30 cal / 0g fat / 6g carbs / 1g fiber / 1g protein per 2 tbsp (33g), per user-provided photo"
  },
  "minced lobster meat": {
    per: "100g",
    calories: 89,
    protein: 19,
    fat: 0.9,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "cornstarch": {
    per: "100g",
    calories: 381,
    protein: 0.3,
    fat: 0.1,
    fiber: 0.9,
    carbs: 91.3,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "avocado oil": {
    per: "100g",
    calories: 884,
    protein: 0,
    fat: 100,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Great Value Refined Avocado Oil label: 130 cal / 14g fat / 0g carbs / 0g protein per 1 tbsp (15mL), per user-provided photo. Per-100g value is the standard 884 cal / 100g fat for culinary oils (label's 130 is brand rounding of 14g fat)."
  },
  "iron kitchen general tso's sauce": {
    per: "100g",
    calories: 150,
    protein: 1,
    fat: 1,
    fiber: 0.5,
    carbs: 33,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "italian style breadcrumbs": {
    per: "100g",
    calories: 395,
    protein: 12,
    fat: 5,
    fiber: 3.5,
    carbs: 72,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "parmesan": {
    per: "100g",
    calories: 393,
    protein: 32.1,
    fat: 25,
    fiber: 0,
    carbs: 3.6,
    unitWeights: {},
    verified: true,
    source: "BelGioioso Parmesan (block, grated by user) label: 110 cal / 7g fat / 1g carbs / 9g protein per 1in cube (28g), per user-provided photo"
  },
  "marinara": {
    per: "100ml",
    calories: 50,
    protein: 1.5,
    fat: 2,
    fiber: 1.5,
    carbs: 7,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "reduced fat shredded mozzarella": {
    per: "100g",
    calories: 286,
    protein: 21.4,
    fat: 21.4,
    fiber: 0,
    carbs: 7.1,
    unitWeights: {},
    verified: true,
    source: "Reduced-fat low-moisture part-skim shredded mozzarella label: 80 cal / 6g fat / 2g carbs / 6g protein per 1/4 cup (28g), per user-provided photo"
  },
  "unsalted butter": {
    per: "100g",
    calories: 714,
    protein: 0,
    fat: 78.6,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Great Value unsalted butter (blue box) label: 100 cal / 11g fat / 0g carbs / 0g protein per 1 tbsp (14g), per user-provided photo"
  },
  "cream cheese": {
    per: "100g",
    calories: 342,
    protein: 6,
    fat: 34,
    fiber: 0,
    carbs: 4,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "shredded cheddar": {
    per: "100g",
    calories: 393,
    protein: 25,
    fat: 32.1,
    fiber: 0,
    carbs: 3.6,
    unitWeights: {},
    verified: true,
    source: "Great Value mild shredded cheddar label: 110 cal / 9g fat / 1g carbs / 7g protein per 1/3 cup (28g), per user-provided photo"
  },
  "ground cumin": {
    per: "100g",
    calories: 375,
    protein: 17.7,
    fat: 22.3,
    fiber: 10.5,
    carbs: 44.2,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "corn or flour tortillas": {
    per: "100g",
    calories: 218,
    protein: 5.7,
    fat: 5.5,
    fiber: 2.4,
    carbs: 36.7,
    unitWeights: { "corn or flour tortillas": 45 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "crumbled blue cheese": {
    per: "100g",
    calories: 353,
    protein: 21,
    fat: 29,
    fiber: 0,
    carbs: 2.3,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "ranch or blue cheese dressing": {
    per: "100g",
    calories: 450,
    protein: 1,
    fat: 47,
    fiber: 0,
    carbs: 5,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "large russet potatoes": {
    per: "100g",
    calories: 77,
    protein: 2,
    fat: 0.1,
    fiber: 2.2,
    carbs: 17.5,
    unitWeights: { "large russet potatoes": 300 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "smoked paprika": {
    per: "100g",
    calories: 282,
    protein: 14.1,
    fat: 12.7,
    fiber: 35,
    carbs: 54,
    unitWeights: {},
    verified: true,
    source: "USDA reference, smoked paprika (~282 cal/100g, negligible at recipe amounts). User opted not to label-check."
  },
  "sweet baby ray's sugar free bbq sauce": {
    per: "100g",
    calories: 40,
    protein: 0,
    fat: 0,
    fiber: 1,
    carbs: 12,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "shallot": {
    per: "100g",
    calories: 72,
    protein: 2.5,
    fat: 0.1,
    fiber: 1.6,
    carbs: 16.8,
    unitWeights: { "shallot": 25 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "fresh spinach": {
    per: "100g",
    calories: 23,
    protein: 2.9,
    fat: 0.4,
    fiber: 2.2,
    carbs: 3.6,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "sun dried tomatoes": {
    per: "100g",
    calories: 258,
    protein: 14.1,
    fat: 2.9,
    fiber: 12.3,
    carbs: 55.8,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "reduced sodium chicken broth": {
    per: "100ml",
    calories: 8,
    protein: 1,
    fat: 0.3,
    fiber: 0,
    carbs: 0.5,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "white cooking wine": {
    per: "100ml",
    calories: 66.7,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Holland House White Cooking Wine label: 20 cal / 0g fat / 0g carbs / 0g protein per 2 tbsp (30mL), per user-provided photo"
  },
  "light cream cheese": {
    per: "100g",
    calories: 220,
    protein: 8,
    fat: 19,
    fiber: 0,
    carbs: 5,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "italian seasoning": {
    per: "100g",
    calories: 265,
    protein: 9.8,
    fat: 5.9,
    fiber: 28,
    carbs: 50,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "bag frozen stir fry vegetables": {
    per: "100g",
    calories: 30,
    protein: 1.5,
    fat: 0.2,
    fiber: 2.5,
    carbs: 6,
    unitWeights: { "bag frozen stir fry vegetables": 450 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "chicken breast cooked and sliced": {
    per: "100g",
    calories: 165,
    protein: 31,
    fat: 3.6,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "low sodium soy sauce": {
    per: "100ml",
    calories: 53,
    protein: 8,
    fat: 0.6,
    fiber: 0.8,
    carbs: 4.9,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "oyster sauce": {
    per: "100g",
    calories: 51,
    protein: 1.5,
    fat: 0.3,
    fiber: 0.3,
    carbs: 11,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "hoisin sauce": {
    per: "100g",
    calories: 220,
    protein: 2.4,
    fat: 3.4,
    fiber: 2,
    carbs: 44,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "sesame oil": {
    per: "100g",
    calories: 884,
    protein: 0,
    fat: 100,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "chicken broth": {
    per: "100ml",
    calories: 2,
    protein: 0.4,
    fat: 0,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Great Value Chicken Broth (regular) label: 5 cal / 0g fat / 0g carbs / 1g protein per 1 cup (240mL), per user-provided photo"
  },
  "full fat cottage cheese": {
    per: "100g",
    calories: 98,
    protein: 11,
    fat: 4.3,
    fiber: 0,
    carbs: 3.4,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "buffalo sauce": {
    per: "100ml",
    calories: 15,
    protein: 0.5,
    fat: 1,
    fiber: 0,
    carbs: 1,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "shredded cooked chicken": {
    per: "100g",
    calories: 190,
    protein: 25,
    fat: 9,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "milk": {
    per: "100ml",
    calories: 50,
    protein: 3.4,
    fat: 2,
    fiber: 0,
    carbs: 4.9,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "whole milk": {
    per: "100ml",
    calories: 61,
    protein: 3.2,
    fat: 3.3,
    fiber: 0,
    carbs: 4.8,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (USDA FoodData Central, whole milk 3.25% milkfat), unverified — pending user review"
  },
  "pork breakfast sausage": {
    per: "100g",
    calories: 375,
    protein: 16.1,
    fat: 33.9,
    fiber: 0,
    carbs: 3.6,
    unitWeights: {},
    verified: true,
    source: "Jimmy Dean Premium Pork Regular Breakfast Sausage Roll label: 210 cal / 19g fat / 0g fiber / 2g carb / 9g protein per 2oz cooked (56g) serving, per user-provided photo"
  },
  "ranch seasoning": {
    per: "100g",
    calories: 350,
    protein: 8,
    fat: 5,
    fiber: 3,
    carbs: 65,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "shredded mozzarella cheese": {
    per: "100g",
    calories: 393,
    protein: 25,
    fat: 32.1,
    fiber: 0,
    carbs: 3.6,
    unitWeights: {},
    verified: true,
    source: "Regular low-moisture part-skim shredded mozzarella label: 110 cal / 9g fat / 1g carbs / 7g protein per 1/3 cup (28g), per user-provided photo"
  },
  "panko breadcrumbs": {
    per: "100g",
    calories: 380,
    protein: 11,
    fat: 2,
    fiber: 2,
    carbs: 76,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "refrigerated buttermilk biscuits": {
    per: "100g",
    calories: 320,
    protein: 6,
    fat: 14,
    fiber: 1,
    carbs: 42,
    unitWeights: { "can": 340 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "cinnamon": {
    per: "100g",
    calories: 247,
    protein: 4,
    fat: 1.2,
    fiber: 53,
    carbs: 81,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "brown sugar": {
    per: "100g",
    calories: 380,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 98,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "cherry or grape tomatoes": {
    per: "100g",
    calories: 18,
    protein: 0.9,
    fat: 0.2,
    fiber: 1.2,
    carbs: 3.9,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "salted butter": {
    per: "100g",
    calories: 714,
    protein: 0,
    fat: 78.6,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Great Value salted butter (red box) label: 100 cal / 11g fat / 0g carbs / 0g protein per 1 tbsp (14g), per user-provided photo"
  },
  "vanilla extract": {
    per: "100ml",
    calories: 288,
    protein: 0.1,
    fat: 0.1,
    fiber: 0,
    carbs: 12.7,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "cocoa powder": {
    per: "100g",
    calories: 228,
    protein: 19.6,
    fat: 13.7,
    fiber: 33.2,
    carbs: 57.9,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "salt": {
    per: "100g",
    calories: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Table salt (sodium chloride) — 0 calories/macros. User-confirmed."
  },
  "boneless skinless chicken thighs": {
    per: "100g",
    calories: 119,
    protein: 20,
    fat: 4.7,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "small yellow onion": {
    per: "100g",
    calories: 40,
    protein: 1.1,
    fat: 0.1,
    fiber: 1.7,
    carbs: 9.3,
    unitWeights: { "small yellow onion": 110 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "tomato sauce": {
    per: "100g",
    calories: 24,
    protein: 1.2,
    fat: 0.1,
    fiber: 1,
    carbs: 5,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "garam masala": {
    per: "100g",
    calories: 379,
    protein: 15,
    fat: 14,
    fiber: 22,
    carbs: 56,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "curry powder": {
    per: "100g",
    calories: 325,
    protein: 14.3,
    fat: 14,
    fiber: 33.2,
    carbs: 55.8,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "chili powder": {
    per: "100g",
    calories: 282,
    protein: 13.5,
    fat: 14.3,
    fiber: 34.8,
    carbs: 50,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "heavy cream": {
    per: "100ml",
    calories: 333.3,
    protein: 0,
    fat: 33.3,
    fiber: 0,
    carbs: 6.7,
    unitWeights: {},
    verified: true,
    source: "Great Value Heavy Whipping Cream label: 50 cal / 5g fat / 1g carbs / 0g protein per 1 tbsp (15mL), per user-provided photo"
  },
  "jar garlic vodka sauce": {
    per: "100g",
    calories: 70,
    protein: 1.5,
    fat: 4,
    fiber: 1.5,
    carbs: 7,
    unitWeights: { "jar garlic vodka sauce": 680 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "ground italian style turkey": {
    per: "100g",
    calories: 150,
    protein: 20,
    fat: 8,
    fiber: 0.5,
    carbs: 2,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "dry basmati rice": {
    per: "100g",
    calories: 365,
    protein: 7.1,
    fat: 0.7,
    fiber: 1.3,
    carbs: 78,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "medium yellow onions": {
    per: "100g",
    calories: 40,
    protein: 1.1,
    fat: 0.1,
    fiber: 1.7,
    carbs: 9.3,
    unitWeights: { "medium yellow onions": 150 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "green bell pepper": {
    per: "100g",
    calories: 20,
    protein: 0.9,
    fat: 0.2,
    fiber: 1.7,
    carbs: 4.6,
    unitWeights: { "green bell pepper": 120 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "diced tomatoes": {
    per: "100g",
    calories: 18,
    protein: 0.9,
    fat: 0.1,
    fiber: 1.2,
    carbs: 4.3,
    unitWeights: { "can": 411 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "beef broth": {
    per: "100ml",
    calories: 7,
    protein: 1.1,
    fat: 0.2,
    fiber: 0,
    carbs: 0.2,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "red wine vinegar": {
    per: "100ml",
    calories: 19,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0.3,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "dijon mustard": {
    per: "100g",
    calories: 66,
    protein: 4,
    fat: 4,
    fiber: 3.3,
    carbs: 6,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "apple cider vinegar": {
    per: "100ml",
    calories: 21,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0.9,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "golden home ultra thin protein pizza crust": {
    per: "100g",
    calories: 280,
    protein: 24,
    fat: 6,
    fiber: 10,
    carbs: 40,
    unitWeights: { "golden home ultra thin protein pizza crust": 85 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "penne": {
    per: "100g",
    calories: 371,
    protein: 13,
    fat: 1.5,
    fiber: 3.2,
    carbs: 75,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "anchovy fillet": {
    per: "100g",
    calories: 131,
    protein: 20.4,
    fat: 4.8,
    fiber: 0,
    carbs: 0,
    unitWeights: { "anchovy fillet": 4 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "crushed tomatoes": {
    per: "100g",
    calories: 32,
    protein: 1.6,
    fat: 0.3,
    fiber: 1.5,
    carbs: 7.3,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "reserved pasta water": {
    per: "100ml",
    calories: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "large shrimp": {
    per: "100g",
    calories: 99,
    protein: 24,
    fat: 0.3,
    fiber: 0,
    carbs: 0.2,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "red pepper flakes": {
    per: "100g",
    calories: 333.3,
    protein: 16.7,
    fat: 16.7,
    fiber: 38.9,
    carbs: 61.1,
    unitWeights: {},
    verified: true,
    source: "Crushed Red Pepper label: 6 cal / 0.3g fat / 1.1g carbs / 0.7g fiber / 0.3g protein per 1 tbsp (1.8g), per user-provided photo"
  },
  "tomato juice": {
    per: "100g",
    calories: 17,
    protein: 0.8,
    fat: 0.1,
    fiber: 0.4,
    carbs: 4.2,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "chicken base": {
    per: "100g",
    calories: 100,
    protein: 8,
    fat: 2,
    fiber: 0,
    carbs: 10,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "sugar": {
    per: "100g",
    calories: 375,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 100,
    unitWeights: {},
    verified: true,
    source: "Granulated sugar label: 30 cal / 8g total carbs (all sugar) / 0g everything else per 2 tsp (8g), per user-provided photo"
  },
  "cooking sherry": {
    per: "100ml",
    calories: 90,
    protein: 0.1,
    fat: 0,
    fiber: 0,
    carbs: 3.5,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "chuck roast": {
    per: "100g",
    calories: 240,
    protein: 17,
    fat: 19,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "vegetable oil": {
    per: "100g",
    calories: 884,
    protein: 0,
    fat: 100,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Great Value Vegetable Oil label: 120 cal / 14g fat / 0g carbs / 0g protein per 1 tbsp (14g), per user-provided photo. Per-100g value is the standard 884 cal / 100g fat for culinary oils."
  },
  "dried guajillo chiles": {
    per: "100g",
    calories: 280,
    protein: 11,
    fat: 4,
    fiber: 30,
    carbs: 50,
    unitWeights: { "dried guajillo chiles": 8 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "dried ancho chiles": {
    per: "100g",
    calories: 280,
    protein: 11,
    fat: 4,
    fiber: 30,
    carbs: 50,
    unitWeights: { "dried ancho chiles": 12 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "chipotle peppers in adobo sauce": {
    per: "100g",
    calories: 95,
    protein: 3.5,
    fat: 2.5,
    fiber: 10,
    carbs: 16,
    unitWeights: { "chipotle peppers in adobo sauce": 12 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "white onion": {
    per: "100g",
    calories: 40,
    protein: 1.1,
    fat: 0.1,
    fiber: 1.7,
    carbs: 9.3,
    unitWeights: { "white onion": 150 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "roma tomatoes": {
    per: "100g",
    calories: 18,
    protein: 0.9,
    fat: 0.2,
    fiber: 1.2,
    carbs: 3.9,
    unitWeights: { "roma tomatoes": 62 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "dried oregano": {
    per: "100g",
    calories: 265,
    protein: 9,
    fat: 4.3,
    fiber: 43,
    carbs: 69,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "bay leaves": {
    per: "100g",
    calories: 313,
    protein: 7.6,
    fat: 8.4,
    fiber: 26.3,
    carbs: 75,
    unitWeights: { "bay leaves": 0.2 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "ears of corn": {
    per: "100g",
    calories: 86,
    protein: 3.2,
    fat: 1.2,
    fiber: 2,
    carbs: 19,
    unitWeights: { "ears of corn": 90 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "mayonnaise": {
    per: "100g",
    calories: 680,
    protein: 1,
    fat: 75,
    fiber: 0,
    carbs: 0.6,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "sour cream": {
    per: "100g",
    calories: 198,
    protein: 2.4,
    fat: 19.4,
    fiber: 0,
    carbs: 4.6,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "cayenne pepper": {
    per: "100g",
    calories: 318,
    protein: 12,
    fat: 17.3,
    fiber: 27.2,
    carbs: 57,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "limes": {
    per: "100g",
    calories: 30,
    protein: 0.7,
    fat: 0.2,
    fiber: 2.8,
    carbs: 10.5,
    unitWeights: { "limes": 67 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "cotija cheese": {
    per: "100g",
    calories: 390,
    protein: 24,
    fat: 30,
    fiber: 0,
    carbs: 3,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "fresh cilantro": {
    per: "100g",
    calories: 23,
    protein: 2.1,
    fat: 0.5,
    fiber: 2.8,
    carbs: 3.7,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "soy sauce": {
    per: "100ml",
    calories: 53,
    protein: 8,
    fat: 0.6,
    fiber: 0.8,
    carbs: 4.9,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "toasted sesame oil": {
    per: "100g",
    calories: 884,
    protein: 0,
    fat: 100,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "fresh ginger": {
    per: "100g",
    calories: 80,
    protein: 1.8,
    fat: 0.8,
    fiber: 2,
    carbs: 18,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "jasmine rice": {
    per: "100g",
    calories: 365,
    protein: 7,
    fat: 0.6,
    fiber: 1.3,
    carbs: 80,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "rice vinegar": {
    per: "100ml",
    calories: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0.3,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "medium carrots": {
    per: "100g",
    calories: 41,
    protein: 0.9,
    fat: 0.2,
    fiber: 2.8,
    carbs: 10,
    unitWeights: { "medium carrots": 61 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "mini cucumber": {
    per: "100g",
    calories: 15,
    protein: 0.7,
    fat: 0.1,
    fiber: 0.5,
    carbs: 3.6,
    unitWeights: { "mini cucumber": 90 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "green onions": {
    per: "100g",
    calories: 32,
    protein: 1.8,
    fat: 0.2,
    fiber: 2.6,
    carbs: 7.3,
    unitWeights: { "green onions": 15, "bunch": 90 },
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "sesame seeds": {
    per: "100g",
    calories: 573,
    protein: 17.7,
    fat: 49.7,
    fiber: 11.8,
    carbs: 23.4,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "neutral oil": {
    per: "100g",
    calories: 884,
    protein: 0,
    fat: 100,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "gochujang": {
    per: "100g",
    calories: 170,
    protein: 4,
    fat: 1.5,
    fiber: 4,
    carbs: 35,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "cooked jasmine rice": {
    per: "100g",
    calories: 130,
    protein: 2.7,
    fat: 0.3,
    fiber: 0.4,
    carbs: 28.2,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "fresh chopped parsley": {
    per: "100g",
    calories: 36,
    protein: 3,
    fat: 0.8,
    fiber: 3.3,
    carbs: 6.3,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "macaroni": {
    per: "100g",
    calories: 371,
    protein: 13,
    fat: 1.5,
    fiber: 3.2,
    carbs: 75,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "low fat cheddar cheese": {
    per: "100g",
    calories: 280,
    protein: 30,
    fat: 16,
    fiber: 0,
    carbs: 2,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "nutmeg": {
    per: "100g",
    calories: 525,
    protein: 5.8,
    fat: 36.3,
    fiber: 20.8,
    carbs: 28,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "bacon": {
    per: "100g",
    calories: 461.5,
    protein: 38.5,
    fat: 34.6,
    fiber: 0,
    carbs: 0,
    unitWeights: { slice: 6.5 },
    verified: true,
    source: "Oscar Mayer Original Center Cut Bacon nutrition label (2 skillet-cooked slices = 13g serving), per user-provided photo"
  },
  "sweet onion": {
    per: "100g",
    calories: 40,
    protein: 1.1,
    fat: 0.1,
    fiber: 1.7,
    carbs: 9.3,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "white pepper": {
    per: "100g",
    calories: 296,
    protein: 10.4,
    fat: 2.1,
    fiber: 26.2,
    carbs: 68.6,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
  "angel hair pasta": {
    per: "100g",
    calories: 371,
    protein: 13,
    fat: 1.5,
    fiber: 3.2,
    carbs: 75,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values for dry pasta), unverified — pending user review"
  },
  "lemon juice": {
    per: "100ml",
    calories: 22,
    protein: 0.4,
    fat: 0.2,
    fiber: 0.3,
    carbs: 6.9,
    unitWeights: {},
    verified: true,
    source: "USDA FoodData Central, raw lemon juice — confirmed by user (fresh-squeezed, no commercial label applies)"
  },
  "hot sauce": {
    per: "100ml",
    calories: 12,
    protein: 0.5,
    fat: 0.4,
    fiber: 0.4,
    carbs: 2,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical Tabasco/Frank's RedHot style hot sauce label values), unverified — pending user review"
  },
  "white american cheese": {
    per: "100g",
    calories: 357,
    protein: 17.9,
    fat: 25,
    fiber: 0,
    carbs: 7.1,
    unitWeights: {},
    verified: true,
    source: "Land O Lakes White Pasteurized Process American Cheese Product label: 100 cal / 7g fat / 2g carbs / 0g fiber / 5g protein per 2 slices (28g), per user-provided photo"
  },
  "evaporated milk": {
    per: "100ml",
    calories: 133,
    protein: 6.7,
    fat: 6.7,
    fiber: 0,
    carbs: 10,
    unitWeights: {},
    verified: true,
    source: "Great Value Evaporated Milk label: 40 cal / 2g fat / 3g carbs / 0g fiber / 2g protein per 2 tbsp (30mL), per user-provided photo"
  },
  "hatch green chiles": {
    per: "100g",
    calories: 33,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 6.7,
    unitWeights: {},
    verified: true,
    source: "Hatch Select Chopped Green Chiles Mild label: 10 cal / 0g fat / 2g carbs / 0g fiber / 0g protein per 2 tbsp (30g), per user-provided photo"
  },
  "capers": {
    per: "100g",
    calories: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    carbs: 0,
    unitWeights: {},
    verified: true,
    source: "Great Value Non-Pareil Capers label: 0 cal / 0g fat / 0g carbs / 0g protein per 2 tbsp (15g), per user-provided photo"
  },
  "ham": {
    per: "100g",
    calories: 145,
    protein: 21,
    fat: 6,
    fiber: 0,
    carbs: 1.5,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (USDA FoodData Central, cured cooked ham ~11% fat), unverified — pending user review"
  },
  "swiss cheese": {
    per: "100g",
    calories: 380,
    protein: 26.9,
    fat: 27.8,
    fiber: 0,
    carbs: 5.4,
    unitWeights: {},
    verified: false,
    source: "Estimated by Claude (typical USDA FoodData Central / brand-label values), unverified — pending user review"
  },
};
