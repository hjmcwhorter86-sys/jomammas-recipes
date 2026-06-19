---
name: recipe
description: Add a new recipe to the site from a photo of the dish, rough/messy notes, and an optional source link. Cleans the notes up into the site's structured ingredient format, processes the photo, fills in any missing ingredient nutrition data, and publishes the result.
argument-hint: [rough notes, ingredient list, steps — however messy] [optional: source URL]
---

# /recipe

Turns a quick phone-dump (photo of the finished dish + rough notes, maybe a
source link) into a fully structured recipe entry in `recipes-data.js`,
committed and pushed.

## Inputs

- Any image(s) attached to this message — usually a photo of the finished
  dish. Use it as the recipe's hero image.
- Free-text notes in the message/`$ARGUMENTS` — ingredient list, steps,
  serving size, anything. These can be very rough: shorthand, missing
  punctuation, ingredients and steps mixed together. Parse them.
- An optional source URL (a blog post, etc.) if one was given.

## Process

1. **Read the schema first.** `recipes-data.js` lines 1-28 document the
   exact ingredient object shape (`qty`, `qtyMax`, `unit`, `name`, `notes`,
   `approx`, `optional`, `altQty`/`altUnit`/`altName`, `display`). Follow it
   exactly — don't invent new fields.

2. **Parse the rough notes** into:
   - `title`, `description` (one engaging sentence, matching the site's
     existing voice — see other recipes for tone).
   - `servings` (string, e.g. `"4"` or `"4-6"`). If genuinely not inferable
     from the notes, ask.
   - `ingredients` — structured per the schema above. Use the `{title,
     items}` section form only if the recipe naturally has named
     sub-components (a sauce, a topping, etc.) the way some existing
     recipes do.
   - `steps` — an array of clear, imperative instruction strings.
   - `notes` — an array of any tips/storage info/asides from the rough
     notes that don't belong in `steps`.
   - `tags` — a handful of short lowercase tags, matching the style already
     used in `recipes-data.js`.
   - If a source URL was given, you may fetch it to fill gaps in steps or
     quantities the user's notes left vague — but the user's own notes take
     priority when they conflict with the source.

3. **Generate `id`**: kebab-case slug from the title. Check it against
   every existing `id` in `recipes-data.js`; if it collides, disambiguate
   (e.g. `-2`).

4. **Pick `category`** from the fixed existing set: Chicken, Beef, Pasta,
   Seafood, Dessert, Soup, Breakfast, Slow Cooker, Snacks & Sides, Kitchen
   Basics (each has a matching `images/category-*.png` icon — there's no
   mechanism in this skill to add a new category icon, so only suggest a
   new category if truly nothing fits, and confirm with the user first
   since it needs follow-up work).

5. **Check every quantified ingredient against the nutrition database.**
   For each ingredient with a non-null `qty`, normalize its name the same
   way `app.js`'s `normalizeIngredientName` does (lowercase, `&` → "and",
   hyphens → spaces, strip commas, collapse whitespace) and look for that
   key (or its singular/plural sibling) in `data/ingredient-nutrition.js`.

   `computeRecipeNutrition` is all-or-nothing: if even one required,
   quantified ingredient is missing from the database, the ENTIRE recipe's
   computed nutrition shows "Unknown" — not just that ingredient. So:

   - For every ingredient not already in the database, **stop and ask the
     user** for its nutrition info before finishing the recipe — a label
     photo, a link, or just the numbers. Handle each one exactly like the
     `/ingredient` skill would (same schema, same `verified: true`, same
     sourced `source` note), and add it to `data/ingredient-nutrition.js`.
   - Keep the ingredient's name in `recipes-data.js` as the natural recipe
     wording (e.g. "parmesan cheese"), even if the user's nutrition source
     is a specific branded product — the brand specifics go in that
     database entry's `source` field, not into the recipe's ingredient
     name.
   - If an ingredient is genuinely non-quantifiable (`qty: null`, e.g.
     "salt and pepper to taste") or `optional: true`, skip this check —
     those are already excluded from computed nutrition.

6. **Leave `calories`, `protein`, `fat`, `fiber`, `carbs` on the recipe
   object itself blank** (`null`/`""`, matching the most recently added
   recipes) — don't estimate them. The site shows computed nutrition from
   structured ingredients by default now; that's the source of truth.

7. **`dateAdded`**: today's date, `YYYY-MM-DD`.

8. **Process the image:**
   - If a photo of the dish was attached, save the original at
     `images/originals/<id>.<ext>` (preserve its native extension/quality),
     then generate the compressed version the site actually serves at
     `images/<id>.<ext>` using the same settings as
     `scripts/optimize-images.js` (resize to 800px wide max, `withoutEnlargement`,
     `quality: 80`, `mozjpeg: true` for JPEG).
   - If no photo was attached, use `images/no-photo.jpg` for the `image`
     field and mention in your summary that a photo can be added later.

9. **Append the new recipe object** to the end of `window.recipes` in
   `recipes-data.js`, matching existing formatting (2-space indent inside
   the object, inline ingredient objects on one line each, a blank line
   between logical ingredient groups, trailing comma after the closing
   `}`).

10. **Regenerate screenshots.** Adding a recipe changes the home page
    ("Newest Recipes") and the recipes list page. Run `npm run screenshots`
    and stage whatever PNG diffs result, per this repo's CLAUDE.md rule
    that any rendering change needs updated screenshots in the commit.

11. **Show the user the final structured recipe** (ingredients, steps,
    category, any new nutrition entries you added and their sources)
    before committing, so they can correct anything before it's recorded.

12. **Commit and push** — the new recipe, any new/updated nutrition
    entries, the new images, and the regenerated screenshots together, in
    one commit, to the current branch.

13. **Summarize**: recipe id/title, category, image source (photo vs.
    fallback), and any new ingredient nutrition entries added along with
    their sources.
