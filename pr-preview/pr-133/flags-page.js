// Renders the flag toggle list on flags.html, backed by window.flagsService.
function renderFlagsList() {
  const container = document.getElementById('flagsList');
  if (!container) return;

  const flags = window.flagsService.getAll();

  container.innerHTML = flags.map((flag) => `
    <div class="flag-row">
      <div class="flag-info">
        <p class="flag-label">${flag.label}</p>
        ${flag.description ? `<p class="flag-description">${flag.description}</p>` : ''}
        <p class="flag-status">
          Default: ${flag.default ? 'On' : 'Off'}
          ${flag.override !== null ? ' • Overridden in this browser' : ''}
        </p>
      </div>
      <div class="flag-controls">
        <label class="flag-toggle">
          <input type="checkbox" data-flag-key="${flag.key}" ${flag.value ? 'checked' : ''} />
          <span class="flag-toggle-track"><span class="flag-toggle-thumb"></span></span>
        </label>
        <button type="button" class="flag-reset" data-flag-key="${flag.key}" ${flag.override === null ? 'disabled' : ''}>
          Reset to default
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('input[data-flag-key]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const key = event.target.dataset.flagKey;
      window.flagsService.setOverride(key, event.target.checked);
      renderFlagsList();
    });
  });

  container.querySelectorAll('.flag-reset').forEach((button) => {
    button.addEventListener('click', (event) => {
      const key = event.target.dataset.flagKey;
      window.flagsService.clearOverride(key);
      renderFlagsList();
    });
  });
}

renderFlagsList();
