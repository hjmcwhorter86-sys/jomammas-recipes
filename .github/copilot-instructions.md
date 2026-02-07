# Copilot Instructions for jomammas-recipes

## Project Overview
- **Type:** Simple static web app for browsing and searching recipes
- **Tech Stack:** Vanilla HTML, CSS, JavaScript
- **Purpose:** Display macro-friendly comfort food recipes with search functionality

## Architecture & Data Flow
- All application logic resides in `app.js` (no frameworks or build tools)
- Recipes data is stored as a static array of objects in `app.js`
- DOM manipulation targets elements by ID: `recipes` (container), `search` (input), `filters` (buttons)
- Rendering handled by `render(list)` function, which generates HTML strings for recipe cards using `<details>/<summary>` for expandability
- Filtering performed by `filterRecipes(q, category)`, combining search query and category selection
- Search input and category buttons trigger real-time filtering and re-rendering
- Recipe cards are expandable/collapsible using native `<details>` elements

## Patterns & Conventions
- Recipe objects structure: `{ title: string, description: string, calories: string, protein: string, category: string, tags: string[], ingredients?: string[], steps?: string[], notes?: string[] }`
- Cards use `<details class="card"><summary>title and desc</summary>meta and tags, optional ingredients (ul), steps (ol), notes (ul)</details>` structure
- Tags rendered as `<span class="tag">` elements within `.tags` container
- Filter buttons generated from unique categories in recipe data, with 'All' option
- No external libraries, modules, or asynchronous code
- HTML generation uses template literals with `.map().join("")` pattern
- Event handling relies on native `<details>` behavior; summary styled to hide marker and appear as card

## Developer Workflow
- Edit `app.js` for data, logic, or rendering changes
- Edit `index.html` for page structure or element additions
- Edit `styles.css` for visual styling adjustments
- Preview changes by opening `index.html` directly in a web browser (no server or build process required)
- No package managers, linters, or test runners configured

## Examples
- **Adding a recipe:** Append a new object to the `recipes` array in `app.js`
- **Modifying search logic:** Update the conditions in `filterRecipes(q)` function
- **Changing card layout:** Adjust CSS rules for `.card`, `.meta`, or `.tags` in `styles.css`
- **Adding new features:** Implement directly in `app.js` without external dependencies
- **Modifying card expandability:** Update the `<details>/<summary>` structure in the `render()` function's template
- **Adding recipe details:** Include optional `ingredients`, `steps`, `notes` arrays in recipe objects for expanded content- **Adding category filtering:** Generate filter buttons from unique `category` values and update `filterRecipes` to handle category parameter
## Key Files
- [`app.js`](../../app.js): Core data, rendering, and filtering logic
- [`index.html`](../../index.html): HTML structure and DOM element IDs
- [`styles.css`](../../styles.css): Complete visual styling

## Notes
- Maintain all logic in `app.js` until complexity warrants refactoring
- No hidden build steps, environment setup, or deployment processes
- Recipes data includes placeholders like "~?" for unknown nutritional values
- Tags are used for categorization and are searchable
