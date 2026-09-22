// Renders both Test Kitchen pages: the index (wip-recipes.html, a list of
// links) and a single recipe (wip-recipe-detail.html?id=...). Each block
// below only runs when its own page's container exists, so one file
// safely covers both without touching anything else.

function wipFlagEnabled() {
  return !!window.flagsService?.isEnabled('wipRecipes');
}

function wipGatedMessage() {
  return '<p class="incomplete-warning">Nothing to see here unless you flip the right flag.</p>';
}

function renderWipIngredients(ingredients) {
  const isSection = (entry) => entry && typeof entry === 'object' && Array.isArray(entry.items);
  if (ingredients.some(isSection)) {
    return ingredients.map((entry) => {
      if (isSection(entry)) {
        return `<h3>${entry.title}</h3><ul class="ingredients-list">${entry.items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
      }
      return `<ul class="ingredients-list"><li>${entry}</li></ul>`;
    }).join('');
  }
  return `<ul class="ingredients-list">${ingredients.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}

function renderWipRecipeCard(recipe) {
  const ingredients = recipe.ingredients || [];
  const steps = recipe.steps || [];
  const whatWorked = recipe.whatWorked || [];
  const needsWork = recipe.needsWork || [];
  const meta = [
    recipe.servings ? `Serves ${recipe.servings}` : '',
    recipe.source ? `Source: ${recipe.source}` : '',
  ].filter(Boolean).join(' • ');

  return `
    <h1>${recipe.title}</h1>
    ${meta ? `<p class="recipe-description">${meta}</p>` : ''}
    ${ingredients.length ? `
      <section class="recipe-section">
        <h2>Ingredients</h2>
        ${renderWipIngredients(ingredients)}
      </section>
    ` : ''}
    ${steps.length ? `
      <section class="recipe-section">
        <h2>Steps</h2>
        <ol class="steps-list">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      </section>
    ` : ''}
    ${whatWorked.length ? `
      <section class="recipe-section">
        <h2>What worked</h2>
        <ul class="notes-list">${whatWorked.map((n) => `<li>${n}</li>`).join('')}</ul>
      </section>
    ` : ''}
    ${needsWork.length ? `
      <section class="recipe-section">
        <h2>Needs work</h2>
        <ul class="notes-list">${needsWork.map((n) => `<li>${n}</li>`).join('')}</ul>
      </section>
    ` : ''}
    ${recipe.notes ? `<p class="recipe-description">${recipe.notes}</p>` : ''}
  `;
}

// wip-recipes.html: index of links, no recipe content.
(function renderWipIndex() {
  const container = document.getElementById('wipRecipesContent');
  if (!container) return;

  if (!wipFlagEnabled()) {
    container.innerHTML = wipGatedMessage();
    return;
  }

  const recipes = window.wipRecipes || [];
  if (recipes.length === 0) {
    container.innerHTML = '<p class="incomplete-warning">Nothing in the test kitchen yet.</p>';
    return;
  }

  container.innerHTML = `
    <ul class="wip-recipe-list">
      ${recipes.map((r) => {
        const meta = [
          r.servings ? `Serves ${r.servings}` : '',
          r.source || '',
        ].filter(Boolean).join(' • ');
        return `
          <li>
            <a href="wip-recipe-detail.html?id=${encodeURIComponent(r.id)}" class="wip-recipe-list-link">
              <span class="wip-recipe-list-title">${r.title}</span>
              ${meta ? `<span class="wip-recipe-list-meta">${meta}</span>` : ''}
            </a>
          </li>
        `;
      }).join('')}
    </ul>
  `;
})();

// wip-recipe-detail.html: a single recipe, looked up by ?id=.
(function renderWipDetail() {
  const container = document.getElementById('wipRecipeDetailContent');
  if (!container) return;

  if (!wipFlagEnabled()) {
    container.innerHTML = wipGatedMessage();
    return;
  }

  const id = new URLSearchParams(window.location.search).get('id');
  const recipe = (window.wipRecipes || []).find((r) => r.id === id);

  if (!recipe) {
    container.innerHTML = '<p class="incomplete-warning">Recipe not found.</p>';
    return;
  }

  container.innerHTML = renderWipRecipeCard(recipe);
})();
