// Data and rendering for kitchen-basics-oils-fats.html. Kept out of app.js
// since it's specific to this one page, not loaded site-wide.
//
// Smoke points and saturated-fat percentages are approximate — they vary by
// brand, refinement level, and ripeness/source, and are meant as a relative
// guide rather than lab-precise values.
const oilsAndFats = [
  {
    id: 'vegetable-oil',
    name: 'Vegetable / Canola Oil',
    smokePointF: 400,
    smokePointLabel: '~400–450°F (204–232°C)',
    smokePointNote: 'Refined and tolerant of high heat — the everyday default.',
    flavorRank: 1,
    flavorLabel: 'Mildest — virtually neutral',
    saturatedPct: 7,
    fatProfile: 'Lowest saturated fat here; mostly mono/polyunsaturated',
    bestFor: ['Baking', 'Frying', 'Everyday sautéing', 'Neutral base for mayo/vinaigrettes'],
    description: 'The all-purpose workhorse oil: flavorless, affordable, and tolerant of high heat, which is why it shows up in everything from cake batter to a deep fryer. It is not the most exciting oil in the pantry, but it is the one to reach for when you do not want the oil itself to be noticed.',
  },
  {
    id: 'grapeseed-oil',
    name: 'Grapeseed Oil',
    smokePointF: 420,
    smokePointLabel: '~420°F (216°C)',
    smokePointNote: 'High enough for searing and stir-frying.',
    flavorRank: 2,
    flavorLabel: 'Very mild — neutral with a faint nuttiness',
    saturatedPct: 10,
    fatProfile: 'Mostly polyunsaturated',
    bestFor: ['Sautéing', 'Stir-frying', 'Mayo / aioli', 'Salad dressings'],
    description: 'A light, clean-tasting oil pressed from grape seeds (a wine-making byproduct). It handles high heat well and does not compete with other flavors — a good neutral substitute anywhere you would use vegetable oil.',
  },
  {
    id: 'sunflower-oil',
    name: 'Sunflower Oil',
    smokePointF: 440,
    smokePointLabel: '~440°F (227°C)',
    smokePointNote: 'Stable at high heat, common in fried foods.',
    flavorRank: 3,
    flavorLabel: 'Mild — neutral, slightly nutty',
    saturatedPct: 10,
    fatProfile: 'Mostly polyunsaturated',
    bestFor: ['Frying', 'Sautéing', 'Baking'],
    description: 'Another high-heat neutral oil. It is common in fried and packaged foods because it is stable, inexpensive, and does not carry a strong flavor into the food.',
  },
  {
    id: 'light-olive-oil',
    name: 'Refined (Light) Olive Oil',
    smokePointF: 465,
    smokePointLabel: '~465°F (240°C)',
    smokePointNote: 'Refining raises the smoke point well above extra virgin.',
    flavorRank: 4,
    flavorLabel: 'Mild — faint olive note',
    saturatedPct: 14,
    fatProfile: 'Mostly monounsaturated — same fat profile as extra virgin',
    bestFor: ['Searing', 'Roasting', 'High-heat sautéing'],
    description: '"Light" refers to flavor and color, not calories — it is the same fat as extra virgin olive oil, just refined to remove most of the taste and raise the smoke point. Use it when you want olive oil\'s cooking properties without its flavor competing at high heat.',
  },
  {
    id: 'avocado-oil',
    name: 'Avocado Oil',
    smokePointF: 500,
    smokePointLabel: '~500–520°F (260–271°C)',
    smokePointNote: 'The highest smoke point of any common cooking oil.',
    flavorRank: 5,
    flavorLabel: 'Mild — faint buttery, grassy note',
    saturatedPct: 12,
    fatProfile: 'Mostly monounsaturated',
    bestFor: ['Searing', 'Grilling', 'Roasting', 'Dressings (unrefined)'],
    description: 'Refined avocado oil tolerates more heat than almost anything else in the kitchen, which makes it the go-to for searing steaks or blasting a wok. Unrefined avocado oil has more flavor and nutrients but a lower smoke point, so it suits dressings and finishing better than the pan.',
  },
  {
    id: 'shortening',
    name: 'Vegetable Shortening',
    smokePointF: 360,
    smokePointLabel: '~360°F (182°C)',
    smokePointNote: 'Moderate — used more for texture than high-heat cooking.',
    flavorRank: 6,
    flavorLabel: 'Mild — essentially flavorless',
    saturatedPct: 28,
    fatProfile: 'Moderately saturated; modern versions are non-hydrogenated',
    bestFor: ['Pie crusts', 'Biscuits', 'Frosting'],
    description: '100% fat with no water, which is what gives pie crusts their famous flakiness and frosting its stability. Older formulations relied on partially hydrogenated oil (a major trans-fat source); most shortening sold today has been reformulated to avoid that, but it is worth checking the label.',
  },
  {
    id: 'peanut-oil',
    name: 'Peanut Oil',
    smokePointF: 450,
    smokePointLabel: '~450°F (232°C)',
    smokePointNote: 'High and long-lasting, a classic deep-fry oil.',
    flavorRank: 7,
    flavorLabel: 'Mild — faint, pleasant nuttiness',
    saturatedPct: 17,
    fatProfile: 'Balanced monounsaturated and polyunsaturated',
    bestFor: ['Deep frying', 'Stir-frying', 'Wok cooking'],
    description: 'A classic deep-frying oil — high smoke point, long fry life, and a light nuttiness that pairs especially well with stir-fries. Skip it if anyone at the table has a peanut allergy; refined versions are usually allergen-safe, but always check the label.',
  },
  {
    id: 'butter',
    name: 'Butter',
    smokePointF: 325,
    smokePointLabel: '~300–350°F (150–177°C)',
    smokePointNote: 'Milk solids scorch quickly — the lowest smoke point here.',
    flavorRank: 8,
    flavorLabel: 'Mild–medium — sweet, milky, and rich',
    saturatedPct: 51,
    fatProfile: 'Mostly saturated (dairy fat)',
    bestFor: ['Baking', 'Pan sauces', 'Finishing', 'Spreading'],
    description: 'The default fat in most kitchens for a reason: it browns beautifully, carries flavor into sauces, and makes baked goods tender. Its milk solids scorch quickly, though, so it is not built for high heat — clarify it into ghee if you need butter flavor at higher temperatures.',
  },
  {
    id: 'ghee',
    name: 'Ghee',
    smokePointF: 485,
    smokePointLabel: '~485°F (252°C)',
    smokePointNote: 'Milk solids removed, so it handles far more heat than butter.',
    flavorRank: 9,
    flavorLabel: 'Medium — concentrated, nutty butter flavor',
    saturatedPct: 62,
    fatProfile: 'Highly saturated (pure milk fat)',
    bestFor: ['High-heat sautéing', 'Searing', 'Indian cooking', 'Popcorn'],
    description: 'Butter that has been simmered to cook off the water and strain out the milk solids, leaving pure butterfat behind. Removing those solids is what lets ghee handle far more heat than butter while keeping a rich, toasty, butter-forward flavor.',
  },
  {
    id: 'lard',
    name: 'Lard',
    smokePointF: 370,
    smokePointLabel: '~370°F (188°C)',
    smokePointNote: 'Medium-high, good for frying and flaky pastry.',
    flavorRank: 10,
    flavorLabel: 'Medium — savory, faintly porky',
    saturatedPct: 39,
    fatProfile: 'Roughly even split of saturated and monounsaturated fat',
    bestFor: ['Pie crusts', 'Tamales', 'Refried beans', 'Frying'],
    description: 'Rendered pork fat that gives baked goods a flaky, savory edge butter cannot match. It is actually less saturated than butter, gram for gram, despite its old-fashioned reputation.',
  },
  {
    id: 'evoo',
    name: 'Extra Virgin Olive Oil',
    smokePointF: 375,
    smokePointLabel: '~325–410°F (163–210°C)',
    smokePointNote: 'Unrefined, so it breaks down sooner than refined olive oil.',
    flavorRank: 11,
    flavorLabel: 'Medium–strong — fruity, grassy, sometimes peppery',
    saturatedPct: 14,
    fatProfile: 'Mostly monounsaturated',
    bestFor: ['Dressings', 'Dipping', 'Drizzling', 'Low–medium heat sautéing'],
    description: 'Unrefined and cold-pressed, extra virgin olive oil carries the most flavor (and the most nutrients) of any olive oil, which is exactly why it shines uncooked — in dressings, dips, and finishing drizzles. It can handle a real sauté, just not a screaming-hot sear.',
  },
  {
    id: 'coconut-oil',
    name: 'Coconut Oil',
    smokePointF: 350,
    smokePointLabel: '~350°F unrefined / ~400°F refined (177–204°C)',
    smokePointNote: 'Refining trades away coconut flavor for a higher smoke point.',
    flavorRank: 12,
    flavorLabel: 'Strong (unrefined) — distinct coconut flavor; refined is nearly neutral',
    saturatedPct: 87,
    fatProfile: 'Very high in saturated fat, largely medium-chain triglycerides',
    bestFor: ['Baking', 'Curries', 'High-heat sautéing (refined)', 'Vegan butter substitute'],
    description: 'Solid at room temperature and unmistakably coconut-flavored in its unrefined (virgin) form; refined coconut oil strips out that flavor and raises the smoke point if you want the texture without the taste. It is one of the most saturated fats on this list, though its medium-chain fats behave a bit differently in the body than long-chain saturated fats.',
  },
  {
    id: 'sesame-oil',
    name: 'Toasted Sesame Oil',
    smokePointF: 350,
    smokePointLabel: '~350°F (177°C)',
    smokePointNote: 'A finishing oil, not a high-heat cooking oil.',
    flavorRank: 13,
    flavorLabel: 'Strongest — deeply nutty and toasty',
    saturatedPct: 14,
    fatProfile: 'Balanced mono/polyunsaturated with moderate saturated fat',
    bestFor: ['Finishing', 'Stir-fries (off heat)', 'Dressings', 'Marinades'],
    description: 'Pressed from toasted sesame seeds, this is a finishing oil, not a cooking oil — a few drops at the end of cooking deliver an outsized nutty punch. Its lighter, untoasted cousin (regular sesame oil) is milder and can handle more heat, but toasted is the one worth keeping on hand.',
  },
];

function kbInit() {
  const smokeListEl = document.getElementById('kbSmokeList');
  const flavorListEl = document.getElementById('kbFlavorList');
  const nutritionListEl = document.getElementById('kbNutritionList');
  const allGridEl = document.getElementById('kbAllGrid');
  if (!smokeListEl || !flavorListEl || !nutritionListEl || !allGridEl) return;

  const bySmokePoint = [...oilsAndFats].sort((a, b) => a.smokePointF - b.smokePointF);
  smokeListEl.innerHTML = bySmokePoint.map((o) => `
    <div class="kb-row">
      <div class="kb-row-name">${o.name}</div>
      <div class="kb-row-value">${o.smokePointLabel}</div>
      <div class="kb-row-note">${o.smokePointNote}</div>
    </div>
  `).join('');

  const byFlavor = [...oilsAndFats].sort((a, b) => a.flavorRank - b.flavorRank);
  flavorListEl.innerHTML = byFlavor.map((o) => `
    <div class="kb-row">
      <div class="kb-row-name">${o.name}</div>
      <div class="kb-row-value">${o.flavorLabel}</div>
    </div>
  `).join('');

  const maxSaturated = Math.max(...oilsAndFats.map((o) => o.saturatedPct));
  const byNutrition = [...oilsAndFats].sort((a, b) => a.saturatedPct - b.saturatedPct);
  nutritionListEl.innerHTML = byNutrition.map((o) => `
    <div class="kb-row kb-row-bar">
      <div class="kb-row-name">${o.name}</div>
      <div class="kb-bar-track">
        <div class="kb-bar-fill" style="width: ${(o.saturatedPct / maxSaturated) * 100}%"></div>
      </div>
      <div class="kb-row-value">${o.saturatedPct}% saturated</div>
      <div class="kb-row-note">${o.fatProfile}</div>
    </div>
  `).join('');

  allGridEl.innerHTML = oilsAndFats.map((o) => `
    <div class="kb-card">
      <h3>${o.name}</h3>
      <p class="kb-card-description">${o.description}</p>
      <dl class="kb-card-stats">
        <div><dt>Smoke point</dt><dd>${o.smokePointLabel}</dd></div>
        <div><dt>Flavor</dt><dd>${o.flavorLabel}</dd></div>
        <div><dt>Fat profile</dt><dd>${o.fatProfile}</dd></div>
      </dl>
      <div class="kb-card-bestfor">
        ${o.bestFor.map((use) => `<span class="tag">${use}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function kbInitTabs() {
  const tabs = Array.from(document.querySelectorAll('.kb-tab'));
  const panels = Array.from(document.querySelectorAll('.kb-panel'));
  if (tabs.length === 0) return;

  function selectTab(tab) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.getAttribute('aria-controls');
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const nextIndex = event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      selectTab(tabs[nextIndex]);
    });
  });

  // Lets links from elsewhere on the site (e.g. an ingredient's "why this
  // matters" link) open straight to a specific tab via #flavor, #nutrition, etc.
  const linkedTab = tabs.find((t) => t.dataset.tab === location.hash.slice(1));
  if (linkedTab) selectTab(linkedTab);
}

kbInit();
kbInitTabs();
