// Feature flag registry for JoMama's Recipes.
//
// Each entry is a flag and its default state. The default is what
// everyone gets unless they've flipped a personal override on the flags
// page (flags.html). "Rolling out" a feature means changing its default to
// `true` here; once everyone's on it, delete the flag and the code path it
// gates.
//
// Don't read this object directly in app code — use
// window.flagsService.isEnabled('flagName'), which layers in overrides.
window.featureFlags = {
  showComputedNutrition: {
    label: "Computed nutrition facts",
    description: "Show nutrition facts computed from structured ingredients, instead of (or alongside) the manually entered fields.",
    default: false,
  },

  servingSizeScaling: {
    label: "Serving size scaling",
    description: "Let visitors change a recipe's serving count on the detail page and scale ingredient quantities accordingly.",
    default: false,
  },
};
