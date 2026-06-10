// JoMama Recipes Site - Heather's macro-friendly comfort food collection

const recipes = window.recipes || [];

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

function renderNutritionSection(recipe) {
  const formatValue = (value) => (value === null || value === undefined || value === '') ? '—' : value;
  return `
          <div class="recipe-nutrition">
            <h3>Nutrition (per serving)</h3>
            <ul class="nutrition-list">
              <li><strong>Calories:</strong> ${formatValue(recipe.calories)}</li>
              <li><strong>Protein:</strong> ${formatValue(recipe.protein)}</li>
              <li><strong>Carbs:</strong> ${formatValue(recipe.carbs)}</li>
              <li><strong>Fat:</strong> ${formatValue(recipe.fat)}</li>
              <li><strong>Fiber:</strong> ${formatValue(recipe.fiber)}</li>
            </ul>
          </div>`;
}

function getRecipeImageUrl(recipe) {
  if (!recipe || typeof recipe.image !== 'string') {
    return 'images/no-photo.jpg';
  }

  const normalizedPath = recipe.image.trim().replace(/\\/g, '/');
  return normalizedPath || 'images/no-photo.jpg';
}

// Maps decimal fractions to their unicode glyphs for ingredient quantity display.
const QUANTITY_FRACTION_MAP = [
  [0.125, '⅛'],
  [0.25, '¼'],
  [0.333, '⅓'],
  [0.5, '½'],
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
    parts.push(formatQuantityDisplay(item.qty, item.qtyMax, item.approx));
    if (item.unit) parts.push(getUnitDisplay(item.unit, item.qty, item.qtyMax));
  }
  parts.push(item.name);

  let line = parts.join(' ');
  if (item.notes) line += ` (${item.notes})`;

  const hasAlt = (item.altQty !== null && item.altQty !== undefined) || item.altUnit || item.altName;
  if (hasAlt) {
    const altParts = [];
    if (item.altQty !== null && item.altQty !== undefined) {
      altParts.push(formatQuantityDisplay(item.altQty, null, false));
      if (item.altUnit) altParts.push(getUnitDisplay(item.altUnit, item.altQty, null));
    } else if (item.altUnit) {
      altParts.push(item.altUnit);
    }
    if (item.altName) altParts.push(item.altName);
    line += ` (or ${altParts.join(' ')})`;
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

// Detect page type from meta tag
const pageType = document.querySelector('meta[name="page-type"]')?.getAttribute('content') || 'home';

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
  const newest = [...recipes]
    .filter(r => r.dateAdded)
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 4);

  newestEl.innerHTML = newest.map(r => `
    <a class="newest-card" href="recipe-detail.html?id=${r.id}">
      <img src="${getRecipeImageUrl(r)}" alt="${r.title}" class="newest-card-image">
      <div class="newest-card-inner">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <div class="meta-small">${formatRecipeCategories(r)}</div>
      </div>
    </a>
  `).join('');
}

// Homepage: render popular recipes into #popular when present
const popularEl = document.getElementById('popular');
if (popularEl) {
  const popularRecipeIds = [
    "light-tuscan-chicken",
    "light-chicken-alfredo-pasta",
    "air-fryer-general-tsos-chicken",
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
    <a class="newest-card" href="recipe-detail.html?id=${r.id}">
      <div class="newest-card-image-wrapper">
        <img src="${getRecipeImageUrl(r)}" alt="${r.title}" class="newest-card-image">
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
      
      // Build meta items for the meta row
      let metaItems = [];
      if (r.calories && r.calories.trim()) metaItems.push(`<span class="meta-item">${r.calories}</span>`);
      if (r.protein && r.protein.trim()) metaItems.push(`<span class="meta-item">${r.protein}</span>`);
      
      return `
        <a href="recipe-detail.html?id=${(r.id)}" class="card recipe-card">
          <div class="recipe-card-image-wrapper">
            <img src="${imageUrl}" alt="${r.title}" class="recipe-card-image" />
          </div>
          <div class="recipe-card-content">
            <h3>${r.title}</h3>
            <p>${r.description}</p>
            <div class="recipe-meta-row">
              <span class="category-pill">${formatRecipeCategories(r)}</span>
              ${metaItems.length > 0 ? `<div class="recipe-meta-items">${metaItems.join(' • ')}</div>` : ''}
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
    const currentIndex = recipes.findIndex(r => r.id === recipe.id);
    const prevRecipe = currentIndex > 0 ? recipes[currentIndex - 1] : null;
    const nextRecipe = currentIndex < recipes.length - 1 ? recipes[currentIndex + 1] : null;
    
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
        ${recipe.servings ? `<div class="recipe-servings"><strong>Servings:</strong> ${recipe.servings}</div>` : ''}
        <div class="recipe-image-outer"><img src="${getRecipeImageUrl(recipe)}" alt="${recipe.title}" class="recipe-image" id="recipe-image-zoom" style="cursor: zoom-in;"></div>
        <div class="recipe-content-wrapper">
          ${hasIngredients ? `
            <section class="recipe-section">
              <h2>Ingredients</h2>
              ${renderIngredientsMarkup(recipe.ingredients)}
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
  }

  function fallbackCopy(url) {
    const userInput = prompt('Copy the link below:', url);
    if (userInput !== null) {
      // User clicked OK, text is already in the prompt for selection
    }
  }

  function filterRecipes(q, category = 'All') {
    let list = recipes;
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
    const currentIndex = recipes.findIndex(r => r.id === recipe.id);
    const prevRecipe = currentIndex > 0 ? recipes[currentIndex - 1] : null;
    const nextRecipe = currentIndex < recipes.length - 1 ? recipes[currentIndex + 1] : null;
    
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
        ${recipe.servings ? `<div class="recipe-servings"><strong>Servings:</strong> ${recipe.servings}</div>` : ''}
        <div class="recipe-image-outer"><img src="${getRecipeImageUrl(recipe)}" alt="${recipe.title}" class="recipe-image" id="recipe-image-zoom" style="cursor: zoom-in;"></div>
        <div class="recipe-content-wrapper">
          ${hasIngredients ? `
            <section class="recipe-section">
              <h2>Ingredients</h2>
              ${renderIngredientsMarkup(recipe.ingredients)}
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
