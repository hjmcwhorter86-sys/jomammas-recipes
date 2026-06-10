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
  },

  // Ingredient-specific densities (grams per milliliter), for converting a
  // volume measurement (e.g. "1 cup flour") into grams when nutrition is
  // stored per 100g. Keyed by ingredient name (lowercase), matching keys in
  // data/ingredient-nutrition.js.
  densities: {
    "honey": 1.42,
    "all-purpose flour": 0.53,
    "granulated sugar": 0.85,
    "vegetable oil": 0.92,
  }
};
