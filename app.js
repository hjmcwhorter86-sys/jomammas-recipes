// JoMama Recipes Site - Heather's macro-friendly comfort food collection

const recipes = window.recipes || [];

const recipesEl = document.getElementById("recipes");
const searchEl = document.getElementById("search");
const detailedViewEl = document.getElementById("detailed-view");

// Homepage: render newest recipes into #newest when present
const newestEl = document.getElementById('newest');
if (newestEl) {
  const newest = [...recipes]
    .filter(r => r.dateAdded)
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 4);

  newestEl.innerHTML = newest.map(r => `
    <a class="newest-card" href="recipes.html?id=${r.id}">
      ${r.image ? `<img src="${r.image}" alt="${r.title}" class="newest-card-image">` : ''}
      <div class="newest-card-inner">
        <h4>${r.title}</h4>
        <p>${r.description}</p>
        <div class="meta-small">${r.category || ''}</div>
      </div>
    </a>
  `).join('');
}

// Homepage: render popular recipes into #popular when present
const popularEl = document.getElementById('popular');
if (popularEl) {
  const popularRecipeIds = [
    "cornflake-chicken-tenders",
    "light-chicken-alfredo-pasta",
    "pepper-jack-queso"
  ];

  const popular = popularRecipeIds
    .map(id => recipes.find(r => r.id === id))
    .filter(Boolean);

  popularEl.innerHTML = popular.map(r => `
    <a class="newest-card" href="recipes.html?id=${r.id}">
      ${r.image ? `<img src="${r.image}" alt="${r.title}" class="newest-card-image">` : ''}
      <div class="newest-card-inner">
        <h4>${r.title}</h4>
        <p>${r.description}</p>
        <div class="meta-small">${r.category || ''}</div>
      </div>
    </a>
  `).join('');
}

// If we're not on the recipes page, do nothing.
if (!recipesEl || !searchEl) {
  // app.js loaded on a page that doesn't have the recipes UI.
} else {
  const allCategories = [...new Set(recipes.map(r => r.category))].sort();
  let currentCategory = 'All';

  function render(list) {
    recipesEl.innerHTML = list.map(r => `
      <a href="recipes.html?id=${(r.id)}" class="card">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <div class="meta">Calories: ${r.calories} • Protein: ${r.protein}</div>
        <div class="tags">
          ${r.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
      </a>
    `).join("");
  }

  function renderDetailedView(recipe) {
    if (!detailedViewEl) return;
    
    // Find current recipe index for Previous/Next navigation
    const currentIndex = recipes.findIndex(r => r.id === recipe.id);
    const prevRecipe = currentIndex > 0 ? recipes[currentIndex - 1] : null;
    const nextRecipe = currentIndex < recipes.length - 1 ? recipes[currentIndex + 1] : null;
    
    detailedViewEl.innerHTML = `
      <div class="detail-controls">
        <button class="back-btn" onclick="window.location.href='recipes.html'">← Back to Recipes</button>
        <button class="copy-link-btn" id="copyLinkBtn">Copy Link</button>
      </div>
      <article class="recipe-detail">
        <h1>${recipe.title}</h1>
        <p class="recipe-description">${recipe.description}</p>
        <div class="recipe-meta">
          <span class="badge">${recipe.category}</span>
          ${recipe.calories ? `<span class="meta-item">Calories: ${recipe.calories}</span>` : ''}
          ${recipe.protein ? `<span class="meta-item">Protein: ${recipe.protein}</span>` : ''}
        </div>
        ${recipe.tags ? `<div class="recipe-tags">${recipe.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        ${recipe.image ? `<div class="recipe-image-outer"><img src="${recipe.image}" alt="${recipe.title}" class="recipe-image"></div>` : ''}
        <div class="recipe-content-wrapper">
          ${recipe.ingredients ? `
            <section class="recipe-section">
              <h2>Ingredients</h2>
              <ul class="ingredients-list">
                ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
              </ul>
            </section>
          ` : ''}
        </div>
        ${recipe.steps ? `
          <section class="recipe-section">
            <h2>Instructions</h2>
            <ol class="steps-list">
              ${recipe.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
          </section>
        ` : ''}
        ${recipe.notes ? `
          <section class="recipe-section">
            <h2>Notes</h2>
            <ul class="notes-list">
              ${recipe.notes.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </section>
        ` : ''}
      </article>
      <div class="recipe-nav">
        ${prevRecipe ? `<a href="recipes.html?id=${(prevRecipe.id)}" class="nav-btn prev-btn">← ${prevRecipe.title}</a>` : ''}
        ${nextRecipe ? `<a href="recipes.html?id=${(nextRecipe.id)}" class="nav-btn next-btn">${nextRecipe.title} →</a>` : ''}
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
      list = list.filter(r => r.category === category);
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

  // Prefill search from `q` query parameter when present (recipes.html?q=...)
  // Also read `category` parameter from URL (recipes.html?category=Chicken)
  // Or show detailed view if `id` parameter present (recipes.html?id=recipe-slug)
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
      const headerContent = document.querySelector('header');
      if (headerContent) {
        const searchInput = headerContent.querySelector('#search');
        if (searchInput) searchInput.style.display = 'none';
      }
      // Show detailed view
      renderDetailedView(recipe);
    } else {
      // Recipe not found, show grid
      const initialQuery = urlParams.get('q') || '';
      const initialCategory = urlParams.get('category') || 'All';
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
    const initialCategory = urlParams.get('category') || 'All';
    
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
