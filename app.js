// JoMama Recipes Site - Heather's macro-friendly comfort food collection

const recipes = [...(window.recipes || []), ...(window.kitchenBasicsGuides || []), ...(window.adrienRecipes || [])];

// Recipes only (excludes Kitchen Basics guides); used wherever the result
// must link into the ingredients/steps recipe-detail flow, like prev/next
// navigation, since guides have no detail page of their own.
const navigableRecipes = recipes.filter((r) => r.type !== 'guide');

// Cards for guides link to their own standalone page; recipe cards link into
// recipe-detail.html as usual.
function getRecipeUrl(recipe) {
  if (recipe.type === 'guide' && recipe.url) return recipe.url;
  const detailPage = isAdrienPage ? 'abc-recipe-detail.html' : 'recipe-detail.html';
  return `${detailPage}?id=${recipe.id}`;
}

// Resolves an ingredient's `guideLink: { guideId, tab }` to a URL, looking
// up the target guide's page by id so ingredients don't hardcode page paths.
function getGuideLinkUrl(guideLink) {
  if (!guideLink || !guideLink.guideId) return null;
  const guide = (window.kitchenBasicsGuides || []).find((g) => g.id === guideLink.guideId);
  if (!guide || !guide.url) return null;
  return guideLink.tab ? `${guide.url}#${guideLink.tab}` : guide.url;
}

function normalizeCategoryValue(value) {
  return (value || '').trim().toLowerCase();
}

function getRecipeCategories(recipe) {
  const categoryValues = [];

  if (Array.isArray(recipe?.category)) {
    categoryValues.push(...recipe.category);
  } else if (typeof recipe?.category === 'string') {
    categoryValues.push(recipe.category);
  }

  if (Array.isArray(recipe?.categories)) {
    categoryValues.push(...recipe.categories);
  }

  const deduped = [];
  const seen = new Set();
  categoryValues.forEach((value) => {
    if (typeof value !== 'string') return;
    const trimmed = value.trim();
    if (!trimmed) return;
    const normalized = normalizeCategoryValue(trimmed);
    if (seen.has(normalized)) return;
    seen.add(normalized);
    deduped.push(trimmed);
  });

  return deduped;
}

function getPrimaryCategory(recipe) {
  return getRecipeCategories(recipe)[0] || '';
}

function formatRecipeCategories(recipe, separator = ', ') {
  return getRecipeCategories(recipe).join(separator);
}

const NUTRITION_FIELDS = ['calories', 'protein', 'fat', 'fiber', 'carbs'];

function renderNutritionSection(recipe) {
  const formatValue = (value) => (value === null || value === undefined || value === '') ? 'N/A' : value;
  const computedOn = !!window.flagsService?.isEnabled('showComputedNutrition');

  let display;
  if (computedOn) {
    const result = computeRecipeNutrition(recipe);
    const round = (value) => Math.round(value * 10) / 10;
    const field = (key, suffix = '') => result.unknown.has(key) ? 'Unknown' : `${round(result.perServing[key])}${suffix}`;
    display = {
      calories: field('calories'),
      protein: field('protein', 'g'),
      carbs: field('carbs', 'g'),
      netCarbs: field('netCarbs', 'g'),
      fat: field('fat', 'g'),
      fiber: field('fiber', 'g'),
    };
  } else {
    display = {
      calories: formatValue(recipe.calories),
      protein: formatValue(recipe.protein),
      carbs: formatValue(recipe.carbs),
      netCarbs: 'N/A',
      fat: formatValue(recipe.fat),
      fiber: formatValue(recipe.fiber),
    };
  }

  // The info link only appears when computed nutrition is shown, since
  // that's the data it lets reviewers fact-check.
  const infoLink = computedOn
    ? ` <a class="nutrition-info-link" href="nutrition-info.html?id=${recipe.id}" aria-label="Nutrition data, sources, and disclaimer" title="Nutrition data, sources, and disclaimer">ℹ️</a>`
    : '';

  return `
          <div class="recipe-nutrition">
            <h3>Nutrition (per serving)${infoLink}</h3>
            <ul class="nutrition-list">
              <li><strong>Calories:</strong> ${display.calories}</li>
              <li><strong>Protein:</strong> ${display.protein}</li>
              <li><strong>Carbs:</strong> ${display.carbs}</li>
              <li><strong>Net Carbs:</strong> ${display.netCarbs}</li>
              <li><strong>Fat:</strong> ${display.fat}</li>
              <li><strong>Fiber:</strong> ${display.fiber}</li>
            </ul>
          </div>`;
}

// Flattens both flat-array and {title, items}-section ingredient lists into
// a single array of ingredient items.
function flattenIngredients(ingredients) {
  if (!Array.isArray(ingredients)) return [];
  const flat = [];
  ingredients.forEach((entry) => {
    if (entry && typeof entry === 'object' && Array.isArray(entry.items)) {
      flat.push(...entry.items);
    } else {
      flat.push(entry);
    }
  });
  return flat;
}

// Normalizes an ingredient name for nutrition-database lookups: lowercases,
// spells out "&" as "and", treats hyphens as spaces, drops commas, and
// collapses whitespace. This consolidates near-duplicate ingredient name
// variants (e.g. "half-and-half" / "half & half" / "half and half") onto a
// single database entry.
function normalizeIngredientName(name) {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/-/g, ' ')
    .replace(/,/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Looks up an ingredient name in window.ingredientNutrition, normalizing the
// name first and falling back to a naive singular form (e.g. "eggs" -> "egg")
// when there's no exact match.
function getIngredientNutritionEntry(name) {
  const db = window.ingredientNutrition || {};
  const key = normalizeIngredientName(name);
  if (db[key]) return { key, entry: db[key] };
  if (key.endsWith('s') && db[key.slice(0, -1)]) {
    const singular = key.slice(0, -1);
    return { key: singular, entry: db[singular] };
  }
  return null;
}

// Converts a structured ingredient item's quantity into grams (or, for
// liquids tracked per-100ml, milliliters), using window.unitConversions.
// Returns null if the unit can't be resolved against the nutrition entry.
function getIngredientAmount(item, key, entry) {
  const qty = (item.qtyMax !== null && item.qtyMax !== undefined)
    ? (item.qty + item.qtyMax) / 2
    : item.qty;
  if (qty === null || qty === undefined) return null;

  const unit = item.unit;
  const conversions = window.unitConversions || {};

  if (!unit) {
    const perUnit = entry.unitWeights?.[key];
    return perUnit ? { grams: qty * perUnit } : null;
  }

  if (conversions.mass?.units?.[unit]) {
    return { grams: qty * conversions.mass.units[unit].toBase };
  }

  if (conversions.volume?.units?.[unit]) {
    const ml = qty * conversions.volume.units[unit].toBase;
    if (entry.per === '100ml') return { ml };
    const density = conversions.densities?.[key];
    return density ? { grams: ml * density } : null;
  }

  if (conversions.countUnits?.[unit]) {
    const perUnit = entry.unitWeights?.[unit];
    return perUnit ? { grams: qty * perUnit } : null;
  }

  return null;
}

// Resolves a single structured ingredient item against the nutrition
// database, returning its matched entry, key, and a per-100g/100ml scale
// factor, or null if the ingredient isn't in the database or its unit
// can't be converted.
function resolveIngredientNutrition(item) {
  const match = getIngredientNutritionEntry(item.name);
  if (!match) return null;
  const { key, entry } = match;
  const amount = getIngredientAmount(item, key, entry);
  if (!amount) return null;
  const factor = entry.per === '100ml'
    ? (amount.ml || 0) / 100
    : (amount.grams || 0) / 100;
  if (!factor) return null;
  return { key, entry, factor };
}

// Computes per-serving nutrition totals from a recipe's structured
// ingredients and window.ingredientNutrition.
//
// Non-quantifiable items (qty: null, e.g. "salt and pepper to taste") and
// items marked optional:true are excluded from both the totals and the
// completeness check: optional items may get an opt-in include/exclude
// toggle in a future update.
//
// `unknown` lists which per-serving fields couldn't be computed. Every
// ingredientNutrition entry covers all five macros together, so if ANY
// remaining (required, quantified) ingredient isn't in the database or
// can't be unit-converted, ALL fields are marked unknown.
function computeRecipeNutrition(recipe) {
  const items = flattenIngredients(recipe.ingredients).filter(
    (item) => item && typeof item === 'object' && item.qty !== null && item.qty !== undefined && !item.optional && item.name
  );

  const totals = { calories: 0, protein: 0, fat: 0, fiber: 0, carbs: 0 };
  let allResolved = items.length > 0;
  let allVerified = true;

  items.forEach((item) => {
    const resolved = resolveIngredientNutrition(item);
    if (!resolved) {
      allResolved = false;
      return;
    }
    NUTRITION_FIELDS.forEach((field) => {
      totals[field] += resolved.entry[field] * resolved.factor;
    });
    if (!resolved.entry.verified) allVerified = false;
  });

  const unknown = new Set();
  if (!allResolved) {
    [...NUTRITION_FIELDS, 'netCarbs'].forEach((field) => unknown.add(field));
  }

  const servings = parseFloat(recipe.servings) || 1;
  return {
    allResolved,
    allVerified,
    unknown,
    perServing: {
      calories: totals.calories / servings,
      protein: totals.protein / servings,
      fat: totals.fat / servings,
      fiber: totals.fiber / servings,
      carbs: totals.carbs / servings,
      netCarbs: (totals.carbs - totals.fiber) / servings,
    },
  };
}

// Renders the per-recipe nutrition info page: a disclaimer plus a table of
// every ingredient's matched nutrition data (or why it's excluded/missing),
// so the computed nutrition numbers can be fact-checked and corrected.
// Returns the short "Source" cell value: unverified entries are flagged as
// Claude-estimated (see the unverified-note disclaimer for the explanation);
// verified entries show their real source note.
function sourceLabel(entry) {
  if (!entry.verified) return 'Claude*';
  return entry.source || 'N/A';
}

// Returns a label for an ingredient: its name plus any notes, with an
// asterisk if its nutrition entry (if any) is unverified.
function ingredientNameLabel(item, entry) {
  let label = item.name + (item.notes ? ` (${item.notes})` : '');
  if (entry && !entry.verified) label += ' *';
  return label;
}

function renderNutritionInfoSection(recipe) {
  const items = flattenIngredients(recipe.ingredients).filter((item) => item && typeof item === 'object');
  const servings = parseFloat(recipe.servings) || 1;
  const round = (value) => Math.round(value * 10) / 10;

  const rows = items.map((item) => {
    if (item.qty === null || item.qty === undefined) {
      return { label: ingredientNameLabel(item, null), note: 'Not quantifiable: excluded from totals.' };
    }

    if (item.optional) {
      return { label: ingredientNameLabel(item, null), note: 'Optional: currently excluded from totals.' };
    }

    const resolved = resolveIngredientNutrition(item);
    if (!resolved) {
      const match = getIngredientNutritionEntry(item.name);
      if (!match) return { label: ingredientNameLabel(item, null), note: 'Not in the nutrition database yet.' };
      return { label: ingredientNameLabel(item, match.entry), note: `Unit "${item.unit || '(none)'}" not supported for "${match.key}".` };
    }

    const { entry, factor } = resolved;
    return {
      label: ingredientNameLabel(item, entry),
      entry,
      calories: round(entry.calories * factor / servings),
      protein: round(entry.protein * factor / servings),
      fat: round(entry.fat * factor / servings),
      fiber: round(entry.fiber * factor / servings),
      carbs: round(entry.carbs * factor / servings),
    };
  });

  const allIngredientRows = Object.entries(window.ingredientNutrition || {}).map(([key, entry]) => ({
    label: key + (entry.verified ? '' : ' *'),
    entry,
    per: entry.per === '100ml' ? '100ml' : '100g',
  }));

  const hasUnverified = rows.some((row) => row.entry && !row.entry.verified);
  const allHasUnverified = allIngredientRows.some((row) => !row.entry.verified);

  const unverifiedNote = `
      <p class="nutrition-disclaimer nutrition-unverified-note">
        * These ingredient values were looked up and estimated by Claude and
        have not yet been double-checked. They may be inaccurate; corrections
        are welcome.
      </p>`;

  return `
    <div class="detail-controls">
      <button class="back-btn button-family button-secondary" onclick="window.location.href='recipe-detail.html?id=${recipe.id}'">← Back to ${recipe.title}</button>
    </div>
    <article class="recipe-detail nutrition-info-page">
      <h1>Nutrition Info: ${recipe.title}</h1>
      <p class="nutrition-disclaimer">
        These values are rough estimates calculated from a public ingredient
        nutrition database. They are not a substitute for medical or
        professional dietary advice. Quantities are approximate, brands and
        preparation vary, and some ingredients aren't in the database yet;
        use this as a starting point, not a guarantee.
      </p>
      <div class="detail-controls">
        <button class="back-btn button-family button-secondary" id="toggleAllIngredientsBtn">Show All Ingredients</button>
      </div>
      <div id="recipeIngredientsTable">
        <div class="nutrition-info-table-wrapper">
          <table class="nutrition-info-table">
            <thead>
              <tr>
                <th class="th-sortable" data-col="0">Ingredient</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Fat</th>
                <th>Fiber</th>
                <th>Carbs</th>
                <th class="th-sortable" data-col="6">Source</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => row.entry ? `
              <tr>
                <td>${row.label}</td>
                <td>${row.calories}</td>
                <td>${row.protein}g</td>
                <td>${row.fat}g</td>
                <td>${row.fiber}g</td>
                <td>${row.carbs}g</td>
                <td>${sourceLabel(row.entry)}</td>
              </tr>` : `
              <tr class="nutrition-info-row-excluded">
                <td>${row.label}</td>
                <td colspan="6">${row.note}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        ${hasUnverified ? unverifiedNote : ''}
      </div>
      <div id="allIngredientsTable" hidden>
        <div class="nutrition-info-table-wrapper">
          <table class="nutrition-info-table">
            <thead>
              <tr>
                <th class="th-sortable" data-col="0">Ingredient</th>
                <th>Per</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Fat</th>
                <th>Fiber</th>
                <th>Carbs</th>
                <th class="th-sortable" data-col="7">Source</th>
              </tr>
            </thead>
            <tbody>
              ${allIngredientRows.map((row) => `
              <tr>
                <td>${row.label}</td>
                <td>${row.per}</td>
                <td>${row.entry.calories}</td>
                <td>${row.entry.protein}g</td>
                <td>${row.entry.fat}g</td>
                <td>${row.entry.fiber}g</td>
                <td>${row.entry.carbs}g</td>
                <td>${sourceLabel(row.entry)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        ${allHasUnverified ? unverifiedNote : ''}
      </div>
    </article>
  `;
}

function getRecipeImageUrl(recipe) {
  if (!recipe || typeof recipe.image !== 'string') {
    return 'images/no-photo.jpg';
  }

  const normalizedPath = recipe.image.trim().replace(/\\/g, '/');
  return normalizedPath || 'images/no-photo.jpg';
}

// Returns the full-quality original image for recipe detail pages. Originals
// are preserved in images/originals/ by scripts/optimize-images.js; the
// main images/ copies are compressed thumbnails.
function getRecipeOriginalImageUrl(recipe) {
  const thumbPath = getRecipeImageUrl(recipe);
  return thumbPath.replace(/^images\//, 'images/originals/');
}

// Maps decimal fractions to their unicode glyphs for ingredient quantity display.
const QUANTITY_FRACTION_MAP = [
  [0.125, '⅛'],
  [0.25, '¼'],
  [0.333, '⅓'],
  [0.375, '⅜'],
  [0.5, '½'],
  [0.625, '⅝'],
  [0.667, '⅔'],
  [0.75, '¾'],
  [0.875, '⅞'],
];

// Formats a quantity (and optional range) as "1¼", "½–¾", "~2", etc.
function formatQuantityDisplay(qty, qtyMax, approx) {
  if (qty === null || qty === undefined) return '';

  const formatOne = (value) => {
    const whole = Math.floor(value);
    const frac = value - whole;
    if (frac === 0) return String(whole);
    const match = QUANTITY_FRACTION_MAP.find(([dec]) => Math.abs(dec - frac) < 0.02);
    const fracStr = match ? match[1] : parseFloat(frac.toFixed(2)).toString().slice(1);
    return whole > 0 ? `${whole}${fracStr}` : fracStr;
  };

  let result = formatOne(qty);
  if (qtyMax !== null && qtyMax !== undefined) {
    result += `–${formatOne(qtyMax)}`;
  }
  return approx ? `~${result}` : result;
}

// Looks up the singular/plural display form of a unit based on quantity.
function getUnitDisplay(unit, qty, qtyMax) {
  if (!unit) return '';

  const conversions = window.unitConversions || {};
  const tables = [conversions.volume?.units, conversions.mass?.units, conversions.countUnits];
  const entry = tables.find((table) => table && table[unit])?.[unit];

  const isPlural = (qtyMax !== null && qtyMax !== undefined) ? true : qty !== 1;
  if (entry && isPlural && entry.plural) return entry.plural;
  return unit;
}

// Converts a quantity/unit to the active US/Metric unit system (see
// units-service.js and data/units.js -> displayUnits), for mass and volume
// units only. Count units (clove, slice, ...) and unitless items pass
// through unchanged.
//
// Recipes are already authored in US customary units (tsp/tbsp/cup,
// oz/lb), so in US mode this returns the quantity exactly as written,
// no re-bucketing into "whichever unit looks nicest" - a recipe that
// says "6 Tbsp" should show "6 Tbsp", not get silently rewritten to
// "0.38 cups". Conversion only kicks in for Metric, where there's no
// author-chosen unit to preserve and a magnitude-based unit has to be
// picked.
function convertQuantityForDisplay(qty, qtyMax, unit) {
  const original = { qty, qtyMax, unit };
  if (!unit || qty === null || qty === undefined) return original;

  const system = window.unitsService?.getSystem() || 'us';
  if (system === 'us') return original;

  const conversions = window.unitConversions || {};

  let category = null;
  if (conversions.mass?.units?.[unit]) category = 'mass';
  else if (conversions.volume?.units?.[unit]) category = 'volume';
  else return original;

  const targets = conversions.displayUnits?.[system]?.[category];
  if (!targets) return original;

  const sourceToBase = conversions[category].units[unit].toBase;
  const convertOne = (value) => {
    if (value === null || value === undefined) return value;
    const base = value * sourceToBase;
    const target = targets.find((t) => base < t.maxBase) || targets[targets.length - 1];
    const targetToBase = conversions[category].units[target.unit].toBase;
    return { value: Math.round((base / targetToBase) * 100) / 100, unit: target.unit };
  };

  const convertedQty = convertOne(qty);
  const convertedQtyMax = convertOne(qtyMax);
  return {
    qty: convertedQty.value,
    qtyMax: convertedQtyMax ? convertedQtyMax.value : (qtyMax ?? null),
    unit: convertedQty.unit,
  };
}

// Builds the display string for one ingredient entry (structured object or legacy string).
function renderIngredientLine(item) {
  if (typeof item === 'string') {
    return item;
  }
  if (!item || typeof item !== 'object') {
    return '';
  }
  if (item.display) {
    return item.display;
  }

  const parts = [];
  if (item.qty !== null && item.qty !== undefined) {
    const { qty, qtyMax, unit } = convertQuantityForDisplay(item.qty, item.qtyMax, item.unit);
    parts.push(formatQuantityDisplay(qty, qtyMax, item.approx));
    if (unit) parts.push(getUnitDisplay(unit, qty, qtyMax));
  }
  parts.push(item.name);

  let line = parts.join(' ');
  if (item.notes) line += ` (${item.notes})`;

  const hasAlt = (item.altQty !== null && item.altQty !== undefined) || item.altUnit || item.altName;
  if (hasAlt) {
    const altParts = [];
    if (item.altQty !== null && item.altQty !== undefined) {
      const { qty: altQty, unit: altUnit } = convertQuantityForDisplay(item.altQty, null, item.altUnit);
      altParts.push(formatQuantityDisplay(altQty, null, false));
      if (altUnit) altParts.push(getUnitDisplay(altUnit, altQty, null));
    } else if (item.altUnit) {
      altParts.push(item.altUnit);
    }
    if (item.altName) altParts.push(item.altName);
    line += ` (or ${altParts.join(' ')})`;
  }

  if (item.guideLink) {
    const url = getGuideLinkUrl(item.guideLink);
    if (url) {
      const note = item.note || 'See the Kitchen Basics guide for more on this.';
      line += ` <button type="button" class="ingredient-guide-link" data-note="${note}" data-url="${url}" aria-expanded="false" aria-label="Why this ingredient">?</button>`;
    }
  }

  return line;
}


function renderIngredientsMarkup(ingredients) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return '';
  }

  const hasStructuredSections = ingredients.some((entry) => (
    entry && typeof entry === 'object' && !Array.isArray(entry) && Array.isArray(entry.items)
  ));

  const isRenderable = (item) => (
    item !== null && item !== undefined && !(typeof item === 'string' && !item.trim())
  );

  if (!hasStructuredSections) {
    return `
      <ul class="ingredients-list">
        ${ingredients
          .filter(isRenderable)
          .map((item) => `<li>${renderIngredientLine(item)}</li>`)
          .join('')}
      </ul>
    `;
  }

  return `
    <div class="ingredient-sections">
      ${ingredients.map((entry) => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
          return '';
        }

        const title = typeof entry.title === 'string' ? entry.title.trim() : '';
        const items = Array.isArray(entry.items)
          ? entry.items.filter(isRenderable)
          : [];

        if (items.length === 0) {
          return '';
        }

        return `
          <section class="ingredient-group">
            ${title ? `<h3 class="ingredient-group-title">${title}</h3>` : ''}
            <ul class="ingredients-list">
              ${items.map((item) => `<li>${renderIngredientLine(item)}</li>`).join('')}
            </ul>
          </section>
        `;
      }).join('')}
    </div>
  `;
}

// Multiplies a single ingredient's qty/qtyMax/altQty by `factor`, leaving
// everything else (including any curated `display` override, which ignores
// qty entirely when rendered) untouched. Non-numeric qty (null, "to taste",
// etc.) passes through unscaled.
function scaleIngredientItem(item, factor) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
  const scaled = { ...item };
  if (typeof item.qty === 'number') scaled.qty = Math.round(item.qty * factor * 100) / 100;
  if (typeof item.qtyMax === 'number') scaled.qtyMax = Math.round(item.qtyMax * factor * 100) / 100;
  if (typeof item.altQty === 'number') scaled.altQty = Math.round(item.altQty * factor * 100) / 100;
  return scaled;
}

// Scales every ingredient's quantity by `factor`, handling both the flat
// ingredient-list shape and the sectioned `{ title, items }` shape that
// renderIngredientsMarkup supports.
function scaleIngredients(ingredients, factor) {
  if (!Array.isArray(ingredients) || factor === 1) return ingredients;
  return ingredients.map((entry) => {
    if (entry && typeof entry === 'object' && !Array.isArray(entry) && Array.isArray(entry.items)) {
      return { ...entry, items: entry.items.map((item) => scaleIngredientItem(item, factor)) };
    }
    return scaleIngredientItem(entry, factor);
  });
}

// Renders the "Servings" line: plain text normally, or an interactive
// stepper when the recipe has a numeric serving count and structured
// ingredients to scale.
function renderServingsControl(recipe) {
  if (!recipe.servings) return '';

  const originalServings = parseFloat(recipe.servings);
  const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  const scalingEnabled = Number.isFinite(originalServings) && hasIngredients;

  if (!scalingEnabled) {
    return `<div class="recipe-servings"><strong>Servings:</strong> ${recipe.servings}</div>`;
  }

  return `
    <div class="recipe-servings">
      <strong>Servings:</strong>
      <div class="servings-control">
        <button type="button" class="servings-btn" id="servingsDecrement" aria-label="Decrease servings">−</button>
        <input type="number" id="servingsInput" class="servings-input" value="${originalServings}" min="1" step="1" inputmode="numeric" aria-label="Number of servings" />
        <button type="button" class="servings-btn" id="servingsIncrement" aria-label="Increase servings">+</button>
      </div>
    </div>
  `;
}

// Wires up the servings stepper rendered by renderServingsControl: on any
// change, re-renders #ingredientsContainer with ingredient quantities
// scaled relative to the recipe's original serving count. No-ops if the
// control wasn't rendered (no servings, or no ingredients).
function setupServingsControl(recipe) {
  const originalServings = parseFloat(recipe.servings);
  if (!Number.isFinite(originalServings)) return;

  const input = document.getElementById('servingsInput');
  const decrementBtn = document.getElementById('servingsDecrement');
  const incrementBtn = document.getElementById('servingsIncrement');
  const container = document.getElementById('ingredientsContainer');
  if (!input || !decrementBtn || !incrementBtn || !container) return;

  const applyServings = (value) => {
    const rounded = Math.round(value);
    const newServings = Math.max(1, Number.isFinite(rounded) ? rounded : originalServings);
    input.value = newServings;
    container.innerHTML = renderIngredientsMarkup(scaleIngredients(recipe.ingredients, newServings / originalServings));
  };

  const currentValue = () => {
    const parsed = parseFloat(input.value);
    return Number.isFinite(parsed) ? parsed : originalServings;
  };

  decrementBtn.addEventListener('click', () => applyServings(currentValue() - 1));
  incrementBtn.addEventListener('click', () => applyServings(currentValue() + 1));
  input.addEventListener('change', () => applyServings(parseFloat(input.value)));
}

// Popover for the ingredient "?" guide-link badges (see renderIngredientLine).
// One shared element rather than one per badge, since ingredient lists are
// re-rendered dynamically and badges come and go with them.
let ingredientGuidePopover = null;
let ingredientGuidePopoverButton = null;

function closeIngredientGuidePopover() {
  if (ingredientGuidePopoverButton) ingredientGuidePopoverButton.setAttribute('aria-expanded', 'false');
  if (ingredientGuidePopover) ingredientGuidePopover.remove();
  ingredientGuidePopover = null;
  ingredientGuidePopoverButton = null;
}

function openIngredientGuidePopover(button) {
  closeIngredientGuidePopover();

  const popover = document.createElement('div');
  popover.className = 'ingredient-guide-popover';
  popover.setAttribute('role', 'tooltip');
  popover.innerHTML = `
    <p>${button.dataset.note}</p>
    <a href="${button.dataset.url}">Read more →</a>
  `;
  document.body.appendChild(popover);

  const rect = button.getBoundingClientRect();
  const maxLeft = window.scrollX + document.documentElement.clientWidth - popover.offsetWidth - 8;
  popover.style.top = `${rect.bottom + window.scrollY + 6}px`;
  popover.style.left = `${Math.min(rect.left + window.scrollX, Math.max(maxLeft, window.scrollX + 8))}px`;

  button.setAttribute('aria-expanded', 'true');
  ingredientGuidePopover = popover;
  ingredientGuidePopoverButton = button;
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('.ingredient-guide-link');
  if (button) {
    event.preventDefault();
    if (ingredientGuidePopoverButton === button) {
      closeIngredientGuidePopover();
    } else {
      openIngredientGuidePopover(button);
    }
    return;
  }
  if (ingredientGuidePopover && !ingredientGuidePopover.contains(event.target)) {
    closeIngredientGuidePopover();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeIngredientGuidePopover();
});

// Detect page type from meta tag
const pageType = document.querySelector('meta[name="page-type"]')?.getAttribute('content') || 'home';

// True on Adrien's Baking Corner pages (abc.html, abc-recipe-detail.html),
// which load adrien-recipes-data.js instead of recipes-data.js and need
// their own detail-page links so they never point back into the main site.
const isAdrienPage = pageType === 'abc' || pageType === 'abc-detail';

// Hamburger Menu Toggle
const hamburgerMenu = document.getElementById('hamburgerMenu');
const mobileMenu = document.getElementById('mobileMenu');
const searchIconButton = document.getElementById('searchIconButton');
const mobileSearchContainer = document.getElementById('mobileSearchContainer');
const mobileSearchInput = document.getElementById('mobile-search');

if (hamburgerMenu && mobileMenu) {
  hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    hamburgerMenu.setAttribute('aria-expanded', hamburgerMenu.classList.contains('active'));
    // Close search when opening menu
    if (searchIconButton.classList.contains('active')) {
      searchIconButton.classList.remove('active');
      mobileSearchContainer.classList.remove('active');
      searchIconButton.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu when a link is clicked
  const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerMenu.classList.remove('active');
      mobileMenu.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

// Units system selector (US / Metric), present in the header on every page
if (window.unitsService) {
  const unitSelects = document.querySelectorAll('.unit-system-select');
  const currentSystem = window.unitsService.getSystem();
  unitSelects.forEach((select) => {
    select.value = currentSystem;
    select.addEventListener('change', () => {
      window.unitsService.setSystem(select.value);
      location.reload();
    });
  });
}

// Mobile Search Toggle
if (searchIconButton && mobileSearchContainer) {
  searchIconButton.addEventListener('click', () => {
    searchIconButton.classList.toggle('active');
    mobileSearchContainer.classList.toggle('active');
    searchIconButton.setAttribute('aria-expanded', searchIconButton.classList.contains('active'));
    // Close menu when opening search
    if (hamburgerMenu && hamburgerMenu.classList.contains('active')) {
      hamburgerMenu.classList.remove('active');
      mobileMenu.classList.remove('active');
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    }
    // Focus search input when opening
    if (searchIconButton.classList.contains('active') && mobileSearchInput) {
      setTimeout(() => mobileSearchInput.focus(), 100);
    }
  });

  // Handle search on Enter key in mobile search
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const query = mobileSearchInput.value.trim();
        const target = query ? `recipes-list.html?q=${encodeURIComponent(query)}` : 'recipes-list.html';
        window.location.href = target;
      }
    });
  }
}

let cookModeEnabled = false;
let cookWakeLockSentinel = null;

function isCookModeSupported() {
  return 'wakeLock' in navigator && typeof navigator.wakeLock.request === 'function';
}

function updateCookModeUI() {
  const cookModeBtn = document.getElementById('cookModeBtn');
  const cookModeStatus = document.getElementById('cookModeStatus');
  const supported = isCookModeSupported();

  if (!cookModeBtn || !cookModeStatus) return;

  if (!supported) {
    cookModeBtn.textContent = 'Cook Mode Unavailable';
    cookModeBtn.disabled = true;
    cookModeBtn.classList.remove('is-active');
    cookModeBtn.setAttribute('aria-pressed', 'false');
    cookModeStatus.textContent = 'Cook mode is not supported on this browser/device.';
    return;
  }

  const isActive = cookModeEnabled && !!cookWakeLockSentinel;
  cookModeBtn.textContent = isActive ? 'Cook Mode: On' : 'Cook Mode: Off';
  cookModeBtn.classList.toggle('is-active', isActive);
  cookModeBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

  if (isActive) {
    cookModeStatus.textContent = 'Your screen will stay awake while this tab is active.';
    return;
  }

  if (cookModeEnabled && document.visibilityState !== 'visible') {
    cookModeStatus.textContent = 'Return to this tab to resume cook mode.';
    return;
  }

  cookModeStatus.textContent = 'Turn on cook mode to keep your screen awake while cooking.';
}

async function requestCookWakeLock() {
  if (!isCookModeSupported() || document.visibilityState !== 'visible') {
    return false;
  }

  try {
    cookWakeLockSentinel = await navigator.wakeLock.request('screen');
    cookWakeLockSentinel.addEventListener('release', () => {
      cookWakeLockSentinel = null;
      updateCookModeUI();
    });
    return true;
  } catch {
    cookWakeLockSentinel = null;
    return false;
  }
}

async function setCookMode(nextState) {
  cookModeEnabled = nextState;

  if (!nextState) {
    if (cookWakeLockSentinel) {
      try {
        await cookWakeLockSentinel.release();
      } catch {
        // no-op
      }
      cookWakeLockSentinel = null;
    }
    updateCookModeUI();
    return;
  }

  await requestCookWakeLock();
  updateCookModeUI();
}

function setupCookModeControl() {
  const cookModeBtn = document.getElementById('cookModeBtn');
  if (!cookModeBtn) return;

  cookModeBtn.addEventListener('click', async () => {
    cookModeBtn.disabled = true;
    await setCookMode(!cookModeEnabled);
    cookModeBtn.disabled = false;
  });

  updateCookModeUI();
}

document.addEventListener('visibilitychange', async () => {
  if (cookModeEnabled && !cookWakeLockSentinel && document.visibilityState === 'visible') {
    await requestCookWakeLock();
    updateCookModeUI();
    return;
  }

  if (cookModeEnabled) {
    updateCookModeUI();
  }
});

window.addEventListener('beforeunload', () => {
  if (cookWakeLockSentinel) {
    cookWakeLockSentinel.release();
  }
});

function setSeo(titleText, descriptionText) {
  const siteName = "JoMama's Recipes";
  document.title = titleText ? `${titleText} • ${siteName}` : siteName;

  let descriptionMeta = document.querySelector('meta[name="description"]');
  if (!descriptionMeta) {
    descriptionMeta = document.createElement('meta');
    descriptionMeta.setAttribute('name', 'description');
    document.head.appendChild(descriptionMeta);
  }
  descriptionMeta.setAttribute('content', (descriptionText || '').trim());
}

if (pageType === 'home') {
  setSeo('Home', 'No Ads. No long-winded stories. Just good food.');
}

if (pageType === 'list') {
  setSeo('Recipes', 'Search, browse, and filter macro-friendly comfort food recipes.');
}

if (pageType === 'about') {
  setSeo('About', 'This website was made for cooking quick and easy recipes with no fluff or distractions.');
}

if (pageType === 'flags') {
  setSeo('Feature Flags', 'Turn experimental features on or off in this browser.');
}

if (pageType === 'kitchen-basics-oils-fats') {
  setSeo('Kitchen Basics: Oils & Fats', 'Smoke points, flavor strength, and a healthy-fat spectrum for oils, butter, ghee, and more.');
}

if (pageType === 'abc') {
  setSeo("Adrien's Baking Corner", "Adrien's beginner baking recipes, with notes on what worked and what didn't.");

  // Hide the "coming soon" banner once Adrien has posted a bake.
  const abcBannerEl = document.getElementById('abcBanner');
  if (abcBannerEl && (window.adrienRecipes || []).length > 0) {
    abcBannerEl.remove();
  }
}

const recipesEl = document.getElementById("recipes");
const searchEl = document.getElementById("search");
const detailedViewEl = document.getElementById("detailed-view");
const recipesListLinks = document.querySelectorAll('a[href="recipes-list.html"]');

recipesListLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = 'recipes-list.html';
  });
});

// Header search behavior for non-list pages: Enter navigates to recipes list with query.
if (searchEl && pageType !== 'list') {
  searchEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const query = searchEl.value.trim();
      const target = query ? `recipes-list.html?q=${encodeURIComponent(query)}` : 'recipes-list.html';
      window.location.href = target;
    }
  });
}

// Homepage: render newest recipes into #newest when present
const newestEl = document.getElementById('newest');
if (newestEl) {
  const newest = navigableRecipes
    .filter(r => r.dateAdded && !r.excludeFromNewest)
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 4);

  newestEl.innerHTML = newest.map(r => `
    <a class="newest-card" href="${getRecipeUrl(r)}">
      <img src="${getRecipeImageUrl(r)}" alt="${r.title}" class="newest-card-image" loading="lazy">
      <div class="newest-card-inner">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <div class="meta-small">${formatRecipeCategories(r)}</div>
      </div>
    </a>
  `).join('');

  // Adrien's Baking Corner: friendly empty state until he's posted a bake.
  if (pageType === 'abc' && newest.length === 0) {
    newestEl.innerHTML = '<p class="section-empty-state">No bakes posted yet; check back soon!</p>';
  }
}

// Homepage: render popular recipes into #popular when present
const popularEl = document.getElementById('popular');
if (popularEl) {
  const popularRecipeIds = [
    "light-tuscan-chicken",
    "birria-chuck-roast",
    "gochujang-butter-shrimp",
    "protein-cheesecake-jars"
  ];

  const popular = popularRecipeIds
    .map(id => recipes.find(r => r.id === id))
    .filter(Boolean);

  // Helper function to get badge text for a recipe
  function getBadgeText(recipe) {
    // If tags exist, pick the first one. Otherwise fall back to category.
    if (recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0) {
      return recipe.tags[0];
    }
    return getPrimaryCategory(recipe);
  }

  popularEl.innerHTML = popular.map(r => {
    const badgeText = getBadgeText(r);
    return `
    <a class="newest-card" href="${getRecipeUrl(r)}">
      <div class="newest-card-image-wrapper">
        <img src="${getRecipeImageUrl(r)}" alt="${r.title}" class="newest-card-image" loading="lazy">
        ${badgeText ? `<span class="recipe-badge">${badgeText}</span>` : ''}
      </div>
      <div class="newest-card-inner">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <div class="meta-small">${formatRecipeCategories(r)}</div>
      </div>
    </a>
  `;}).join('');
}

// If we're on the recipes list page, initialize recipes page functionality
if (pageType === 'list' && recipesEl && searchEl) {
  const categoryMap = new Map();
  recipes.flatMap(getRecipeCategories).forEach((category) => {
    const normalized = normalizeCategoryValue(category);
    if (!normalized || categoryMap.has(normalized)) return;
    categoryMap.set(normalized, category);
  });

  const allCategories = [...categoryMap.values()].sort();

  function resolveCategorySelection(inputCategory) {
    if (!inputCategory || inputCategory === 'All') return 'All';
    const normalizedInput = normalizeCategoryValue(inputCategory);
    return categoryMap.get(normalizedInput) || inputCategory;
  }

  let currentCategory = 'All';

  function render(list) {
    // Show empty state if no results
    if (list.length === 0) {
      recipesEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>No recipes found</h3>
          <p>Try adjusting your search or filters</p>
          <button class="clear-filters-btn" id="clearFilters">Clear filters</button>
        </div>
      `;
      
      // Add event listener for clear filters button
      const clearBtn = document.getElementById('clearFilters');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchEl.value = '';
          currentCategory = 'All';
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          document.querySelector('.filter-btn[data-category="All"]')?.classList.add('active');
          render(filterRecipes('', 'All'));
        });
      }
      return;
    }
    
    recipesEl.innerHTML = list.map(r => {
      // Use recipe image or fallback to placeholder
      const imageUrl = getRecipeImageUrl(r);

      return `
        <a href="${getRecipeUrl(r)}" class="card recipe-card">
          <div class="recipe-card-image-wrapper">
            <img src="${imageUrl}" alt="${r.title}" class="recipe-card-image" loading="lazy" />
          </div>
          <div class="recipe-card-content">
            <h3>${r.title}</h3>
            <p>${r.description}</p>
            <div class="recipe-meta-row">
              <span class="category-pill">${formatRecipeCategories(r)}</span>
            </div>
            <div class="tags">
              ${r.tags.map(t => `<span class="tag">${t}</span>`).join("")}
            </div>
          </div>
        </a>
      `;
    }).join("");
  }

  function renderDetailedView(recipe) {
    setSeo(recipe.title, recipe.description || '');

    if (!detailedViewEl) return;
    
    // Validate recipe has required fields
    const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
    const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;
    const isIncomplete = !hasIngredients || !hasSteps;
    
    // Find current recipe index for Previous/Next navigation
    const currentIndex = navigableRecipes.findIndex(r => r.id === recipe.id);
    const prevRecipe = currentIndex > 0 ? navigableRecipes[currentIndex - 1] : null;
    const nextRecipe = currentIndex < navigableRecipes.length - 1 ? navigableRecipes[currentIndex + 1] : null;
    
    // Helper to safely render notes (can be array or string for backwards compatibility)
    const notesArray = Array.isArray(recipe.notes) ? recipe.notes : (recipe.notes ? [recipe.notes] : []);
    
    detailedViewEl.innerHTML = `
      <div class="detail-controls">
        <button class="back-btn button-family button-secondary" onclick="window.location.href='recipes-list.html'">← Back to Recipes</button>
        <button class="copy-link-btn button-family button-secondary" id="copyLinkBtn">Copy Link</button>
      </div>
      <article class="recipe-detail">
        <h1>${recipe.title}</h1>
        <p class="recipe-description">${recipe.description}</p>
        <div class="recipe-meta">
          <div class="meta-primary">
            <span class="badge">${formatRecipeCategories(recipe, ' • ')}</span>
            <button class="print-recipe-btn button-family button-primary" id="printRecipeBtn" type="button">Print Recipe</button>
            <button class="cook-mode-btn button-family button-secondary" id="cookModeBtn" type="button" aria-pressed="false">Cook Mode: Off</button>
          </div>
        </div>
        ${renderNutritionSection(recipe)}
        <p class="cook-mode-status" id="cookModeStatus" aria-live="polite"></p>
        ${recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0 ? `<div class="recipe-tags">${recipe.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        ${renderServingsControl(recipe)}
        <div class="recipe-image-outer"><img src="${getRecipeOriginalImageUrl(recipe)}" alt="${recipe.title}" class="recipe-image" id="recipe-image-zoom" style="cursor: zoom-in;"></div>
        <div class="recipe-content-wrapper">
          ${hasIngredients ? `
            <section class="recipe-section">
              <h2>Ingredients</h2>
              <div id="ingredientsContainer">${renderIngredientsMarkup(recipe.ingredients)}</div>
            </section>
          ` : '<p class="incomplete-warning">Ingredients data incomplete</p>'}
        </div>
        ${hasSteps ? `
          <section class="recipe-section">
            <h2>Instructions</h2>
            <ol class="steps-list">
              ${recipe.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
          </section>
        ` : '<p class="incomplete-warning">Instructions data incomplete</p>'}
        ${notesArray.length > 0 ? `
          <section class="recipe-section">
            <h2>Notes</h2>
            <ul class="notes-list">
              ${notesArray.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </section>
        ` : ''}
        ${isIncomplete ? `<div class="incomplete-message"><p><strong>⚠️ Recipe data incomplete:</strong> This recipe is missing ingredients or instructions. Please check back later or contact the maintainer.</p></div>` : ''}
      </article>
      <div class="recipe-nav">
        ${prevRecipe ? `<a href="recipe-detail.html?id=${(prevRecipe.id)}" class="nav-btn prev-btn">← ${prevRecipe.title}</a>` : ''}
        ${nextRecipe ? `<a href="recipe-detail.html?id=${(nextRecipe.id)}" class="nav-btn next-btn">${nextRecipe.title} →</a>` : ''}
      </div>
      <div id="imageModal" class="image-modal">
        <span class="image-modal-close">&times;</span>
        <img class="image-modal-content" id="modalImage" src="" alt="">
      </div>
    `;
    detailedViewEl.style.display = 'block';
    
    // Attach copy link button handler
    const copyBtn = document.getElementById('copyLinkBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 1500);
          }).catch(() => {
            fallbackCopy(url);
          });
        } else {
          fallbackCopy(url);
        }
      });
    }

    const printBtn = document.getElementById('printRecipeBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    setupCookModeControl();
    setupServingsControl(recipe);
  }

  function fallbackCopy(url) {
    const userInput = prompt('Copy the link below:', url);
    if (userInput !== null) {
      // User clicked OK, text is already in the prompt for selection
    }
  }

  function filterRecipes(q, category = 'All') {
    let list = [...recipes].sort((a, b) => {
      if (!a.dateAdded) return 1;
      if (!b.dateAdded) return -1;
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    });
    if (category !== 'All') {
      const normalizedCategory = normalizeCategoryValue(category);
      list = list.filter((recipe) => getRecipeCategories(recipe)
        .some((recipeCategory) => normalizeCategoryValue(recipeCategory) === normalizedCategory));
    }
    if (q && q.trim()) {
      const query = q.trim().toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    return list;
  }

  function renderFilters() {
    const filtersEl = document.getElementById('filters');
    if (!filtersEl) return;
    filtersEl.innerHTML = '<button class="filter-btn active" data-category="All">All</button>' +
      allCategories.map(cat => `<button class="filter-btn" data-category="${cat}">${cat}</button>`).join('');
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        render(filterRecipes(searchEl.value, currentCategory));
      });
    });
  }

  searchEl.addEventListener("input", (e) => {
    render(filterRecipes(e.target.value, currentCategory));
  });

  // Prefill search from `q` query parameter when present (recipes-list.html?q=...)
  // Also read `category` parameter from URL (recipes-list.html?category=Chicken)
  // Or show detailed view if `id` parameter present (recipes-list.html?id=recipe-slug)
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');
  
  if (recipeId) {
    // Show detailed recipe view
    const recipe = recipes.find(r => (r.id) === recipeId);
    if (recipe) {
      // Hide the grid and filters
      recipesEl.style.display = 'none';
      const filtersEl = document.getElementById('filters');
      if (filtersEl) filtersEl.style.display = 'none';
      // Show detailed view
      renderDetailedView(recipe);
    } else {
      // Recipe not found, show grid
      const initialQuery = urlParams.get('q') || '';
      const initialCategory = resolveCategorySelection(urlParams.get('category') || 'All');
      if (initialQuery) searchEl.value = initialQuery;
      currentCategory = initialCategory;
      render(filterRecipes(initialQuery, currentCategory));
      renderFilters();
      document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.category === currentCategory) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  } else {
    // Show grid view (original behavior)
    const initialQuery = urlParams.get('q') || '';
    const initialCategory = resolveCategorySelection(urlParams.get('category') || 'All');
    
    if (initialQuery) searchEl.value = initialQuery;
    currentCategory = initialCategory;

    render(filterRecipes(initialQuery, currentCategory));
    renderFilters();
    
    // Highlight the correct filter button after rendering
    document.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.dataset.category === currentCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// If we're on the recipe detail page, handle detail view rendering
if (pageType === 'detail' && detailedViewEl) {
  function renderDetailedView(recipe) {
    setSeo(recipe.title, recipe.description || '');

    // Validate recipe has required fields
    const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
    const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;
    const isIncomplete = !hasIngredients || !hasSteps;
    
    // Find current recipe index for Previous/Next navigation
    const currentIndex = navigableRecipes.findIndex(r => r.id === recipe.id);
    const prevRecipe = currentIndex > 0 ? navigableRecipes[currentIndex - 1] : null;
    const nextRecipe = currentIndex < navigableRecipes.length - 1 ? navigableRecipes[currentIndex + 1] : null;
    
    // Helper to safely render notes (can be array or string for backwards compatibility)
    const notesArray = Array.isArray(recipe.notes) ? recipe.notes : (recipe.notes ? [recipe.notes] : []);
    
    detailedViewEl.innerHTML = `
      <div class="detail-controls">
        <button class="back-btn button-family button-secondary" onclick="window.location.href='recipes-list.html'">← Back to Recipes</button>
        <button class="copy-link-btn button-family button-secondary" id="copyLinkBtn">Copy Link</button>
      </div>
      <article class="recipe-detail">
        <h1>${recipe.title}</h1>
        <p class="recipe-description">${recipe.description}</p>
        <div class="recipe-meta">
          <div class="meta-primary">
            <span class="badge">${formatRecipeCategories(recipe, ' • ')}</span>
            <button class="print-recipe-btn button-family button-primary" id="printRecipeBtn" type="button">Print Recipe</button>
            <button class="cook-mode-btn button-family button-secondary" id="cookModeBtn" type="button" aria-pressed="false">Cook Mode: Off</button>
          </div>
        </div>
        ${renderNutritionSection(recipe)}
        <p class="cook-mode-status" id="cookModeStatus" aria-live="polite"></p>
        ${recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0 ? `<div class="recipe-tags">${recipe.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        ${renderServingsControl(recipe)}
        <div class="recipe-image-outer"><img src="${getRecipeOriginalImageUrl(recipe)}" alt="${recipe.title}" class="recipe-image" id="recipe-image-zoom" style="cursor: zoom-in;"></div>
        <div class="recipe-content-wrapper">
          ${hasIngredients ? `
            <section class="recipe-section">
              <h2>Ingredients</h2>
              <div id="ingredientsContainer">${renderIngredientsMarkup(recipe.ingredients)}</div>
            </section>
          ` : '<p class="incomplete-warning">Ingredients data incomplete</p>'}
        </div>
        ${hasSteps ? `
          <section class="recipe-section">
            <h2>Instructions</h2>
            <ol class="steps-list">
              ${recipe.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
          </section>
        ` : '<p class="incomplete-warning">Instructions data incomplete</p>'}
        ${notesArray.length > 0 ? `
          <section class="recipe-section">
            <h2>Notes</h2>
            <ul class="notes-list">
              ${notesArray.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </section>
        ` : ''}
        ${isIncomplete ? `<div class="incomplete-message"><p><strong>⚠️ Recipe data incomplete:</strong> This recipe is missing ingredients or instructions. Please check back later or contact the maintainer.</p></div>` : ''}
      </article>
      <div class="recipe-nav">
        ${prevRecipe ? `<a href="recipe-detail.html?id=${(prevRecipe.id)}" class="nav-btn prev-btn">← ${prevRecipe.title}</a>` : ''}
        ${nextRecipe ? `<a href="recipe-detail.html?id=${(nextRecipe.id)}" class="nav-btn next-btn">${nextRecipe.title} →</a>` : ''}
      </div>
      <div id="imageModal" class="image-modal">
        <span class="image-modal-close">&times;</span>
        <img class="image-modal-content" id="modalImage" src="" alt="">
      </div>
    `;
    
    // Attach copy link button handler
    const copyBtn = document.getElementById('copyLinkBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 1500);
          }).catch(() => {
            fallbackCopy(url);
          });
        } else {
          fallbackCopy(url);
        }
      });
    }

    const printBtn = document.getElementById('printRecipeBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    setupCookModeControl();
    setupServingsControl(recipe);
  }

  function fallbackCopy(url) {
    const userInput = prompt('Copy the link below:', url);
    if (userInput !== null) {
      // User clicked OK, text is already in the prompt for selection
    }
  }

  // Read recipe ID from URL and render detail view
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');
  
  if (recipeId) {
    const recipe = recipes.find(r => (r.id) === recipeId);
    if (recipe) {
      renderDetailedView(recipe);
      
      // Setup image zoom modal
      setTimeout(() => {
        const imageZoom = document.getElementById('recipe-image-zoom');
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const closeBtn = document.querySelector('.image-modal-close');
        
        if (imageZoom && modal && modalImg && closeBtn) {
          imageZoom.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = imageZoom.src;
            modalImg.alt = imageZoom.alt;
          });
          
          closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
          });
          
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              modal.style.display = 'none';
            }
          });
        }
      }, 0);
    } else {
      detailedViewEl.innerHTML = '<p>Recipe not found. <a href="recipes-list.html">Back to recipes</a></p>';
    }
  }
}

// Adrien's Baking Corner recipe detail page. Mirrors the 'detail' block
// above, but links back into abc.html / abc-recipe-detail.html instead of
// the main site, and adds the optional "Adrien's Notes" callout.
if (pageType === 'abc-detail' && detailedViewEl) {
  function renderDetailedView(recipe) {
    setSeo(recipe.title, recipe.description || '');

    // Validate recipe has required fields
    const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
    const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;
    const isIncomplete = !hasIngredients || !hasSteps;

    // Find current recipe index for Previous/Next navigation
    const currentIndex = navigableRecipes.findIndex(r => r.id === recipe.id);
    const prevRecipe = currentIndex > 0 ? navigableRecipes[currentIndex - 1] : null;
    const nextRecipe = currentIndex < navigableRecipes.length - 1 ? navigableRecipes[currentIndex + 1] : null;

    // Helper to safely render notes (can be array or string for backwards compatibility)
    const notesArray = Array.isArray(recipe.notes) ? recipe.notes : (recipe.notes ? [recipe.notes] : []);

    detailedViewEl.innerHTML = `
      <div class="detail-controls">
        <button class="back-btn button-family button-secondary" onclick="window.location.href='abc.html'">← Back to Adrien's Baking Corner</button>
        <button class="copy-link-btn button-family button-secondary" id="copyLinkBtn">Copy Link</button>
      </div>
      <article class="recipe-detail">
        <h1>${recipe.title}</h1>
        <p class="recipe-description">${recipe.description}</p>
        <div class="recipe-meta">
          <div class="meta-primary">
            <span class="badge">${formatRecipeCategories(recipe, ' • ')}</span>
            <button class="print-recipe-btn button-family button-primary" id="printRecipeBtn" type="button">Print Recipe</button>
            <button class="cook-mode-btn button-family button-secondary" id="cookModeBtn" type="button" aria-pressed="false">Cook Mode: Off</button>
          </div>
        </div>
        ${renderNutritionSection(recipe)}
        <p class="cook-mode-status" id="cookModeStatus" aria-live="polite"></p>
        ${recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0 ? `<div class="recipe-tags">${recipe.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        ${renderServingsControl(recipe)}
        <div class="recipe-image-outer"><img src="${getRecipeOriginalImageUrl(recipe)}" alt="${recipe.title}" class="recipe-image" id="recipe-image-zoom" style="cursor: zoom-in;"></div>
        <div class="recipe-content-wrapper">
          ${hasIngredients ? `
            <section class="recipe-section">
              <h2>Ingredients</h2>
              <div id="ingredientsContainer">${renderIngredientsMarkup(recipe.ingredients)}</div>
            </section>
          ` : '<p class="incomplete-warning">Ingredients data incomplete</p>'}
        </div>
        ${hasSteps ? `
          <section class="recipe-section">
            <h2>Instructions</h2>
            <ol class="steps-list">
              ${recipe.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
          </section>
        ` : '<p class="incomplete-warning">Instructions data incomplete</p>'}
        ${notesArray.length > 0 ? `
          <section class="recipe-section">
            <h2>Notes</h2>
            <ul class="notes-list">
              ${notesArray.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </section>
        ` : ''}
        ${recipe.adrienNotes ? `
          <section class="recipe-section">
            <div class="adrien-notes-callout">
              <h2>📝 Adrien's Notes</h2>
              <p>${recipe.adrienNotes}</p>
            </div>
          </section>
        ` : ''}
        ${isIncomplete ? `<div class="incomplete-message"><p><strong>⚠️ Recipe data incomplete:</strong> This recipe is missing ingredients or instructions. Please check back later or contact the maintainer.</p></div>` : ''}
      </article>
      <div class="recipe-nav">
        ${prevRecipe ? `<a href="abc-recipe-detail.html?id=${(prevRecipe.id)}" class="nav-btn prev-btn">← ${prevRecipe.title}</a>` : ''}
        ${nextRecipe ? `<a href="abc-recipe-detail.html?id=${(nextRecipe.id)}" class="nav-btn next-btn">${nextRecipe.title} →</a>` : ''}
      </div>
      <div id="imageModal" class="image-modal">
        <span class="image-modal-close">&times;</span>
        <img class="image-modal-content" id="modalImage" src="" alt="">
      </div>
    `;

    // Attach copy link button handler
    const copyBtn = document.getElementById('copyLinkBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.textContent = originalText;
            }, 1500);
          }).catch(() => {
            fallbackCopy(url);
          });
        } else {
          fallbackCopy(url);
        }
      });
    }

    const printBtn = document.getElementById('printRecipeBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    setupCookModeControl();
    setupServingsControl(recipe);
  }

  function fallbackCopy(url) {
    const userInput = prompt('Copy the link below:', url);
    if (userInput !== null) {
      // User clicked OK, text is already in the prompt for selection
    }
  }

  // Read recipe ID from URL and render detail view
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');

  if (recipeId) {
    const recipe = recipes.find(r => (r.id) === recipeId);
    if (recipe) {
      renderDetailedView(recipe);

      // Setup image zoom modal
      setTimeout(() => {
        const imageZoom = document.getElementById('recipe-image-zoom');
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const closeBtn = document.querySelector('.image-modal-close');

        if (imageZoom && modal && modalImg && closeBtn) {
          imageZoom.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = imageZoom.src;
            modalImg.alt = imageZoom.alt;
          });

          closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
          });

          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              modal.style.display = 'none';
            }
          });
        }
      }, 0);
    } else {
      detailedViewEl.innerHTML = '<p>Recipe not found. <a href="abc.html">Back to Adrien\'s Baking Corner</a></p>';
    }
  }
}

// If we're on the nutrition info page, render the per-recipe ingredient
// nutrition breakdown and disclaimer.
if (pageType === 'nutrition-info' && detailedViewEl) {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');
  const recipe = recipes.find(r => (r.id) === recipeId);

  if (recipe) {
    setSeo(`Nutrition Info: ${recipe.title}`, 'Ingredient nutrition data, sources, and disclaimer for this recipe.');
    detailedViewEl.innerHTML = renderNutritionInfoSection(recipe);

    const toggleBtn = document.getElementById('toggleAllIngredientsBtn');
    const recipeTable = document.getElementById('recipeIngredientsTable');
    const allTable = document.getElementById('allIngredientsTable');
    if (toggleBtn && recipeTable && allTable) {
      toggleBtn.addEventListener('click', () => {
        const showingAll = !allTable.hidden;
        allTable.hidden = showingAll;
        recipeTable.hidden = !showingAll;
        toggleBtn.textContent = showingAll ? 'Show All Ingredients' : "Show This Recipe's Ingredients";
      });
    }

    // Wire sortable column headers: clicking Ingredient or Source th sorts
    // the tbody rows alphabetically; clicking again reverses the order.
    // Excluded rows (colspan note rows) stay at the bottom.
    function wireSortableTable(tableEl) {
      if (!tableEl) return;
      const table = tableEl.querySelector('table');
      if (!table) return;
      table.querySelectorAll('th.th-sortable').forEach((th) => {
        const colIndex = parseInt(th.dataset.col, 10);
        let ascending = true;
        th.setAttribute('aria-sort', 'none');
        th.addEventListener('click', () => {
          const tbody = table.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const excluded = rows.filter((r) => r.classList.contains('nutrition-info-row-excluded'));
          const sortable = rows.filter((r) => !r.classList.contains('nutrition-info-row-excluded'));

          sortable.sort((a, b) => {
            const aText = (a.cells[colIndex]?.textContent || '').trim().toLowerCase();
            const bText = (b.cells[colIndex]?.textContent || '').trim().toLowerCase();
            return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
          });

          // Reset all sort indicators on this table's headers
          table.querySelectorAll('th.th-sortable').forEach((h) => h.setAttribute('aria-sort', 'none'));
          th.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
          ascending = !ascending;

          tbody.replaceChildren(...sortable, ...excluded);
        });
      });
    }

    wireSortableTable(document.getElementById('recipeIngredientsTable'));
    wireSortableTable(document.getElementById('allIngredientsTable'));
  } else {
    detailedViewEl.innerHTML = '<p>Recipe not found. <a href="recipes-list.html">Back to recipes</a></p>';
  }
}

// Category grid scroll arrows
const categoryGrid = document.getElementById('categoryGrid');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

if (categoryGrid && scrollLeftBtn && scrollRightBtn) {
  const scrollAmount = 150;

  scrollLeftBtn.addEventListener('click', () => {
    categoryGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  scrollRightBtn.addEventListener('click', () => {
    categoryGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Update button states based on scroll position
  function updateButtonStates() {
    const isAtStart = categoryGrid.scrollLeft === 0;
    const isAtEnd = categoryGrid.scrollLeft + categoryGrid.clientWidth >= categoryGrid.scrollWidth - 10;
    
    scrollLeftBtn.disabled = isAtStart;
    scrollRightBtn.disabled = isAtEnd;
  }

  categoryGrid.addEventListener('scroll', updateButtonStates);
  updateButtonStates();
}
