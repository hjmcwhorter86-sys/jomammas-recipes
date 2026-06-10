// Feature flags for JoMama's Recipes.
//
// Flip a flag to `true` once the corresponding feature is built and ready to
// show on the live site. Always read flags with `?.` and a default so a
// missing flag doesn't break anything:
//   if (window.featureFlags?.showComputedNutrition) { ... }
window.featureFlags = {
  // Show nutrition facts computed from structured ingredients +
  // data/ingredient-nutrition.js, instead of (or alongside) the manually
  // entered recipe.calories/protein/etc. fields.
  showComputedNutrition: false,

  // Let visitors change a recipe's serving count on the detail page and
  // scale ingredient quantities accordingly.
  servingSizeScaling: false,
};
