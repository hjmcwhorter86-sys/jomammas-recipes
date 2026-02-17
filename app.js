// JoMama Recipes Site - Heather's macro-friendly comfort food collection

const recipes = window.recipes || [];

// Detect page type from meta tag
const pageType = document.querySelector('meta[name="page-type"]')?.getAttribute('content') || 'home';

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
    <a class="newest-card" href="recipe-detail.html?id=${r.id}">
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
    "pepper-jack-queso",
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
    return recipe.category || '';
  }

  popularEl.innerHTML = popular.map(r => {
    const badgeText = getBadgeText(r);
    return `
    <a class="newest-card" href="recipe-detail.html?id=${r.id}">
      <div class="newest-card-image-wrapper">
        ${r.image ? `<img src="${r.image}" alt="${r.title}" class="newest-card-image">` : ''}
        ${badgeText ? `<span class="recipe-badge">${badgeText}</span>` : ''}
      </div>
      <div class="newest-card-inner">
        <h4>${r.title}</h4>
        <p>${r.description}</p>
        <div class="meta-small">${r.category || ''}</div>
      </div>
    </a>
  `;}).join('');
}

// If we're on the recipes list page, initialize recipes page functionality
if (pageType === 'list' && recipesEl && searchEl) {
  const allCategories = [...new Set(recipes.map(r => r.category))].sort();
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
      const imageUrl = r.image && r.image.trim() ? r.image : 'images/no-photo.jpg';
      
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
              <span class="category-pill">${r.category}</span>
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
            <span class="badge">${recipe.category}</span>
            <button class="print-recipe-btn button-family button-primary" id="printRecipeBtn" type="button">Print Recipe</button>
          </div>
          ${recipe.calories ? `<span class="meta-item">Calories: ${recipe.calories}</span>` : ''}
          ${recipe.protein ? `<span class="meta-item">Protein: ${recipe.protein}</span>` : ''}
        </div>
        ${recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0 ? `<div class="recipe-tags">${recipe.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        ${recipe.image ? `<div class="recipe-image-outer"><img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" id="recipe-image-zoom" style="cursor: zoom-in;"></div>` : ''}
        <div class="recipe-content-wrapper">
          ${hasIngredients ? `
            <section class="recipe-section">
              <h2>Ingredients</h2>
              <ul class="ingredients-list">
                ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
              </ul>
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

// If we're on the recipe detail page, handle detail view rendering
if (pageType === 'detail' && detailedViewEl) {
  function renderDetailedView(recipe) {
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
            <span class="badge">${recipe.category}</span>
            <button class="print-recipe-btn button-family button-primary" id="printRecipeBtn" type="button">Print Recipe</button>
          </div>
          ${recipe.calories ? `<span class="meta-item">Calories: ${recipe.calories}</span>` : ''}
          ${recipe.protein ? `<span class="meta-item">Protein: ${recipe.protein}</span>` : ''}
        </div>
        ${recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0 ? `<div class="recipe-tags">${recipe.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        ${recipe.image ? `<div class="recipe-image-outer"><img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" id="recipe-image-zoom" style="cursor: zoom-in;"></div>` : ''}
        <div class="recipe-content-wrapper">
          ${hasIngredients ? `
            <section class="recipe-section">
              <h2>Ingredients</h2>
              <ul class="ingredients-list">
                ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
              </ul>
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
