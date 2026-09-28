// Feature flag service for JoMama's Recipes.
//
// This is the "local" implementation: flag values come from the registry
// in feature-flags.js, with optional per-browser overrides stored in
// localStorage (set on flags.html). It's what powers both local dev and
// the live site today.
//
// If this site ever needs centrally managed rollouts, swap this file for
// one backed by a real flag service (e.g. LaunchDarkly) that implements
// the same window.flagsService API:
//   isEnabled(key)
//   getAll()
//   setOverride(key, value)
//   clearOverride(key)
// and keep this file around for local dev.

const FLAG_STORAGE_PREFIX = 'flag:';

function readFlagOverride(key) {
  const raw = localStorage.getItem(FLAG_STORAGE_PREFIX + key);
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return null;
}

window.flagsService = {
  // Returns the effective on/off state for a flag: the per-browser
  // override if one is set, otherwise the registry default.
  isEnabled(key) {
    const override = readFlagOverride(key);
    if (override !== null) return override;
    return !!window.featureFlags?.[key]?.default;
  },

  // Returns all flags with their default, any override, and effective
  // value; used to render the flags page.
  getAll() {
    return Object.entries(window.featureFlags || {}).map(([key, flag]) => {
      const override = readFlagOverride(key);
      return {
        key,
        label: flag.label || key,
        description: flag.description || '',
        default: !!flag.default,
        override,
        value: override !== null ? override : !!flag.default,
      };
    });
  },

  // Sets a per-browser override, ignoring the registry default.
  setOverride(key, value) {
    localStorage.setItem(FLAG_STORAGE_PREFIX + key, value ? 'true' : 'false');
  },

  // Removes the override so the flag falls back to its registry default.
  clearOverride(key) {
    localStorage.removeItem(FLAG_STORAGE_PREFIX + key);
  },
};
