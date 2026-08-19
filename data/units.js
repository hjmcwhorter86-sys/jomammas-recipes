// Shared unit conversion table for JoMama's Recipes.
//
// Used by app.js to display the correct singular/plural unit (e.g. "1 cup"
// vs "2 cups"), and will be used by future serving-scaling and nutrition
// calculation features to convert between units.
//
// Recipe ingredient `unit` values should always use the canonical singular
// key from `volume.units`, `mass.units`, or `countUnits` below (e.g. "cup",
// "tbsp", "g", "lb", "clove"), never a plural or alias form.
window.unitConversions = {
  // Volume units, converted to a base unit of milliliters (ml).
  volume: {
    base: "ml",
    units: {
      ml:   { toBase: 1,        plural: "ml",    aliases: ["ml", "milliliter", "milliliters"] },
      l:    { toBase: 1000,     plural: "l",     aliases: ["l", "liter", "liters"] },
      tsp:  { toBase: 4.92892,  plural: "tsp",   aliases: ["tsp", "teaspoon", "teaspoons"] },
      tbsp: { toBase: 14.7868,  plural: "tbsp",  aliases: ["tbsp", "Tbsp", "tablespoon", "tablespoons"] },
      cup:  { toBase: 236.588,  plural: "cups",  aliases: ["cup", "cups"] },
      "fl oz": { toBase: 29.5735, plural: "fl oz", aliases: ["fl oz", "fluid ounce", "fluid ounces"] },
    }
  },

  // Mass/weight units, converted to a base unit of grams (g).
  mass: {
    base: "g",
    units: {
      g:  { toBase: 1,        plural: "g",   aliases: ["g", "gram", "grams"] },
      kg: { toBase: 1000,     plural: "kg",  aliases: ["kg", "kilogram", "kilograms"] },
      oz: { toBase: 28.3495,  plural: "oz",  aliases: ["oz", "ounce", "ounces"] },
      lb: { toBase: 453.592,  plural: "lbs", aliases: ["lb", "lbs", "pound", "pounds"] },
    }
  },

  // Count-based units: no conversion factor between them. To use these in
  // nutrition math, look up grams-per-unit in
  // ingredientNutrition[name].unitWeights[unit] (see data/ingredient-nutrition.js).
  countUnits: {
    clove: { plural: "cloves" },
    slice: { plural: "slices" },
    can:   { plural: "cans" },
    stick: { plural: "sticks" },
    bunch: { plural: "bunches" },
    packet: { plural: "packets" },
    bag:   { plural: "bags" },
  },

  // Ingredient-specific densities (grams per milliliter), for converting a
  // volume measurement (e.g. "1 cup flour") into grams when nutrition is
  // stored per 100g. Keyed by ingredient name (lowercase), matching keys in
  // data/ingredient-nutrition.js.
  densities: {
    "honey": 1.42,
    "flour": 0.51,
    "garlic powder": 0.61,
    "onion powder": 0.49,
    "sriracha": 1,
    "kosher salt": 1,
    "black pepper": 0.47,
    "paprika": 0.46,
    "light butter": 0.96,
    "sodium citrate": 0.9,
    "light margarine": 0.95,
    "diced pickled jalapeños": 1,
    "low fat cottage cheese": 0.955,
    "nonfat greek yogurt": 1.035,
    "ketchup": 1.05,
    "mustard": 1,
    "yellow mustard": 1,
    "olive oil": 0.92,
    "better than bouillon seasoned lobster base": 1.15,
    "tomato paste": 1.12,
    "minced lobster meat": 0.63,
    "cornstarch": 0.54,
    "avocado oil": 0.92,
    "iron kitchen general tso's sauce": 1.18,
    "italian style breadcrumbs": 0.46,
    "parmesan": 0.42,
    "reduced fat shredded mozzarella": 0.48,
    "unsalted butter": 0.95,
    "shredded cheddar": 0.48,
    "ground cumin": 0.43,
    "crumbled blue cheese": 0.61,
    "ranch or blue cheese dressing": 1.01,
    "smoked paprika": 0.46,
    "sweet baby ray's sugar free bbq sauce": 1.1,
    "fresh spinach": 0.127,
    "sun dried tomatoes": 0.23,
    "italian seasoning": 0.3,
    "oyster sauce": 1.22,
    "hoisin sauce": 1.22,
    "sesame oil": 0.92,
    "shredded cooked chicken": 0.59,
    "ranch seasoning": 0.47,
    "shredded mozzarella cheese": 0.48,
    "panko breadcrumbs": 0.21,
    "cinnamon": 0.53,
    "brown sugar": 0.93,
    "cherry or grape tomatoes": 0.63,
    "salted butter": 0.95,
    "cocoa powder": 0.36,
    "salt": 1.2,
    "garam masala": 0.41,
    "curry powder": 0.43,
    "chili powder": 0.47,
    "dry basmati rice": 0.8,
    "dijon mustard": 1.06,
    "red pepper flakes": 0.45,
    "chicken base": 1.15,
    "sugar": 0.81,
    "dried oregano": 0.2,
    "mayonnaise": 0.93,
    "sour cream": 0.97,
    "cayenne pepper": 0.37,
    "cotija cheese": 0.51,
    "fresh cilantro": 0.07,
    "toasted sesame oil": 0.92,
    "fresh ginger": 0.41,
    "jasmine rice": 0.8,
    "sesame seeds": 0.61,
    "neutral oil": 0.92,
    "gochujang": 1.22,
    "cooked jasmine rice": 0.67,
    "garlic": 0.91,
    "jarred minced garlic": 1.0,
    "fresh chopped parsley": 0.26,
    "macaroni": 0.42,
    "light cream cheese": 0.98,
    "nutmeg": 0.45,
    "vegetable oil": 0.92,
    "sweet onion": 0.64,
    "white pepper": 0.45,
    "green onions": 0.45,
    "hatch green chiles": 1.0,
    "capers": 0.51,
    "ham": 0.59,
    "taco seasoning": 0.61,
    "baby crispy green leaf lettuce": 0.136,
    "reduced fat fiesta blend cheese": 0.47,
    "crispy tortilla strips": 0.24,
    "fresh thyme leaves": 0.2,
    "fresh sage": 0.15,
  },

  // Preferred display units for the US/Metric units toggle (units-service.js).
  // For a quantity converted to its base unit (grams for mass, ml for
  // volume), pick the first entry whose `maxBase` the amount is below;
  // the last entry (maxBase: Infinity) is the fallback for large amounts.
  displayUnits: {
    us: {
      mass:   [ { unit: "oz", maxBase: 453.592 }, { unit: "lb", maxBase: Infinity } ],
      volume: [ { unit: "tsp", maxBase: 14.7868 }, { unit: "tbsp", maxBase: 59.1471 }, { unit: "cup", maxBase: Infinity } ],
    },
    metric: {
      mass:   [ { unit: "g", maxBase: 1000 }, { unit: "kg", maxBase: Infinity } ],
      volume: [ { unit: "ml", maxBase: 1000 }, { unit: "l", maxBase: Infinity } ],
    }
  }
};
