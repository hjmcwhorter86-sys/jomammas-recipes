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
//   source:      string | null - where the recipe came from, e.g. "Claude chat"
//   ingredients: string[]  - freeform, one line each; no structured qty/unit
//                             needed since these aren't going through
//                             nutrition calculations
//   steps:       string[]  - freeform, optional; omit or leave empty if not
//                             worth writing out yet
//   whatWorked:  string[]  - what turned out well, keep for next time
//   needsWork:   string[]  - what to fix before this becomes a real recipe
//   notes:       string | null - anything else worth remembering

window.wipRecipes = [];
