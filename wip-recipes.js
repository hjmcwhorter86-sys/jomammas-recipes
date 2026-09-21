// Renders wip-recipes.html. Self-contained: does not touch #detailed-view
// on any other page-type, since it only runs when #wipRecipesContent exists.
(function () {
  const container = document.getElementById('wipRecipesContent');
  if (!container) return;

  const enabled = !!window.flagsService?.isEnabled('wipRecipes');

  if (!enabled) {
    container.innerHTML = '<p class="incomplete-warning">Nothing to see here unless you flip the right flag.</p>';
    return;
  }

  const recipes = window.wipRecipes || [];

  if (recipes.length === 0) {
    container.innerHTML = '<p class="incomplete-warning">Nothing in the test kitchen yet.</p>';
    return;
  }

  container.innerHTML = recipes.map(renderRecipe).join('');

  function renderRecipe(recipe) {
    const ingredients = recipe.ingredients || [];
    const steps = recipe.steps || [];
    const whatWorked = recipe.whatWorked || [];
    const needsWork = recipe.needsWork || [];

    return `
      <section class="recipe-section wip-recipe-card">
        <h2>${recipe.title}</h2>
        ${recipe.source ? `<p class="recipe-description">Source: ${recipe.source}</p>` : ''}
        ${ingredients.length ? `
          <h3>Ingredients</h3>
          <ul class="ingredients-list">${ingredients.map((i) => `<li>${i}</li>`).join('')}</ul>
        ` : ''}
        ${steps.length ? `
          <h3>Steps</h3>
          <ol class="steps-list">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>
        ` : ''}
        ${whatWorked.length ? `
          <h3>What worked</h3>
          <ul class="notes-list">${whatWorked.map((n) => `<li>${n}</li>`).join('')}</ul>
        ` : ''}
        ${needsWork.length ? `
          <h3>Needs work</h3>
          <ul class="notes-list">${needsWork.map((n) => `<li>${n}</li>`).join('')}</ul>
        ` : ''}
        ${recipe.notes ? `<p class="recipe-description">${recipe.notes}</p>` : ''}
      </section>
    `;
  }
})();
