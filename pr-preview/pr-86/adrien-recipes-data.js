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

window.adrienRecipes = [
  {
    id: "adriens-white-bread",
    title: "Adrien's White Bread",
    description: "A soft, golden white sandwich loaf kneaded in the stand mixer — Adrien's first bread recipe on the corner.",
    servings: "2 loaves (9x5 pans)",
    category: "Breads",
    image: "images/adriens-white-bread.png",
    dateAdded: "2026-07-15",
    calories: null,
    protein: null,
    fat: null,
    fiber: null,
    carbs: null,
    ingredients: [
      { qty: 2, unit: "cup", name: "water", notes: "warm, about 105°F" },
      { qty: 2, unit: "tbsp", name: "sugar" },
      { qty: 2, unit: "packet", name: "active dry yeast" },
      { qty: 4, unit: "tbsp", name: "unsalted butter", notes: "melted and slightly cooled" },

      { qty: 6, unit: "cup", name: "flour", notes: "all-purpose" },
      { qty: 2, unit: "tsp", name: "salt" },

      { qty: null, unit: null, name: "vegetable shortening", notes: "for greasing" },
    ],
    steps: [
      "Fit the stand mixer with the dough hook attachment. In the mixer bowl, combine the warm water, yeast, and sugar. Stir together and let stand about five minutes, or until foamy.",
      "Add the flour, butter, and salt to the yeast mixture. Mix on low speed for one to two minutes, until the dough forms a ball and releases from the sides of the bowl.",
      "Increase the mixer speed to medium low and knead for five to seven minutes, until the dough is smooth and no longer sticky. If it still feels sticky, add extra flour one tablespoon at a time and continue mixing until it reaches the right consistency.",
      "Grease a large bowl with vegetable shortening and add the dough, flipping it a couple of times so it's lightly coated all over.",
      "Cover the bowl with plastic wrap and let the dough rise in a warm spot for about 50 minutes, or until almost doubled in size.",
      "Grease two 9x5 loaf pans with shortening or butter.",
      "Turn the dough out onto a floured surface. Knead gently for a couple of minutes, turning it over so the outside is lightly coated in flour. Cut the dough into two pieces.",
      "Roll each piece into a rectangular log shape and place into the loaf pans.",
      "Loosely cover the pans with plastic wrap lightly sprayed with cooking spray, and let rise for 30 minutes.",
      "While the loaves rise, preheat the oven to 350 degrees.",
      "Brush the tops with melted butter (optional) and bake for 30 minutes, or until golden brown. Let cool in the pans for about five minutes, then turn out onto a wire rack or plate to finish cooling.",
    ],
    notes: [
      "The first time this bread was made, Adrien was short on flour and used 2 cups of whole wheat flour and 4 cups of regular AP flour. It works, but produces a denser loaf.",
    ],
    tags: ["bread", "baking", "yeast bread", "sandwich bread", "beginner"],
    adrienNotes: null,
  },
];
