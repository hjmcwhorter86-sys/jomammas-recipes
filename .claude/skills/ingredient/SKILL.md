---
name: ingredient
description: Add or correct a single ingredient's nutrition data in data/ingredient-nutrition.js from a photo of its label, a link to a nutrition page, or values typed directly, with a clear source note. Built for fixing/filling in details on the spot, e.g. while holding the package.
argument-hint: [which ingredient] [optional: link to nutrition info, or just paste values]
---

# /ingredient

Adds or corrects one entry in `data/ingredient-nutrition.js`. Meant for
quick, in-the-moment fixes: you're holding the package, or you found the
product's page online.

## Inputs

- An image attached to this message (usually a photo of a nutrition
  facts label). Or:
- A URL to a page with nutrition facts (fetch it). Or:
- Values typed directly in the message.
- Some indication of which ingredient this is for (a recipe name, the
  ingredient's wording in a recipe, or just the product name).

## Process

1. **Read the schema first.** `data/ingredient-nutrition.js` lines 1-60
   document the exact entry shape (`per`, `calories`, `protein`, `fat`,
   `fiber`, `carbs`, `unitWeights`, `verified`, `source`) and the existing
   batch-add protocol. Follow that schema exactly.

2. **Determine the database key.** Search `recipes-data.js`'s ingredient
   `name` fields and the existing keys in `data/ingredient-nutrition.js`
   for the closest match to what's being described, using the same
   normalization `app.js`'s `normalizeIngredientName` does (lowercase, `&`
   → "and", hyphens → spaces, strip commas, collapse whitespace), plus its
   singular/plural fallback.
   - **Key by the generic recipe wording** (e.g. "parmesan cheese"), not
     the specific branded product, even when the photo/link is for a
     specific brand. Put the brand specifics in `source` instead.
   - If nothing matches and it's not obvious which recipe ingredient this
     is for, ask the user.
   - If a matching key already exists, this is an **update**: overwrite
     the existing entry's values and `source`, and say in your summary
     exactly what changed and why (don't silently create a duplicate key
     like a near-miss plural/singular variant).

3. **Extract the macros**, always converting to **per 100g (solids, by
   weight) or per 100ml (true liquids, by volume)**:
   - From a label photo: read the serving size and the calories/protein/
     fat/fiber/total-carbs for that serving, then scale to per-100g/100ml
     using the serving size's weight or volume.
   - From a URL: fetch it and extract the same per-serving figures, then
     scale the same way.
   - From typed values: use as given, scaling if they weren't already
     given per-100g/100ml.
   - Total carbs (not net carbs) goes in `carbs`; the site derives net
     carbs as `carbs - fiber` itself.

4. **Set `per`** to `"100g"` or `"100ml"` based on how this ingredient is
   actually measured in `recipes-data.js` recipes (grams/oz → 100g; cups/
   tbsp/ml of a true liquid → 100ml).

5. **`unitWeights`**: if any recipe measures this ingredient by count (an
   egg, a clove, a slice, etc.), add a typical weight in grams per unit,
   from the label's serving size if it's given by count, otherwise a
   reasonable estimate confirmed with the user. Otherwise leave `{}`.

6. **Volume-measured but not a true liquid** (flour, sugar, honey,
   shredded cheese, etc. measured in cups/tbsp/tsp): also add a density
   entry (grams per ml) to `data/units.js` → `densities`, following the
   existing entries there.

7. **`verified: true`**: this skill is for confirmed, sourced data (a
   real label or a real page), not a rough guess.

8. **`source`**: a clear, specific free-text note on where the numbers
   came from, e.g. `"User-provided label photo: Kraft Grated Parmesan,
   8oz canister"`, `"URL: https://..."`, or `"User-provided values"`. Name
   the specific product if one is visible/given, even though the key
   itself stays generic.

9. **Spot-check rendering.** This entry can change computed nutrition on
   any recipe that uses this ingredient. Open one of those recipes' detail
   pages in a browser and confirm the nutrition numbers render correctly.

10. **Commit and push** the `data/ingredient-nutrition.js` change (and any
    `data/units.js` density addition) together, to the current branch.

11. **Summarize**: the key used, the values added/changed, the source, and,
    if you can tell from a quick scan of `recipes-data.js`, which
    recipes will now show different computed nutrition.
