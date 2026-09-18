// Units system preference for JoMama's Recipes.
//
// Lets visitors switch ingredient quantities between US customary units
// (cups, tbsp, tsp, oz, lb) and metric (ml, l, g, kg). The choice is stored
// per-browser in localStorage and applied by app.js when rendering
// ingredient lines. Defaults to "us" since the site's recipes are written
// for a US audience.

const UNIT_SYSTEM_STORAGE_KEY = 'unitSystem';

window.unitsService = {
  getSystem() {
    const stored = localStorage.getItem(UNIT_SYSTEM_STORAGE_KEY);
    return stored === 'metric' ? 'metric' : 'us';
  },

  setSystem(system) {
    localStorage.setItem(UNIT_SYSTEM_STORAGE_KEY, system === 'metric' ? 'metric' : 'us');
  },
};
