// Adrien's Baking Corner recipes. Same object shape as recipes-data.js (see
// that file's top-of-file comment for the full ingredient schema: qty,
// qtyMax, unit, name, notes, approx, optional, altQty/altUnit/altName,
// display, note, guideLink), plus one extra optional field used only here:
//
//   adrienNotes: string | null - Adrien's own beginner tips or "what I'd do
//                                differently" notes. Rendered as a
//                                highlighted callout on the recipe page.
//                                Leave null/omit until there's something to
//                                say.
//
// This file is loaded only on abc.html and abc-recipe-detail.html, so these
// recipes stay separate from the main site's recipes-list.html, search, and
// homepage — they only ever appear on Adrien's own pages.

window.adrienRecipes = [];
