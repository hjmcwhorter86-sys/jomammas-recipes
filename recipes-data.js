// Structured ingredient shape used throughout this file. Each ingredient
// in `ingredients` (or `items` within a `{title, items}` section) is an
// object with these fields:
//
//   qty:      number | null  - quantity (null = non-quantifiable, e.g.
//                               "salt and pepper to taste")
//   qtyMax:   number | null  - set only for ranges, e.g. "½–¾ cup" =>
//                               qty: 0.5, qtyMax: 0.75
//   unit:     string | null  - canonical singular unit matching
//                               data/units.js (or null for count items
//                               like "2 eggs")
//   name:     string         - ingredient name/description, used for
//                               nutrition lookups
//   notes:    string | null  - prep/description text with NO surrounding
//                               punctuation; the renderer always wraps it
//                               as " (notes)"
//   approx:   boolean        - true prepends "~" to the displayed quantity
//   optional: boolean        - metadata only; "Optional:"/"(optional)"
//                               wording stays in name/notes as written
//   altQty/altUnit/altName:   only for genuine alternatives with their own
//                               measured quantity, e.g.
//                               "4½ oz parmesan (or 3 oz mozzarella)"
//   display:  string | null  - escape hatch: if set, render verbatim and
//                               ignore the fields above for display
//   note:     string | null  - short explanation of *why* this specific
//                               ingredient/quantity matters (e.g. "low heat,
//                               adds flavor"); shown as the tooltip/label for
//                               guideLink below. Only set when there's a real
//                               story to tell — not every ingredient needs one.
//   guideLink: { guideId, tab } | null - links this ingredient to a Kitchen
//                               Basics guide (see data/kitchen-basics-guides.js
//                               for guideId values and kitchen-basics.js for
//                               tab names). Renders a small "?" after the
//                               ingredient that opens the guide to that tab.
//
// Quantities are stored as decimals and normalized to unicode fractions
// for display (e.g. 1.25 -> "1¼", 0.333 -> "⅓") via formatQuantityDisplay
// in app.js. Units are pluralized for display based on data/units.js.

window.recipes = [
  {
  id: "cornflake-chicken-tenders",
  title: "Bang Bang Cornflake Chicken Tenders",
  description: "Crispy air-fried cornflake chicken with sweet-heat bang bang sauce — fast, crunchy, and family-approved.",
  image: "images/cornflake-chicken-tenders-air-fry.png",
  category: "Chicken",
  dateAdded: "2026-02-04",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "4-6",
  tags: ["air fryer", "chicken", "sweet heat", "family favorite"],

  ingredients: [
    { qty: 600, unit: "g", name: "chicken tenders", notes: "about 12" },
    { qty: 2, unit: null, name: "eggs" },
    { qty: 60, unit: "g", name: "flour" },
    { qty: 100, unit: "g", name: "cornflakes", notes: "crushed" },
    { qty: 2, unit: "tsp", name: "garlic powder" },
    { qty: 2, unit: "tsp", name: "onion powder" },
    { qty: null, unit: null, name: "Salt and pepper, to taste" },
    { qty: null, unit: null, name: "Cooking oil spray", notes: "~20 sprays" },

    { qty: 200, unit: "g", name: "nonfat Greek yogurt" },
    { qty: 60, unit: "g", name: "sweet chili sauce" },
    { qty: 2, unit: "tsp", name: "sriracha", notes: "or to taste" },
    { qty: 40, unit: "g", name: "honey" },

    { qty: null, unit: null, name: "Optional: extra sweet chili sauce for brushing", notes: "about 5 g per tender", optional: true }
  ],

  steps: [
    "Season chicken with salt, pepper, garlic powder, and onion powder.",
    "Set up three bowls: flour, whisked eggs, and crushed cornflakes.",
    "Dredge each tender in flour, then egg, then cornflakes. Press flakes firmly onto chicken.",
    "Place tenders in air fryer basket and spray lightly with cooking oil.",
    "Air fry at 200°C / 390°F for 15 minutes, flipping halfway if needed, until golden and cooked through.",
    "In a bowl, mix Greek yogurt, sweet chili sauce, sriracha, and honey to make bang bang sauce.",
    "Optional extra-saucy mode: brush a little sweet chili sauce on each cooked tender, then dip into bang bang sauce."
  ],

  notes: [
    "For ultra crunch, really press the cornflakes onto the chicken.",
    "Bang bang sauce keeps 3–4 days in the fridge.",
    "Great for wraps, salads, or snack plates."
  ]
},

  {
  id: "light-chicken-alfredo-pasta",
  title: "Lightened-Up Chicken Alfredo (Protein Pasta Edition)",
  description: "Silky, glossy Alfredo vibes with lighter ingredients and big protein energy — feeds the whole family.",
  image: "images/light-chicken-alfredo.jpg",
  category: "Pasta",
  dateAdded: "2026-02-04",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "~500 per serving",
  protein: "~54g per serving",
  servings: "6",
  tags: ["pasta", "high protein", "family dinner", "comfort food"],

  ingredients: [
    { qty: 2, unit: "lb", name: "chicken breast", notes: "thin-sliced, boneless skinless" },
    { qty: 1.25, unit: "tsp", name: "kosher salt" },
    { qty: 0.75, unit: "tsp", name: "black pepper" },
    { qty: 0.75, unit: "tsp", name: "garlic powder" },
    { qty: 0.75, unit: "tsp", name: "paprika" },
    { qty: 1.5, unit: "tsp", name: "light butter", notes: "or light margarine, Smart Balance" },

    { qty: 12, unit: "oz", name: "protein pasta", notes: "Barilla Protein+, Goodles, etc." },

    { qty: 2, unit: "cup", name: "1% milk" },
    { qty: 1.25, unit: "tsp", name: "sodium citrate" },
    { qty: 3, unit: "tbsp", name: "light butter", notes: "or margarine" },
    { qty: 4.5, unit: "oz", name: "reduced-fat parmesan", notes: "finely grated", display: "4½ oz reduced-fat parmesan, finely grated (or 3 oz parm + 1½ oz reduced-fat mozzarella)" },
    { qty: 3, unit: "clove", name: "garlic", notes: "minced" },
    { qty: null, unit: null, name: "Black pepper, to taste" },
    { qty: null, unit: null, name: "Optional: tiny pinch nutmeg", optional: true },

    { qty: null, unit: null, name: "Optional add-ins: broccoli, peas, spinach, or roasted Brussels sprouts", optional: true }
  ],

  steps: [
    "Cook pasta in well-salted water. Reserve about ¾ cup pasta water, then drain.",
    "Heat light butter in a large skillet or Dutch oven over medium-high. Season chicken and sear (in batches if needed) until golden and cooked through. Remove to a plate.",
    "Lower heat to medium-low. Add garlic and sauté about 30 seconds.",
    "Pour in milk and warm gently (do not boil). Whisk in sodium citrate until dissolved. Stir in light butter until melted.",
    "Reduce heat to low. Gradually add cheese, stirring constantly until smooth and glossy.",
    "Add pasta and sliced chicken. Toss to coat, adding reserved pasta water as needed for desired sauce consistency.",
    "Finish with black pepper, adjust salt, optional nutmeg, and any veggies. Serve immediately."
  ],

  notes: [
    "Pasta water fixes everything — thin with a splash or thicken with a brief simmer.",
    "Optional protein boost: stir in 1–2 tbsp Greek yogurt off-heat.",
    "Leftovers reheat well with a splash of milk."
  ]
},

  {
  id: "pepper-jack-queso",
  title: "Sodium Citrate Pepper Jack Queso (Eva’s Chili-Spiced Version)",
  description: "Ultra-smooth, pourable queso made with real cheese, light dairy, and sodium citrate — kid-approved but flavor-forward.",
  image: "images/sodium-citrate-queso-dip.png",
  category: "Snacks & Sides",
  dateAdded: "2026-02-04",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "4",
  tags: ["queso", "dip", "cheese", "party"],

  ingredients: [
    { qty: 1, unit: "cup", name: "skim milk" },
    { qty: 0.25, unit: "cup", name: "half-and-half" },
    { qty: 1, unit: "tbsp", name: "light margarine", notes: "Smart Balance" },
    { qty: 1, unit: "tsp", name: "sodium citrate" },
    { qty: 8, unit: "oz", name: "pepper jack cheese", notes: "freshly shredded" },
    { qty: 2, qtyMax: 3, unit: "tbsp", name: "diced pickled jalapeños", notes: "to taste" },
    { qty: null, unit: null, name: "Black pepper, to taste" },

    { qty: null, unit: null, name: "Pinch dark Mexican chili powder" },
    { qty: null, unit: null, name: "Pinch ancho chili powder" },
    { qty: null, unit: null, name: "Pinch cayenne pepper" },
    { qty: null, unit: null, name: "Small pinch salt", notes: "optional; adjust to taste", optional: true }
  ],

  steps: [
    "In a saucepan over medium-low, add skim milk, half-and-half, margarine, and sodium citrate.",
    "Whisk until margarine melts and sodium citrate is fully dissolved. Heat until hot and steamy (do not boil).",
    "Reduce heat to low. Add shredded pepper jack gradually, whisking constantly until smooth and glossy.",
    "Stir in jalapeños, black pepper, and all seasonings.",
    "Taste and adjust heat or salt if needed.",
    "Serve warm. Reheat gently with a splash of skim milk if it thickens."
  ],

  notes: [
    "For thicker queso, reduce skim milk to ¾ cup.",
    "For looser queso, add 1–2 tbsp skim milk when reheating.",
    "No flour or cornstarch needed — sodium citrate handles emulsification."
  ]
}
,{
  id: "protein-cheesecake-jars",
  title: "Protein Cheesecake Jars",
  description: "No-bake high-protein cheesecake jars for dessert wins.",
  image: "images/cheesecake-jars.png",
  calories: "~135 per jar",
  protein: "~18g per jar",
  servings: "4",
  category: "Dessert",
  dateAdded: "2026-02-04",
  carbs: null,
  fat: null,
  fiber: null,
  ingredients: [
  { qty: 1, unit: "cup", name: "low-fat cottage cheese" },
  { qty: 1, unit: "cup", name: "nonfat Greek yogurt" },
  { qty: 1, unit: null, name: "box sugar-free cheesecake or vanilla pudding mix" },
  { qty: 1, unit: null, name: "scoop vanilla protein powder" },
  { qty: 1, qtyMax: 2, unit: "tbsp", name: "Jordan's Skinny Syrup Vanilla or Vanilla Caramel", notes: "you can also use a sugar-free sweetener of your choice" },
],
steps: [
  "Blend cottage cheese until completely smooth.",
  "Add Greek yogurt, pudding mix, protein powder, syrup; blend until thick and glossy.",
  "Portion into jars and chill 30–60 minutes (overnight is best).",
],
notes: [
  "Too thick? Add a splash of milk.",
  "Too loose? Add a bit more Greek yogurt or a pinch more pudding mix.",
  "Top with fresh berries, crushed graham crackers, or sugar-free caramel sauce."
],
tags: ["dessert", "high protein"]
},

{ 
  id: "skillet-salisbury-steak",
  title: "Easy Skillet Salisbury Steak",
  description: "Classic comfort food with a tangy gravy twist — fast, cozy, and family-approved.",
  image: "images/salisbury-steak.png",
  category: "Beef",
  dateAdded: "2026-02-04",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "~310 per serving (with gravy)",
  protein: "~25g per serving",
  servings: "4",
  tags: ["beef", "skillet", "comfort food", "weeknight"],

  ingredients: [
    { qty: 1, unit: "lb", name: "ground beef (93/7)" },
    { qty: 1/3, unit: "cup", name: "Italian-style breadcrumbs" },
    { qty: 2, unit: "tsp", name: "ketchup" },
    { qty: 1, unit: "tsp", name: "mustard" },
    { qty: 1, unit: "tsp", name: "Worcestershire sauce" },
    { qty: 0.5, unit: "tsp", name: "garlic powder" },
    { qty: 0.5, unit: "tsp", name: "onion powder" },
    { qty: null, unit: null, name: "Salt and pepper, to taste" },
    { qty: 1, unit: "tbsp", name: "olive oil" },

    { qty: 2, unit: null, name: "packets brown gravy mix" },
    { qty: 2, unit: "cup", name: "hot water" },
    { qty: 1, unit: "tsp", name: "ketchup", notes: "for gravy" },
    { qty: 0.5, unit: "tsp", name: "Worcestershire sauce", notes: "for gravy" }
  ],

  steps: [
    "Combine ground beef, bread crumbs, ketchup, mustard, Worcestershire, garlic powder, onion powder, salt, and pepper in a large bowl. Mix gently by hand.",
    "Heat olive oil in a large skillet over medium heat.",
    "Form meat mixture into patties and cook on both sides until no longer pink.",
    "Lower heat to low.",
    "Whisk gravy mix with hot water until smooth, then whisk in ketchup and Worcestershire.",
    "Pour gravy over patties and let simmer until heated through and thickened."
  ],

  notes: [
    "Serve with mashed potatoes and green beans for full comfort mode.",
    "Patties can be shaped ahead and refrigerated until ready to cook."
  ]
},

{
  id: "quick-lobster-bisque",
  title: "Quick Lobster Bisque",
  description: "Creamy, cozy lobster bisque made fast with Better Than Bouillon — rich flavor without the restaurant fuss.",
  image: "images/quick-lobster-bisque.png",
  category: ["Soup", "Seafood"],
  dateAdded: "2026-02-11",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "~185 per serving",
  protein: "~9g per serving",
  servings: "4-6",
  tags: ["seafood", "soup", "easy", "weeknight", "comfort food"],

  ingredients: [
    { qty: 2, unit: "cup", name: "half & half", notes: "or milk" },
    { qty: 1, unit: "cup", name: "water" },
    { qty: 2, unit: "tbsp", name: "dry white wine" },
    { qty: 1.5, unit: "tbsp", name: "Better Than Bouillon Seasoned Lobster Base" },
    { qty: 3, unit: "tbsp", name: "flour" },
    { qty: 2, unit: "tbsp", name: "tomato paste" },
    { qty: 0.25, unit: "tsp", name: "paprika" },
    { qty: 0.5, unit: "cup", name: "minced lobster meat", notes: "or langoustine tail meat" },
    { qty: null, unit: null, name: "Fresh herbs", notes: "parsley or chives" }
  ],

  steps: [
    "In a saucepan over medium heat, add half & half, water, wine, lobster base, flour, tomato paste, and paprika.",
    "Bring to a boil while stirring. Reduce heat and add lobster. Simmer for 5 minutes.",
    "Top with fresh herbs and serve."
  ],

  notes: [
    "Great with grilled cheese or crusty bread.",
    "For extra richness, swap part of the milk for heavy cream.",
    "Top with extra minced lobster meat for a heartier bowl."
  ]
},

{
  id: "air-fryer-general-tsos-chicken",
  title: "Air Fryer General Tso’s Chicken",
  description: "Crispy, saucy, and lighter than takeout — perfect for a quick weeknight Asian-inspired dinner.",
  image: "images/air-fryer-general-tsos-chicken.png",
  category: "Chicken",
  dateAdded: "2026-02-11",
  servings: "4",
  carbs: null,
  fat: null,
  fiber: null,
  tags: ["air fryer", "chicken", "weeknight", "easy", "takeout fix", "high protein", "asian"],
  calories: "~370 per serving (with 1/2 cup cooked brown rice)",
  protein: "~38g",

  ingredients: [
    { qty: 1.5, unit: "lb", name: "chicken breast", notes: "boneless skinless, cut into 1-inch cubes" },
    { qty: 2, unit: "tbsp", name: "cornstarch" },
    { qty: 1, unit: "tbsp", name: "flour", notes: "optional, for extra crispness", optional: true },
    { qty: 1, unit: "tsp", name: "kosher salt" },
    { qty: 0.5, unit: "tsp", name: "garlic powder" },
    { qty: 1, qtyMax: 2, unit: "tsp", name: "avocado oil", notes: "or light spray" },
    { qty: 0.5, qtyMax: 2/3, unit: "cup", name: "Iron Kitchen General Tso's sauce", notes: "enough to coat without drowning" },

    { qty: null, unit: null, name: "Optional: steamed broccoli florets", optional: true },
    { qty: null, unit: null, name: "Optional: bell pepper strips", optional: true },
    { qty: null, unit: null, name: "Optional: snow peas or snap peas", optional: true },
    { qty: null, unit: null, name: "Optional for serving: brown rice", optional: true },
    { qty: null, unit: null, name: "Optional garnish: sesame seeds, sliced green onions", optional: true }
  ],

  steps: [
    "Prep chicken: Pat dry, then toss in a bowl with cornstarch, flour (if using), salt, and garlic powder until evenly coated.",
    "Air fry: Spray lightly with avocado oil. Air fry at 390°F for 6–8 minutes, shake basket, then cook another 4–6 minutes until golden and cooked through.",
    "Heat sauce: In a large skillet or wok, warm the General Tso’s sauce over medium heat.",
    "Combine: Toss cooked chicken into the sauce until coated. Add steamed veggies at this stage if using.",
    "Serve: Over brown rice. Garnish with sesame seeds and green onions if you want it to look like you paid $18 for it."
  ],

  notes: [
    "For a lighter plate: go heavy on veggies and lighter on rice.",
    "For better calorie control: brush sauce on instead of pouring.",
    "If you want extra crisp: don’t overcrowd the basket; cook in batches."
  ]
},

{
  id: "air-fryer-chicken-parmesan",
  title: "Air Fryer Chicken Parmesan",
  description: "Crispy comfort, lighter macros, family win.",
  image: "images/air-fryer-chicken-parmesan.jpg",
  category: "Chicken",
  dateAdded: "2026-02-11",
  carbs: null,
  fat: null,
  fiber: null,
  servings: "4",
  tags: ["air fryer", "kid-friendly", "low calorie", "high protein", "italian"],

  // Optional macros (leave blank if you don't want to estimate yet)
  calories: "~400 per serving",
  protein: "~49g per serving",

  ingredients: [
    { qty: 1.25, qtyMax: 1.5, unit: "lb", name: "chicken breast", notes: "thin-sliced, boneless skinless" },
    { qty: 0.5, unit: "cup", name: "Italian-style breadcrumbs", notes: "or panko + Italian seasoning" },
    { qty: 0.25, unit: "cup", name: "parmesan", notes: "grated" },
    { qty: 1, unit: "tsp", name: "garlic powder" },
    { qty: 0.5, unit: "tsp", name: "onion powder" },
    { qty: null, unit: null, name: "Salt & pepper, to taste" },
    { qty: 2, unit: null, name: "eggs", notes: "whisked" },
    { qty: null, unit: null, name: "Cooking spray" },
    { qty: 1, unit: "cup", name: "marinara", notes: "Rao's or whatever red sauce speaks to your soul", approx: true },
    { qty: 0.75, qtyMax: 1, unit: "cup", name: "reduced-fat shredded mozzarella" },
    { qty: null, unit: null, name: "Extra parmesan for sprinkling" },
  ],

  steps: [
    "Bread the chicken: Set up two bowls. Bowl 1: whisked eggs. Bowl 2: breadcrumbs + parmesan + garlic powder + onion powder + salt & pepper. Dip chicken in egg, then press into breadcrumb mix to coat.",
    "Air fry: Preheat air fryer to 390°F. Spray basket and tops of chicken lightly. Cook 6–7 minutes, flip, spray again, then cook 5–6 minutes more until golden and cooked through.",
    "Parm it up: Spoon marinara over each piece. Top with mozzarella + extra parm. Air fry 2–3 minutes until cheese melts and bubbles.",
    "Serve: Plate chicken over spaghetti squash (or protein pasta). Optional garnish: basil, parsley, and crushed red pepper."
  ],

  notes: [
    "Want it extra crispy? Add 1 tbsp cornstarch to the breadcrumb mix."
  ]
},

{
  id: "buffalo-chicken-enchiladas",
  title: "Buffalo Chicken Enchiladas",
  description: "Spicy chicken enchiladas perfect for a weeknight meal to feed a large family.",
  image: "images/buffalo-chicken-enchiladas.jpg",
  category: "Chicken",
  dateAdded: "2026-02-11",
  carbs: null,
  fat: null,
  fiber: null,
  servings: "5",
  tags: ["casserole", "comfort food", "weeknight", "spicy"],

  calories: "~820 per serving",
  protein: "~52g per serving",

  ingredients: [
    { qty: 3, unit: "tbsp", name: "unsalted butter", notes: "melted, plus more for greasing the pan" },
    { qty: 4, unit: "cup", name: "shredded cooked chicken", notes: "rotisserie" },
    { qty: 8, unit: "oz", name: "cream cheese", notes: "at room temperature" },
    { qty: 2, unit: "cup", name: "shredded cheddar" },
    { qty: 1, unit: "cup", name: "buffalo sauce", notes: "plus more for serving" },
    { qty: 1, unit: "bunch", name: "green onions", notes: "thinly sliced, white and green parts separated" },
    { qty: 0.25, unit: "tsp", name: "ground cumin" },
    { qty: 10, unit: null, name: "corn or flour tortillas" },
    { qty: 2, unit: "tbsp", name: "crumbled blue cheese" },
    { qty: 2, unit: "tbsp", name: "ranch or blue cheese dressing" }
  ],

  steps: [
    "Preheat oven to 400°F and butter a 9×13-inch baking dish.",
    "In a large bowl, mix chicken, cream cheese, 1 cup cheddar, 1/3 cup hot sauce, scallion whites, and cumin until well combined.",
    "In a medium bowl, stir together melted butter, remaining 2/3 cup hot sauce, and 3 tbsp water.",
    "Microwave tortillas in batches until warm and flexible, about 30 seconds. Keep wrapped in damp paper towels.",
    "Spoon chicken mixture down the center of each tortilla and roll up.",
    "Place enchiladas seam-side down in the prepared pan.",
    "Pour hot sauce mixture over tortillas.",
    "Top with remaining 1 cup cheddar and blue cheese. Bake 15–17 minutes until cheese is melted and bubbly.",
    "Drizzle with ranch or blue cheese dressing, sprinkle with scallion greens, and serve with extra hot sauce."
  ],

  notes: [
    "Want the kids to like it? Use flour tortillas and omit the blue cheese crumbles."
  ]
},

{
  id: "bbq-chicken-baked-potatoes",
  title: "BBQ Chicken Baked Potatoes",
  description: "Build-your-own BBQ chicken potato bar — easy weeknight comfort food.",
  image: "images/bbq-chicken-baked-potatoes.jpg",
  category: ["Slow Cooker", "Chicken"],
  dateAdded: "2026-02-12",
  carbs: null,
  fat: null,
  fiber: null,
  servings: "4",
  tags: ["weeknight", "comfort food", "slow cooker", "family dinner", "build your own"],

  calories: "~850 per fully loaded potato",
  protein: "~68g per fuly loaded potato",

  ingredients: [
    { qty: 4, unit: null, name: "large russet potatoes", notes: "jumbo if you're going full steakhouse mode" },
    { qty: 1, qtyMax: 2, unit: "tbsp", name: "olive oil" },
    { qty: 1, qtyMax: 1.5, unit: "tsp", name: "kosher salt", notes: "for skin" },
    { qty: null, unit: null, name: "Optional: freshly cracked black pepper", optional: true },

    { qty: 1.5, qtyMax: 2, unit: "lb", name: "chicken breast", notes: "boneless skinless" },
    { qty: 1, unit: "tsp", name: "kosher salt" },
    { qty: 0.5, unit: "tsp", name: "black pepper" },
    { qty: 1, unit: "tsp", name: "garlic powder" },
    { qty: 1, unit: "tsp", name: "smoked paprika" },
    { qty: 0.5, unit: "cup", name: "Sweet Baby Ray's Sugar-Free BBQ Sauce", notes: "or to taste" },

    { qty: null, unit: null, name: "Butter or light spread" },
    { qty: null, unit: null, name: "Light sour cream or plain Greek yogurt" },
    { qty: null, unit: null, name: "Reduced-fat shredded cheese" },
    { qty: null, unit: null, name: "Crispy bacon pieces" },
    { qty: null, unit: null, name: "Fresh chives", notes: "sliced" },
    { qty: null, unit: null, name: "Extra salt & pepper" },
    { qty: null, unit: null, name: "Hot sauce" }
  ],

  steps: [
    "Season chicken with salt, pepper, garlic powder, and smoked paprika. Place in slow cooker.",
    "Cook on LOW 2–3 hours until tender and shreddable (about 2 hours if your crockpot runs hot, closer to 3 for most).",
    "Shred chicken directly in the slow cooker, stir in BBQ sauce, and cook another 20–30 minutes until saucy.",
    "Switch slow cooker to keep warm setting.",
    
    "Preheat oven to 400°F.",
    "Scrub potatoes clean and dry thoroughly. Poke each potato all over with a fork (about 8–10 times) to allow steam to escape. Rub lightly with olive oil and sprinkle generously with kosher salt.",
    "Place potatoes directly on the oven rack with a sheet pan below. Bake 50–60 minutes until skins are crisp and centers are tender. Rest 5 minutes before slicing.",

    "Slice potatoes open and fluff insides with a fork. Season lightly.",
    "Add butter or yogurt/sour cream, then spoon BBQ chicken over top.",
    "Let everyone customize with cheese, bacon, chives, hot sauce, and serve immediately."
  ],

  notes: [
    "Keep it lighter with Greek yogurt, reduced-fat cheese, and skipping bacon.",
    "Going indulgent? Load it like a steakhouse and live your best life.",
    "For smaller portions, use medium russets and about 4 oz chicken per potato."
  ]
},

{
  id: "light-tuscan-chicken",
  title: "Light Tuscan Chicken",
  description: "A delicious, creamy Tuscan chicken that's light on calories.",
  image: "images/tuscan-chicken.jpg",
  category: "Chicken",
  dateAdded: "2026-02-12",
  carbs: null,
  fat: null,
  fiber: null,
  servings: "4",
  tags: ["italian", "low calorie", "chicken"],
  calories: "~310 per serving",
  protein: "~44g per serving",

  ingredients: [
    { qty: 4, unit: null, name: "chicken breast", notes: "boneless skinless" },
    { qty: 2, unit: "tsp", name: "olive oil" },
    { qty: 1, unit: null, name: "shallot", notes: "finely diced" },
    { qty: 3, unit: "clove", name: "garlic", notes: "minced" },
    { qty: 2, unit: "cup", name: "fresh spinach" },
    { qty: 0.25, unit: "cup", name: "sun-dried tomatoes", notes: "chopped", display: "1/4 cup sun-dried tomatoes, chopped (or <a href=\"recipe-detail.html?id=oven-blistered-cherry-tomatoes\">oven blistered tomatoes</a>)" },
    { qty: 0.5, unit: "cup", name: "reduced-sodium chicken broth" },
    { qty: 0.5, unit: "cup", name: "white cooking wine" },
    { qty: 3, unit: "oz", name: "light cream cheese", notes: "reduced-fat" },
    { qty: 0.25, unit: "cup", name: "parmesan", notes: "freshly grated" },
    { qty: 1, unit: "tsp", name: "Italian seasoning", notes: "divided" },
    { qty: 0.5, unit: "tsp", name: "garlic powder" },
    { qty: 0.25, unit: "tsp", name: "red pepper flakes", notes: "optional", optional: true },
    { qty: null, unit: null, name: "Salt and pepper, to taste" }
  ],

  steps: [
    "Season chicken breasts with salt, pepper, garlic powder, and half of the Italian seasoning.",
    "Heat olive oil in a large skillet over medium-high heat. Cook chicken 4–5 minutes per side until golden and cooked through (165°F). Remove and set aside.",
    "In the same skillet, cook shallot 2–3 minutes until softened. Add garlic and sauté 30 seconds.",
    "Stir in white cooking wine, scraping up browned bits. Simmer 2 minutes to reduce slightly.",
    "Add chicken broth and whisk in cream cheese until smooth.",
    "Mix in tomatoes, remaining Italian seasoning, and red pepper flakes. Simmer 2–3 minutes.",
    "Add spinach and cook until just wilted. Stir in Parmesan.",
    "Return chicken to skillet and spoon sauce over top before serving."
  ],
  notes: [
    "Serve with parmesan polenta, and vegetable of your choice"
  ]
},

{
  id: "protein-pasta-lo-mein",
  title: "Protein Pasta Chicken Lo Mein",
  description: "A large family size lo mein recipe to hit those takeout cravings.",
  image: "images/protein-pasta-chicken-lo-mein.png",
  category: "Pasta",
  dateAdded: "2026-02-19",
  carbs: null,
  fat: null,
  fiber: null,
  servings: "6",
  tags: ["takeout", "low calorie", "chicken", "pasta"],
  calories: "~480 per serving",
  protein: "~45g per serving",

  ingredients: [
    { qty: 411, unit: "g", name: "protein pasta", notes: "1 box (~14–15 oz), I use spaghetti" },
    { qty: 1, unit: null, name: "bag frozen stir-fry vegetables", notes: "12–16 oz" },
    { qty: 1.5, qtyMax: 2, unit: "lb", name: "chicken breast, cooked & sliced", display: "1½–2 lbs <a href=\"recipe-detail.html?id=seared-chicken-pieces\">chicken breast, cooked & sliced</a>" },
    { qty: 2, unit: "tsp", name: "avocado oil", notes: "or light butter" },
    { qty: 3, qtyMax: 4, unit: "clove", name: "garlic", notes: "minced" },
    { qty: 1, unit: "tsp", name: "grated ginger", optional: true, display: "Optional: 1 tsp grated ginger" },
    { qty: 1/3, unit: "cup", name: "low-sodium soy sauce" },
    { qty: 3, unit: "tbsp", name: "oyster sauce" },
    { qty: 2, qtyMax: 3, unit: "tbsp", name: "hoisin sauce" },
    { qty: 1.5, unit: "tbsp", name: "sesame oil" },
    { qty: 1.5, unit: "tbsp", name: "cornstarch" },
    { qty: 1, unit: "cup", name: "chicken broth", notes: "or half broth, half reserved pasta water" },
    { qty: null, unit: null, name: "A splash of rice vinegar" },
    { qty: null, unit: null, name: "A drizzle of Sriracha", notes: "optional", optional: true }
  ],

  steps: [
    "Cook pasta just to al dente. Reserve 1 cup of pasta water before draining.",
    "Heat oil in a large skillet or wok over medium-high. Cook vegetables 5–6 minutes until hot and tender.",
    "Add garlic and ginger. Cook 30 seconds until fragrant.",
    "Add sliced chicken and warm through.",
    "In a bowl, whisk soy sauce, oyster sauce, hoisin, sesame oil, cornstarch, broth, rice vinegar, and Sriracha until smooth.",
    "Pour sauce into the pan and simmer 1–2 minutes until thickened and glossy.",
    "Add cooked pasta and toss to combine.",
    "Add reserved pasta water as needed to loosen and coat everything evenly."
  ]
},

{
  id: "protein-buffalo-mac-and-cheese",
  title: "High Protein Buffalo Chicken Mac and Cheese",
  description: "Creamy buffalo chicken style mac and cheese that's loaded with protein.",
  image: "images/buffalo-chicken-mac-and-cheese.jpg",
  category: "Pasta",
  dateAdded: "2026-02-17",
  carbs: null,
  fat: null,
  fiber: null,
  servings: "6",
  tags: ["high protein", "low calorie", "chicken", "pasta", "mac and cheese"],
  calories: "~500 per serving",
  protein: "~38g per serving",

  ingredients: [
    { qty: 12, unit: "oz", name: "protein pasta", notes: "Barilla Protein+, elbow or penne" },
    { qty: 16, unit: "oz", name: "full-fat cottage cheese" },
    { qty: 0.5, unit: "cup", name: "buffalo sauce" },
    { qty: 2, unit: "cup", name: "shredded cooked chicken" },
    { qty: 0.25, unit: "cup", name: "milk" },
    { qty: 2, unit: "tbsp", name: "ranch seasoning" },
    { qty: 1, unit: "cup", name: "shredded cheddar" },
    { qty: 1, unit: "cup", name: "shredded mozzarella cheese" },
    { qty: 1, unit: "tbsp", name: "unsalted butter", notes: "melted, or light margarine" },
    { qty: 1/3, unit: "cup", name: "panko breadcrumbs" }
  ],

  steps: [
    "Preheat oven to 400°F.",
    "Bring a large pot of water to a boil and cook pasta according to package directions. Drain. Return to pot off heat.",
    "While pasta cooks, prepare the sauce.",
    "In a blender or food processor, combine cottage cheese, buffalo sauce, milk, ranch seasoning, cheddar, and mozzarella.",
    "Blend on high until completely smooth and creamy.",
    "In a small bowl, combine melted butter and panko breadcrumbs. Set aside.",
    "Add shredded chicken and cheese sauce to the drained pasta. Stir until evenly coated.",
    "Transfer mixture to a baking dish and sprinkle breadcrumb mixture evenly over the top.",
    "Bake for 15 minutes, until breadcrumbs are golden brown and pasta is heated through."
  ]
},

{
  id: "classic-easy-monkey-bread",
  title: "Classic Easy Monkey Bread",
  description: "Pull-apart cinnamon sugar monkey bread with buttery brown sugar sauce. Easy, nostalgic, and dangerously good.",
  image: "images/easy-monkey-bread.png",
  category: "Breakfast",
  dateAdded: "2026-02-18",
  carbs: null,
  fat: null,
  fiber: null,
  servings: "6",
  tags: ["dessert", "holiday", "sweet", "bread", "easy"],
  calories: "~670 per serving",
  protein: "~8g per serving",

  ingredients: [
    { qty: 3, unit: "can", name: "refrigerated buttermilk biscuits", notes: "regular, not flaky layers" },
    { qty: 1, unit: "cup", name: "sugar", notes: "granulated" },
    { qty: 2, unit: "tsp", name: "cinnamon" },
    { qty: 0.5, unit: "cup", name: "unsalted butter", notes: "1 stick" },
    { qty: 0.75, unit: "cup", name: "brown sugar" },
    { qty: 0.5, qtyMax: 1, unit: "cup", name: "chopped pecans or walnuts", optional: true, display: "Optional: ½–1 cup chopped pecans or walnuts" }
  ],

  steps: [
    "Preheat oven to 350°F. Grease a bundt pan very well (butter plus spray works best).",
    "Open biscuit cans and cut each biscuit into quarters. Place pieces in a large bowl.",
    "In a separate bowl, mix granulated sugar and cinnamon. Toss biscuit pieces in cinnamon sugar until fully coated. Add nuts here if using.",
    "Drop coated biscuit pieces into the prepared bundt pan. No need to layer neatly.",
    "In a saucepan or microwave-safe bowl, melt butter. Stir in brown sugar and heat just until gently bubbling.",
    "Pour butter-sugar mixture evenly over biscuits in the pan.",
    "Bake for 35–40 minutes until deep golden and bubbly on top.",
    "Let cool only 5 minutes, then invert onto a plate. Serve warm."
  ]
},

{
  id: "seared-chicken-pieces",
  title: "Seared Bite Sized Chicken Pieces",
  description: "How to cook chicken for recipes like lo mein, fried rice, or even a taco bowl.",
  image: "images/seared-chicken-pieces.png",
  category: "Kitchen Basics",
  dateAdded: "2026-02-10",
  calories: null,
  protein: null,
  carbs: null,
  fat: null,
  fiber: null,
  tags: ["high protein", "low calorie", "chicken", "how to", "Kitchen Basics"],

  ingredients: [
    { qty: 1, unit: "lb", name: "chicken breast", notes: "boneless skinless" },
    { qty: 0.5, unit: "tsp", name: "kosher salt" },
    { qty: 0.25, unit: "tsp", name: "black pepper", notes: "or to taste" },
    { qty: 0.25, unit: "tsp", name: "onion powder" },
    { qty: 0.25, unit: "tsp", name: "garlic powder" },
    { qty: 0.25, unit: "tsp", name: "smoked paprika" },
    { qty: 1, qtyMax: 2, unit: "tbsp", name: "avocado oil", notes: "or oil of your choice" }
  ],

  steps: [
    "Cut chicken into bite sized pieces.",
    "Heat oil over medium-high heat in a skillet or cast iron pan.",
    "Add chicken pieces to hot pan in a single, uncrowded layer. (I usually let my pan heat up for 5 minutes or so before adding chicken).",
    "Let the chicken pieces sear on one side, without disruption, for about 3-4 minutes or until a nice brown color is achieved.",
    "With tongs, flip the pieces over and cook for another 3 minutes.",
    "Check that chicken is cooked to 165°F using a food themometer.",
    "Remove chicken from pan and let rest on a plate."
  ]
},

{
  id: "oven-blistered-cherry-tomatoes",
  title: "Oven Blistered Cherry Tomatoes",
  description: "How to blister tomatoes for pasta sauce, Tuscan chicken, and more.",
  image: "images/oven-blistered-tomatoes.png",
  category: "Kitchen Basics",
  dateAdded: "2026-02-10",
  calories: null,
  protein: null,
  carbs: null,
  fat: null,
  fiber: null,
  tags: ["low calorie", "vegetables", "sides", "how to", "Kitchen Basics"],

  ingredients: [
    { qty: 1, qtyMax: 2, unit: "cup", name: "cherry or grape tomatoes", notes: "whole" },
    { qty: 1, qtyMax: 2, unit: "tsp", name: "olive oil", notes: "just enough to coat" },
    { qty: 0.25, unit: "tsp", name: "kosher salt" },
    { qty: null, unit: null, name: "Fresh cracked black pepper" },
    { qty: null, unit: null, name: "Optional flavor boosters (pick one or mix lightly): pinch garlic powder, tiny pinch Italian seasoning, pinch crushed red pepper flakes", optional: true },
    { qty: null, unit: null, name: "Optional finish: splash of balsamic or squeeze of lemon", optional: true }
  ],

  steps: [
    "Heat oven to 425°F (hot is key for blistering, not sad wrinkling).",
    "Toss tomatoes whole with olive oil, salt, pepper, and any optional seasoning.",
    "Spread on a sheet pan in one layer (don’t crowd — give those babies breathing room).",
    "Roast 15–20 minutes, shaking the pan once halfway."
  ]
},

{
  id: "super-easy-brownies",
  title: "Super Easy Brownies",
  description: "The easiest, but tastiest brownies you'll ever make.",
  image: "images/super-easy-brownies.png",
  category: "Dessert",
  dateAdded: "2026-02-21",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "~440 per serving",
  protein: "~4g per serving",
  servings: "9",
  tags: ["chocolate", "dessert", "brownies"],

  ingredients: [
    { qty: 2, unit: "cup", name: "sugar", notes: "granulated" },
    { qty: 4, unit: null, name: "eggs", notes: "room temperature" },
    { qty: 1, unit: "cup", name: "salted butter", notes: "melted and slightly cooled" },
    { qty: 0.5, unit: "tsp", name: "vanilla extract" },
    { qty: 2/3, unit: "cup", name: "cocoa powder" },
    { qty: 0.75, unit: "cup", name: "flour", notes: "all-purpose" },
    { qty: 0.25, unit: "tsp", name: "salt" }
  ],

  steps: [
    "Preheat oven to 350°F. Spray a 9x9 metal brownie pan with cooking spray.",
    "In a large bowl, beat sugar and room-temperature eggs for 4 minutes until thick and pale.",
    "Add melted butter and vanilla extract. Beat on low speed for about 1 minute until combined.",
    "Fold in cocoa powder, flour, and salt just until incorporated. Do not overmix.",
    "Pour batter into prepared pan and smooth the top.",
    "Bake for 35 minutes, or until a toothpick inserted comes out mostly clean.",
    "Cool slightly before slicing. Serve warm or room temperature."
  ]
},

{
  id: "slow-cooker-butter-chicken",
  title: "Lazy Slow Cooker Butter Chicken",
  description: "Weeknight-friendly butter chicken from the slow cooker.",
  image: "images/slow-cooker-butter-chicken.png",
  category: ["Slow Cooker", "Chicken"],
  dateAdded: "2026-03-04",
  calories: null,
  protein: null,
  carbs: null,
  fat: null,
  fiber: null,
  servings: "4-6",
  tags: ["chicken", "slow cooker", "easy"],

  ingredients: [
    { qty: 1.5, qtyMax: 2, unit: "lb", name: "boneless skinless chicken thighs" },
    { qty: 1, unit: null, name: "small yellow onion", notes: "finely diced" },
    { qty: 3, unit: "clove", name: "garlic", notes: "minced" },
    { qty: 1, unit: "tbsp", name: "fresh ginger", notes: "grated, or 1/2 tsp ground ginger" },
    { qty: 15, unit: "oz", name: "tomato sauce", notes: "1 can", display: "1 (15 oz) can tomato sauce" },
    { qty: 6, unit: "oz", name: "tomato paste", notes: "1 can", display: "1 (6 oz) can tomato paste" },
    { qty: 1, unit: "cup", name: "chicken broth" },
    { qty: 1, unit: "tbsp", name: "garam masala" },
    { qty: 1, unit: "tsp", name: "curry powder" },
    { qty: 1, unit: "tsp", name: "smoked paprika" },
    { qty: 0.5, qtyMax: 1, unit: "tsp", name: "chili powder", notes: "adjust heat" },
    { qty: 1, unit: "tsp", name: "kosher salt" },
    { qty: 0.5, unit: "tsp", name: "black pepper" },
    { qty: 1, unit: "tbsp", name: "unsalted butter" },
    { qty: 0.5, qtyMax: 0.75, unit: "cup", name: "heavy cream", notes: "OR 1/2 cup half-and-half + 2 tbsp Greek yogurt", display: "1/2–3/4 cup heavy cream, OR 1/2 cup half-and-half + 2 tbsp Greek yogurt" },
    { qty: 0.5, unit: "tsp", name: "sugar", notes: "only if sauce tastes too acidic", optional: true, display: "Optional: 1/2 tsp sugar (only if sauce tastes too acidic)" },
    { qty: null, unit: null, name: "Optional garnish: fresh cilantro", optional: true }
  ],

  steps: [
    "Add everything except the cream/yogurt to your slow cooker, then stir gently to combine.",
    "Cook on LOW for 3–4 hours or HIGH for 2–3 hours, until chicken is tender and cooked through.",
    "Remove chicken and shred or cut into bite-sized chunks (optional), then return it to the sauce.",
    "Stir in heavy cream, or use half-and-half plus Greek yogurt for a lighter option.",
    "Cook another 10–15 minutes on LOW.",
    "Taste and adjust salt; add sugar only if needed to balance acidity.",
    "Serve over basmati rice and garnish with fresh cilantro if desired."
  ],

  notes: [
    "If your slow cooker runs hot, start checking around 2 hours on LOW.",
    "Adjust chili powder to control heat level.",
    "For best texture, avoid boiling after adding dairy."
  ]
},

{
  id: "drunken-turkey-pasta",
  title: "Drunken Turkey Pasta",
  description: "A quick and easy dinner favorite featuring vodka sauce and ground Italian-style turkey.",
  image: "images/drunken-turkey-pasta.png",
  category: "Pasta",
  dateAdded: "2026-03-04",
  calories: null,
  protein: null,
  carbs: null,
  fat: null,
  fiber: null,
  servings: "4-6",
  tags: ["turkey", "easy", "lean", "pasta"],

  ingredients: [
    { qty: 411, unit: "g", name: "protein pasta", notes: "1 box (Barilla Protein+)" },
    { qty: 1, unit: null, name: "jar garlic vodka sauce" },
    { qty: 1, unit: "lb", name: "ground Italian-style turkey" },
    { qty: 0.25, unit: "cup", name: "half-and-half" },
    { qty: null, unit: null, name: "Freshly grated Parmesan cheese, to taste" },
    { qty: null, unit: null, name: "Optional garnish: chopped parsley", optional: true }
  ],

  steps: [
    "Boil pasta according to package directions; drain and return to the pot off heat.",
    "Brown ground turkey in a skillet over medium heat until fully cooked and no longer pink.",
    "Reduce heat to medium-low, add vodka sauce, and stir occasionally until warmed through.",
    "Remove skillet from heat.",
    "Stir in half-and-half and grated Parmesan cheese.",
    "Add warmed sauce to the pasta and stir well to combine.",
    "Garnish with extra grated Parmesan and parsley, then serve."
  ]
},

{
  id: "rice-cooker-basmati-rice",
  title: "Perfect Rice Cooker Basmati Rice",
  description: "The perfect side dish for your favorite Indian recipes.",
  image: "images/no-photo.jpg",
  category: "Kitchen Basics",
  dateAdded: "2026-03-08",
  calories: null,
  protein: null,
  carbs: null,
  fat: null,
  fiber: null,
  tags: ["rice", "rice cooker", "side dishes"],

  ingredients: [
    { qty: 2, unit: "cup", name: "dry basmati rice" },
    { qty: 3, unit: "cup", name: "water" },
    { qty: 1, unit: "tsp", name: "kosher salt" },
    { qty: 1, unit: "tsp", name: "unsalted butter", notes: "or olive oil" }
  ],

  steps: [
    "Place rice in a bowl and cover with cold water.",
    "Swirl rice around with your hands a couple of times, then drain. Repeat 3-4 more times or until the water is clear.",
    "Place rinsed rice in the rice cooker with 3 cups of water, kosher salt, and butter.",
    "Press the \"White Rice\" button and let it cook until the rice cooker is finished.",
    "Allow rice to sit in the rice cooker on \"Keep Warm\" for about 10 minutes.",
    "Fluff gently with a fork and serve."
  ]
},

{
  id: "family-style-american-goulash-with-protein-pasta",
  title: "Family Style American Goulash with Protein Pasta",
  description: "Classic American goulash with rich tomato flavor, protein pasta, and ground beef.",
  image: "images/american-goulash.jpg",
  category: ["Soup", "Beef"],
  dateAdded: "2026-03-10",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "265",
  protein: "24 g",
  servings: "6",
  tags: ["soup", "protein", "ground beef"],

  ingredients: [
    { qty: 1, unit: "lb", name: "ground beef (93/7)", notes: "or lean ground turkey" },
    { qty: 1, unit: "tsp", name: "kosher salt" },
    { qty: 0.75, unit: "tsp", name: "black pepper" },
    { qty: 1, unit: "tsp", name: "smoked paprika" },
    { qty: 1.5, unit: "tsp", name: "garlic powder" },
    { qty: 1, unit: "tsp", name: "onion powder" },
    { qty: 1.5, unit: null, name: "medium yellow onions", notes: "diced" },
    { qty: 3, unit: "clove", name: "garlic", notes: "minced" },
    { qty: 1, unit: null, name: "green bell pepper", notes: "finely diced" },
    { qty: 29, unit: "oz", name: "tomato sauce", notes: "1 can", display: "1 (29 oz) can tomato sauce" },
    { qty: 28, unit: "oz", name: "diced tomatoes", notes: "1 can, undrained", display: "1 (28 oz) can diced tomatoes, undrained" },
    { qty: 3, unit: "tbsp", name: "tomato paste" },
    { qty: 4, unit: "cup", name: "beef broth" },
    { qty: 1, unit: "tbsp", name: "Worcestershire sauce" },
    { qty: 1, unit: "tsp", name: "Italian seasoning" },
    { qty: 0.5, unit: "tsp", name: "red pepper flakes", notes: "or to taste" },
    { qty: null, unit: null, name: "Optional: a few dashes hot sauce", optional: true },
    { qty: 9, unit: "oz", name: "protein pasta", notes: "Barilla Protein+ elbows or rotini" },
    { qty: 1, unit: "tsp", name: "red wine vinegar" },
    { qty: null, unit: null, name: "Optional garnish: chopped parsley or reduced-fat cheese", optional: true }
  ],

  steps: [
    "Heat a large pot or Dutch oven over medium heat. Add the ground beef, salt, pepper, smoked paprika, garlic powder, and onion powder. Cook until browned, breaking the meat into small crumbles as it cooks. Drain excess fat if needed.",
    "Add diced onion, garlic, and bell pepper. Cook for 3-5 minutes until softened and fragrant.",
    "Stir in the tomato paste and cook for about 1 minute to deepen the flavor. Add tomato sauce, diced tomatoes with their juices, Worcestershire sauce, Italian seasoning, and crushed red pepper flakes.",
    "Pour in the beef broth and stir well. Bring to a gentle simmer and cook uncovered for about 10 minutes so the flavors meld together. Taste and add more salt if needed.",
    "Stir in the dry protein pasta. Simmer uncovered for 10-12 minutes, stirring occasionally, until the pasta is tender.",
    "If the goulash becomes too thick, add a splash of broth or water. The final texture should be slightly soupy.",
    "Stir in the vinegar to brighten the tomato flavor. Taste and adjust salt, pepper, or heat as needed. Serve hot with optional herbs and/or a sprinkle of cheese."
  ]
},

{
  id: "honey-mustard-chicken-thighs",
  title: "Honey Mustard Chicken Thighs",
  description: "Sweet-tangy roasted chicken with caramelized edges",
  image: "images/honey-mustard-chicken-thighs.jpg",
  category: "Chicken",
  dateAdded: "2026-03-12",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "520 per 2 chicken thighs",
  protein: "52 g",
  tags: ["chicken", "protein", "easy", "weeknight"],

  ingredients: [
    { qty: 2, unit: "lb", name: "boneless skinless chicken thighs", notes: "about 8–10 thighs" },
    { qty: 0.25, unit: "cup", name: "Dijon mustard" },
    { qty: 3, unit: "tbsp", name: "honey" },
    { qty: 1.5, unit: "tbsp", name: "olive oil" },
    { qty: 1, unit: "tbsp", name: "apple cider vinegar", notes: "or lemon juice" },
    { qty: 1, unit: "tsp", name: "kosher salt" },
    { qty: 0.5, unit: "tsp", name: "black pepper" },
    { qty: 1, unit: "tsp", name: "smoked paprika" },
    { qty: 0.5, unit: "tsp", name: "garlic powder", optional: true, display: "Optional: ½ tsp garlic powder" },
    { qty: null, unit: null, name: "Optional: pinch dried thyme or rosemary", optional: true }
  ],

  steps: [
    "Preheat oven to 425°F. Line a sheet pan with foil or parchment for easy cleanup.",
    "In a bowl, whisk together Dijon mustard, honey, olive oil, vinegar, salt, pepper, paprika, and optional seasonings.",
    "Place chicken thighs on the sheet pan, pour sauce over them, and toss to coat. Spread out so the pieces are not piled on top of each other.",
    "Roast for 35–40 minutes, flipping the thighs halfway through.",
    "Optional: broil 2–3 minutes at the end to caramelize and get sticky golden edges."
  ]
},

{
  id: "bbq-chicken-protein-pizza",
  title: "BBQ Chicken Protein Pizza",
  description: "Sweet, smoky, cheesy, and protein-packed — pizza night without the regret.",
  image: "images/bbq-chicken-protein-pizza.png",
  category: "Chicken",
  dateAdded: "2026-03-26",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "500 calories per pizza",
  protein: "68 g per pizza",
  tags: ["chicken", "protein", "easy", "weeknight", "pizza", "fast"],

  ingredients: [
    { qty: 1, unit: null, name: "Golden Home Ultra Thin Protein Pizza Crust" },
    { qty: null, unit: null, name: "Sugar-free or low-sugar BBQ sauce", notes: "Ray's No Sugar Added works great" },
    { qty: null, unit: null, name: "Reduced-fat mozzarella cheese", notes: "shredded" },
    { qty: null, unit: null, name: "Cooked chicken breast", notes: "diced or shredded" },
    { qty: null, unit: null, name: "Pickled jalapeños", notes: "sliced, to taste" },
    { qty: null, unit: null, name: "Red onion", notes: "thinly sliced" },
    { qty: null, unit: null, name: "Pineapple chunks", notes: "optional", optional: true }
  ],

  steps: [
    "Preheat oven to 400°F.",
    "Spread a thin, even layer of sugar-free BBQ sauce over the crust.",
    "Sprinkle shredded reduced-fat mozzarella evenly over the sauce.",
    "Add diced chicken, jalapeños, red onion, and pineapple (if using).",
    "Place pizza directly on the oven rack or on a perforated pizza pan.",
    "Bake for 8–10 minutes, until the cheese is fully melted and edges are golden brown and crispy.",
    "Cool slightly, slice, and enjoy."
  ]
},

{
  id: "quick-pasta-arrabbiata",
  title: "Quick Pasta Arrabbiata",
  description: "Quick and easy pasta with a spicy tomato sauce.",
  image: "images/quick-pasta-arrabbiata.png",
  category: "Pasta",
  dateAdded: "2026-04-02",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "380 calories",
  protein: "18 g",
  tags: ["pasta", "meatless", "easy", "weeknight", "spicy", "fast", "low calorie"],

  ingredients: [
    { qty: 12, unit: "oz", name: "penne", notes: "or pasta of choice — protein pasta works great" },
    { qty: 3, unit: "tbsp", name: "olive oil" },
    { qty: 6, unit: "clove", name: "garlic", notes: "thinly sliced" },
    { qty: 2, qtyMax: 3, unit: "tsp", name: "red pepper flakes", notes: "adjust to your heat tolerance" },
    { qty: 1, unit: "tbsp", name: "Calabrian chili paste", notes: "optional", optional: true },
    { qty: 1.5, unit: "tbsp", name: "tomato paste" },
    { qty: 1, unit: null, name: "anchovy fillet", notes: "or 1 tsp Worcestershire sauce" },
    { qty: 28, unit: "oz", name: "crushed tomatoes", notes: "1 can", display: "1 (28 oz) can crushed tomatoes" },
    { qty: 1, unit: "tsp", name: "kosher salt", notes: "start here" },
    { qty: 0.5, unit: "tsp", name: "black pepper" },
    { qty: 30, unit: "g", name: "parmesan", notes: "rind, removed before serving" },
    { qty: 0.25, unit: "tsp", name: "sugar", notes: "optional, only if tomatoes taste harsh", optional: true },
    { qty: 0.5, unit: "cup", name: "reserved pasta water" },
    { qty: 2, unit: "tbsp", name: "parmesan", notes: "freshly grated" },
    { qty: 1, unit: "tbsp", name: "butter or light butter", notes: "optional for richness", optional: true },
    { qty: null, unit: null, name: "Squeeze of lemon or splash of red wine vinegar" },
    { qty: null, unit: null, name: "Fresh parsley or basil" }
  ],

  steps: [
    "Boil pasta in salted water until just shy of al dente; reserve ½ cup pasta water before draining.",
    "Heat olive oil over medium heat in a large skillet. Add garlic and cook until fragrant, about 30 seconds.",
    "Add crushed red pepper flakes and Calabrian chili paste. Cook 30 seconds so the oil becomes spicy.",
    "Stir in tomato paste and anchovy or Worcestershire. Cook 1 minute to caramelize the tomato paste.",
    "Add crushed tomatoes, salt, pepper, and parmesan rind. Simmer 10–15 minutes, stirring occasionally.",
    "Remove the parmesan rind. Add pasta and reserved pasta water to the sauce. Toss until glossy and slightly thickened.",
    "Optional: stir in extra parmesan, butter, or a squeeze of lemon or splash of red wine vinegar.",
    "Taste and adjust salt or other seasonings. Finish with fresh herbs."
  ]
},

{
  id: "lightened-up-sheet-pan-garlic-butter-shrimp",
  title: "Lightened Up Sheet Pan Garlic Butter Shrimp",
  description: "Fast, garlicky sheet pan shrimp with bright lemon and buttery flavor in a lighter prep.",
  image: "images/sheet-pan-garlic-butter-shrimp-light.png",
  category: "Seafood",
  dateAdded: "2026-04-02",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "200 calories per serving",
  protein: "25 g",
  tags: ["shrimp", "seafood", "easy", "weeknight", "fast", "low calorie"],

  ingredients: [
    { qty: 2, unit: "lb", name: "large shrimp", notes: "peeled and deveined" },
    { qty: 2, unit: "tbsp", name: "unsalted butter", notes: "melted" },
    { qty: 1, unit: "tbsp", name: "light margarine", notes: "melted" },
    { qty: 2, qtyMax: 3, unit: "tbsp", name: "dry white wine", notes: "pinot grigio, sauvignon blanc, etc." },
    { qty: 4, qtyMax: 5, unit: "clove", name: "garlic", notes: "minced" },
    { qty: 0.5, unit: "tsp", name: "kosher salt" },
    { qty: 0.5, unit: "tsp", name: "black pepper" },
    { qty: 0.25, qtyMax: 0.5, unit: "tsp", name: "red pepper flakes", notes: "to taste" },
    { qty: null, unit: null, name: "Zest of 1 lemon" },
    { qty: null, unit: null, name: "Juice of ½–1 lemon" },
    { qty: 1, unit: "tbsp", name: "chopped parsley", notes: "optional", optional: true }
  ],

  steps: [
    "Preheat oven to 400°F.",
    "In a bowl, mix melted butter, melted light margarine, white wine, garlic, salt, pepper, red pepper flakes, lemon zest, and lemon juice.",
    "Spread shrimp in a single layer on a sheet pan.",
    "Pour sauce over the top and toss lightly to coat.",
    "Bake for 8–10 minutes, until shrimp are pink and opaque."
  ]
},

  {
  id: "creamy-sherry-tomato-soup",
  title: "Creamy Tomato Soup with Sherry",
  description: "A lightened-up version of a classic creamy tomato soup—lower in fat than traditional recipes, but still rich and comforting.",
  image: "images/no-photo.jpg",
  category: "Soup",
  dateAdded: "2026-04-05",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "250 calories per serving",
  protein: "4g",
  servings: "6",
  tags: ["soup", "tomato", "easy", "weeknight", "fast", "low calorie", "comfort food"],

  ingredients: [
    { qty: 6, unit: "tbsp", name: "light butter" },
    { qty: 46, unit: "oz", name: "tomato juice", notes: "1 bottle", display: "1 46 oz bottle of tomato juice" },
    { qty: 2, qtyMax: 3, unit: "tbsp", name: "chicken base", notes: "like Better Than Bouillon" },
    { qty: 2, unit: "can", name: "diced tomatoes" },
    { qty: 4, unit: "tbsp", name: "sugar" },
    { qty: null, unit: null, name: "Salt and pepper to taste" },
    { qty: 1, unit: "cup", name: "cooking sherry" },
    { qty: 1.5, unit: "cup", name: "half and half" },
    { qty: null, unit: null, name: "Chopped fresh parsley and basil", notes: "for topping" }
  ],

  steps: [
    "Melt butter spread in a large pot over medium heat.",
    "Add tomatoes, tomato juice, chicken base, sugar, salt, and pepper.",
    "Bring almost to a boil.",
    "Remove from heat.",
    "Stir in sherry and half and half.",
    "Adjust seasonings if needed.",
    "Blend with a hand blender until smooth.",
    "Top with fresh herbs and serve."
  ]
},

{
  id: "birria-chuck-roast",
  title: "Birria-Style Chuck Roast",
  description: "Deeply spiced, fall-apart chuck roast slow cooked in a rich chile broth — bold, smoky, and worth every minute. Serve over rice with consommé or stuff into tacos.",
  image: "images/birria-chuck-roast.png",
  category: ["Beef", "Slow Cooker"],
  dateAdded: "2026-05-22",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "6",
  tags: ["beef", "slow cooker", "birria", "mexican", "chuck roast", "comfort food", "spicy"],

  ingredients: [
    { qty: 3.5, unit: "lb", name: "chuck roast" },
    { qty: 2, unit: "tsp", name: "salt", notes: "plus 1 tsp more to adjust consommé at the end" },
    { qty: 1, unit: "tsp", name: "black pepper" },
    { qty: 2, unit: "tbsp", name: "vegetable oil" },

    { qty: 4, unit: null, name: "dried guajillo chiles", notes: "stems and seeds removed" },
    { qty: 3, unit: null, name: "dried ancho chiles", notes: "stems and seeds removed" },
    { qty: 2, unit: null, name: "chipotle peppers in adobo sauce" },
    { qty: 6, unit: "clove", name: "garlic" },
    { qty: 1, unit: null, name: "white onion", notes: "roughly chopped" },
    { qty: 2, unit: null, name: "roma tomatoes", notes: "halved" },
    { qty: 2, unit: "tbsp", name: "apple cider vinegar" },
    { qty: 2, unit: "tsp", name: "ground cumin" },
    { qty: 1, unit: "tsp", name: "dried oregano", notes: "Mexican oregano if you can find it" },
    { qty: 0.25, unit: "tsp", name: "cinnamon" },
    { qty: 2, unit: "cup", name: "beef broth", notes: "divided" },

    { qty: 2, unit: null, name: "bay leaves" },

    { qty: null, unit: null, name: "Cooked Mexican rice", notes: "for serving" },
    { qty: null, unit: null, name: "Warm tortillas", notes: "for serving" },
    { qty: null, unit: null, name: "Diced white onion", notes: "for serving" },
    { qty: null, unit: null, name: "Fresh cilantro", notes: "for serving" },
    { qty: null, unit: null, name: "Lime wedges", notes: "for serving" },
    { qty: null, unit: null, name: "Crumbled cotija cheese", notes: "for serving" },
    { qty: null, unit: null, name: "Pico de gallo", notes: "for serving" }
  ],

  steps: [
    "Toast the chiles: Tear open the guajillo and ancho chiles, removing stems and seeds. Toast in a dry skillet over medium heat for about 30 seconds per side — just until fragrant, not burnt. Place in a bowl, cover with hot water, and soak 15–20 minutes until softened.",
    "Season and sear the roast: Cut the chuck roast into 3–4 large chunks. Season all over with 2 tsp salt and the black pepper. Heat vegetable oil in a large skillet over high heat and sear 2–3 minutes per side until deeply browned. Don't skip this step — it builds the flavor base. Transfer to the slow cooker.",
    "Blend the chile sauce: Drain the soaked chiles and add to a blender with the chipotle peppers, garlic, onion, tomatoes, apple cider vinegar, cumin, oregano, cinnamon, and 1 cup of beef broth. Blend until very smooth. Taste — it should be bold, smoky, and slightly spicy.",
    "Load the slow cooker: Pour the chile sauce over the seared beef. Add the remaining 1 cup of beef broth and tuck in the bay leaves. The liquid should come about halfway up the meat — that's perfect.",
    "Cook on LOW for 6–7 hours. Start checking around the 6-hour mark — the meat is done when it shreds easily with two forks. Switch to keep warm if it finishes early; it only gets better.",
    "Remove the bay leaves. Pull the beef chunks out and shred with two forks, then return the meat to the pot and stir back into the broth. Taste the consommé and add up to 1 tsp salt if needed. Serve the consommé alongside in small bowls for sipping or ladling over the bowl."
  ],

  notes: [
    "On the dried chiles: Guajillo = mild, fruity, slightly tangy. Ancho = dark, rich, chocolate-y. Chipotle in adobo = smoky heat. All three together is what makes birria taste like birria — don't substitute with chili powder. Look for dried chiles in the Hispanic foods aisle at Walmart or order online.",
    "Hot-running slow cooker: If your slow cooker runs hot, start checking at 5.5–6 hours rather than waiting the full 7.",
    "Serving as bowls: Rice on the bottom, shredded beef on top, ladle consommé over everything. Top with diced onion, cilantro, cotija, and a squeeze of lime.",
    "For birria tacos: Dip tortillas briefly in the consommé, fill with shredded beef, and crisp in a hot skillet. Mind-blowing.",
    "Leftovers: Even better the next day. The consommé thickens overnight in the fridge into an incredible sauce."
  ]
},

{
  id: "esquites-mexican-street-corn",
  title: "Esquites (Mexican Street Corn in a Cup)",
  description: "Mexican street corn in a cup — charred corn kernels coated in a creamy, tangy, spiced sauce and topped with cotija and fresh lime. Bold enough to steal the show.",
  image: "images/esquites.png",
  category: "Snacks & Sides",
  dateAdded: "2026-05-29",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "6",
  tags: ["mexican", "corn", "side dish", "vegetarian", "snack", "street food"],

  ingredients: [
    { qty: 6, unit: null, name: "ears of corn", notes: "kernels cut off, or 4.5 cups frozen corn thawed and patted very dry" },
    { qty: 3, unit: "tbsp", name: "unsalted butter" },
    { qty: 3, unit: "clove", name: "garlic", notes: "minced, or ¾ tsp garlic powder in a pinch" },
    { qty: 0.333, unit: "cup", name: "mayonnaise" },
    { qty: 0.333, unit: "cup", name: "sour cream" },
    { qty: 1, unit: "tsp", name: "chili powder" },
    { qty: 0.5, unit: "tsp", name: "smoked paprika" },
    { qty: 0.25, unit: "tsp", name: "cayenne pepper", notes: "adjust to taste" },
    { qty: 0.5, unit: "tsp", name: "salt" },
    { qty: 3, unit: null, name: "limes", notes: "juiced" },
    { qty: 0.5, unit: "cup", name: "cotija cheese", notes: "crumbled, queso fresco works great if you can't find cotija" },
    { qty: 0.25, unit: "cup", name: "fresh cilantro", notes: "chopped" }
  ],

  steps: [
    "Heat a large cast iron skillet or heavy pan over HIGH heat until very hot. Add the butter and let it melt. Add the corn in a single layer — don't stir for 2 minutes to let it char. Then stir and let it char another 2 minutes. You want some kernels to get dark and almost smoky. Work in two batches if needed so the corn chars instead of steams.",
    "Reduce heat to medium. Push the corn to the sides and add the garlic to the center. Sauté 30 seconds until fragrant, then stir into the corn. (If using garlic powder, skip this step and add it with the sauce instead.)",
    "Remove pan from heat. Stir in the mayonnaise, sour cream, chili powder, smoked paprika, cayenne, salt, and lime juice. Stir until everything is coated and creamy.",
    "Transfer to a serving bowl. Top with cotija (or queso fresco) and fresh cilantro. Serve warm with extra lime wedges and chili powder on the side so everyone can adjust their own heat level."
  ],

  notes: [
    "Frozen corn works great — just make sure to thaw it first and pat it as dry as possible with paper towels before it hits the pan. Wet corn steams instead of chars and you'll miss out on those smoky caramelized bits that make this dish.",
    "On the cheese: Cotija is the traditional choice — look for it in the Hispanic foods aisle. Queso fresco is a slightly milder, creamier substitute that works beautifully. In a real pinch, parmesan will do.",
    "Make it spicier: Add a diced jalapeño when you sauté the garlic, or finish with a drizzle of hot sauce.",
    "Pairs perfectly with: Birria chuck roast, tacos, grilled chicken, or honestly anything off the grill."
  ]
},

{
  id: "korean-beef-bowls",
  title: "Korean Beef Bowls",
  description: "Bold, savory-sweet ground beef over fluffy rice with a soy-sesame sauce, quick pickled carrots, and vinegar cucumbers.",
  image: "images/korean-beef-bowls.png",
  category: "Beef",
  dateAdded: "2026-05-29",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "6",
  tags: ["beef", "korean", "rice bowl", "weeknight", "ground beef", "pickled"],

  ingredients: [
    {
      title: "The Beef",
      items: [
        { qty: 2, unit: "lb", name: "ground beef (93/7)" },
        { qty: 1, unit: "tbsp", name: "vegetable oil" }
      ]
    },
    {
      title: "The Sauce",
      items: [
        { qty: 6, unit: "tbsp", name: "soy sauce", notes: "plus 2 tsp" },
        { qty: 4, unit: "tbsp", name: "brown sugar" },
        { qty: 1.5, unit: "tbsp", name: "toasted sesame oil" },
        { qty: 6, unit: "clove", name: "garlic", notes: "minced" },
        { qty: 1.5, unit: "tsp", name: "fresh ginger", notes: "grated, or ¾ tsp ground ginger" },
        { qty: 0.75, unit: "tsp", name: "red pepper flakes" },
        { qty: 2, unit: "tsp", name: "gochujang" }
      ]
    },
    {
      title: "The Rice",
      items: [
        { qty: 2.5, unit: "cup", name: "jasmine rice" },
        { qty: 1.5, unit: "cup", name: "chicken broth" },
        { qty: 1.25, unit: "cup", name: "water" },
        { qty: 0.5, unit: "tsp", name: "toasted sesame oil" },
        { qty: 0.75, unit: "tsp", name: "salt" },
        { qty: 1, unit: "tsp", name: "rice vinegar", notes: "stirred in after cooking" }
      ]
    },
    {
      title: "Pickled Carrots",
      items: [
        { qty: 4, unit: null, name: "medium carrots", notes: "peeled and julienned" },
        { qty: 1, unit: "cup", name: "rice vinegar" },
        { qty: 2, unit: "tsp", name: "sugar" },
        { qty: 1, unit: "tsp", name: "salt" },
        { qty: 0.5, unit: "cup", name: "water" },
        { qty: null, unit: null, name: "Pinch of red pepper flakes", optional: true }
      ]
    },
    {
      title: "Vinegar Cucumbers",
      items: [
        { qty: 1, unit: null, name: "mini cucumber", notes: "thinly sliced" },
        { qty: 1, unit: "tbsp", name: "rice vinegar" },
        { qty: 0.25, unit: "tsp", name: "sugar" },
        { qty: null, unit: null, name: "Pinch of salt" },
        { qty: null, unit: null, name: "Tiny drizzle of toasted sesame oil" }
      ]
    },
    {
      title: "Toppings",
      items: [
        { qty: 4, unit: null, name: "green onions", notes: "sliced" },
        { qty: 1, unit: "tbsp", name: "sesame seeds" }
      ]
    }
  ],

  steps: [
    "Warm a quart-sized Mason jar by rinsing with hot tap water. Combine rice vinegar, water, sugar, salt, and red pepper flakes in a small saucepan or microwave-safe cup. Heat until steaming and sugar is dissolved — about 90 seconds in the microwave. Pack julienned carrots tightly into the jar, pour hot brine over them, and let sit at room temperature for 20–30 minutes.",
    "Thinly slice the cucumber and toss with rice vinegar, sugar, salt, and a tiny drizzle of sesame oil. Let sit at least 10 minutes before serving.",
    "Rinse jasmine rice until water runs mostly clear. Add to rice cooker with chicken broth, water, sesame oil, and salt. Cook on the white rice setting. When done, fluff with a fork and stir in the rice vinegar.",
    "Whisk together soy sauce, brown sugar, sesame oil, ginger, red pepper flakes, and gochujang paste in a small bowl. Taste — it should be salty, slightly sweet, and have a little heat.",
    "Heat vegetable oil in a large skillet over medium-high heat. Add ground beef and break it apart. Cook until browned and no longer pink, about 5–6 minutes. Drain excess grease if needed.",
    "Push the beef to the sides of the pan and add minced garlic to the center. Sauté 30 seconds until fragrant, then stir into the beef. Pour the sauce over everything and stir to coat. Cook another 1–2 minutes until the sauce absorbs slightly.",
    "Spoon rice into bowls, top with the beef mixture. Add pickled carrots and cucumbers on the side. Garnish with green onions and sesame seeds. Serve immediately."
  ],

  notes: [
    "The gochujang upgrade: Adding 2 tsp of gochujang paste to the sauce takes this from great to exceptional. It adds a deep fermented heat that red pepper flakes alone can't replicate. Don't skip it if you can find it — it's usually in the Asian foods aisle.",
    "On the pickled carrots: The hot brine on thinly julienned carrots works faster than you'd think — 20–30 minutes at room temp is all you need. They'll keep in the fridge for up to a week and are great on tacos, sandwiches, or as a snack.",
    "Rice tip: Cooking the jasmine rice in a mix of chicken broth and water with a splash of sesame oil makes it taste intentional rather than just a vehicle for the beef. The rice vinegar stirred in at the end brightens everything up.",
    "Toppings that take it further: A fried egg on top is chef's kiss. Sriracha mayo (sriracha + mayo) drizzled over the bowl is also fantastic.",
    "Leftovers: The beef reheats really well. Store separately from rice for best texture."
  ]
},

  {
  id: "gochujang-butter-shrimp",
  title: "Gochujang Butter Shrimp",
  description: "Spicy, glossy, and deeply savory — this weeknight shrimp comes together in under 30 minutes but tastes like you actually tried. Serve over steamed rice and try not to lick the pan.",
  image: "images/gochujang-butter-shrimp.png",
  category: "Seafood",
  dateAdded: "2026-05-29",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "6",
  tags: ["shrimp", "Korean", "spicy", "weeknight", "seafood"],

  ingredients: [
    { qty: 2, unit: "lb", name: "large shrimp", notes: "peeled and deveined, 21-25 count" },
    { qty: 0.75, unit: "tsp", name: "kosher salt" },
    { qty: 0.25, unit: "tsp", name: "black pepper" },
    { qty: 2, unit: "tbsp", name: "neutral oil", notes: "avocado or vegetable" },

    { qty: 3, unit: "tbsp", name: "gochujang", notes: "Korean chili paste" },
    { qty: 2, unit: "tbsp", name: "soy sauce" },
    { qty: 1, unit: "tbsp", name: "honey" },
    { qty: 1, unit: "tbsp", name: "rice vinegar" },
    { qty: 1, unit: "tsp", name: "sesame oil" },

    { qty: 4, unit: "tbsp", name: "unsalted butter" },
    { qty: 6, unit: "clove", name: "garlic", notes: "minced" },
    { qty: 1, unit: "tbsp", name: "fresh ginger", notes: "grated" },

    { qty: 6, unit: "cup", name: "cooked jasmine rice" },
    { qty: 4, unit: null, name: "green onions", notes: "thinly sliced" },
    { qty: 1, unit: "tbsp", name: "sesame seeds" }
  ],

  steps: [
    "Pat shrimp very dry with paper towels — wet shrimp steam instead of caramelize. Season with salt and pepper.",
    "In a small bowl, whisk together gochujang, soy sauce, honey, rice vinegar, and sesame oil. Set aside before the shrimp hit the pan.",
    "Heat oil in a large skillet or wok over high heat until shimmering. Add shrimp in a single layer (work in batches if needed) and cook 60-90 seconds per side until just pink and slightly charred at the edges. Remove shrimp and set aside.",
    "Reduce heat to medium. Add butter to the same pan. Once melted, add garlic and ginger and cook for 60 seconds until fragrant — don't let the garlic burn.",
    "Pour the sauce mixture into the pan and let it bubble and reduce for about 90 seconds, stirring constantly, until it thickens and looks glossy. Add the shrimp back in and toss to coat. Pull off heat immediately — shrimp go rubbery fast.",
    "Spoon over jasmine rice and top with green onions and sesame seeds. Serve immediately."
  ],

  notes: [
    "Heat level: 3 tbsp gochujang is medium-spicy. Go 2 tbsp for sensitive eaters, 4 tbsp if you want to feel it. Brands vary — Bibigo is milder, Mother-in-Law's runs hotter.",
    "Don't overcook the shrimp. Pull them out of the sear when they're just turning pink — they'll finish in the sauce. Overcooked shrimp are the only way this dish goes wrong.",
    "Additions that work great: Sliced snap peas or bok choy tossed in with the sauce, or a jammy soft-boiled egg on the side.",
    "Flavorful rice tip: Butter-toast the dry rice for 2-3 minutes before adding liquid, cook in low-sodium chicken broth instead of water, then finish with a splash of soy sauce and a drizzle of sesame oil when you fluff it."
  ]
},

{
  id: "honey-garlic-chicken-mac",
  title: "Honey Garlic Chicken with Garlic Mac n Cheese",
  description: "Sticky, golden honey garlic chicken served over creamy lightened-up garlic mac n cheese.",
  image: "images/honey-garlic-chicken-mac.png",
  category: "Chicken",
  dateAdded: "2026-06-08",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "5-6",
  tags: ["chicken", "pasta", "mac and cheese", "comfort food", "family dinner"],

  ingredients: [
    {
      title: "For the Chicken",
      items: [
        { qty: 1.8, unit: "lb", name: "chicken breast", notes: "cut into cubes" },
        { qty: 1.5, unit: "tsp", name: "salt" },
        { qty: 1, unit: "tsp", name: "black pepper" },
        { qty: 1, unit: "tsp", name: "chilli flakes", optional: true },
        { qty: 1.5, unit: "tsp", name: "garlic powder" },
        { qty: 1.5, unit: "tsp", name: "onion powder" },
        { qty: 1.5, unit: "tsp", name: "paprika", notes: "or smoked paprika" },
        { qty: 2, unit: "tsp", name: "olive oil" },
        { qty: 2, unit: "tbsp", name: "light butter", notes: "for cooking" },
        { qty: 1, unit: "tbsp", name: "light butter", notes: "finishing, split between batches" },
        { qty: 2, unit: "tsp", name: "jarred minced garlic" },
        { qty: 2, unit: "tbsp", name: "honey", notes: "1 tbsp per batch" },
        { qty: 1, unit: "tbsp", name: "fresh chopped parsley" }
      ]
    },
    {
      title: "For the Mac and Cheese",
      items: [
        { qty: 3, unit: "cup", name: "macaroni", notes: "uncooked, or pasta of choice" },
        { qty: 1.5, unit: "tbsp", name: "jarred minced garlic" },
        { qty: 2, unit: "cup", name: "skim milk" },
        { qty: 1, unit: "cup", name: "light cream cheese", notes: "Philadelphia, one full 8oz block" },
        { qty: 5, unit: "oz", name: "low fat cheddar cheese", notes: "shredded" },
        { qty: 1.5, unit: "tsp", name: "salt", notes: "or to taste" },
        { qty: 0.75, unit: "tsp", name: "black pepper" },
        { qty: 1.5, unit: "tsp", name: "smoked paprika" },
        { qty: 0.75, unit: "tsp", name: "nutmeg" }
      ]
    }
  ],

  steps: [
    "Season the chicken: toss chicken cubes with salt, pepper, chilli flakes, garlic powder, onion powder, paprika, and olive oil until evenly coated.",
    "Cook batch 1: heat a pan over medium heat. Add half the cooking butter. Once melted, add the first batch of chicken — don't overcrowd the pan. Cook 4–5 minutes on one side until golden brown.",
    "Flip and cook the other side 3–4 more minutes.",
    "Lower the heat. Add half the finishing butter, half the minced garlic, and 1 tbsp honey. Stir until well coated and sticky. Set aside.",
    "Repeat the cooking and glazing steps with the second batch of chicken, using the remaining butter, garlic, and 1 tbsp honey.",
    "Cook the pasta according to package directions. Drain and set aside.",
    "In the same pan used for the chicken (don't wipe it out — that residual butter is flavor!), cook the minced garlic over medium-low heat for 2 minutes until fragrant. Add milk, cream cheese, salt, pepper, smoked paprika, and nutmeg. Stir until completely smooth. If needed, transfer to a larger pot.",
    "Lower the heat before adding shredded cheddar. Stir until melted. Add cooked pasta and mix well. Serve topped with the honey garlic chicken and fresh parsley. Enjoy!"
  ],

  notes: [
    "Chicken serves 4. Mac and cheese is scaled to 1.5x to serve 5–6 (one person skipping the chicken).",
    "The cream cheese at 1.5x works out to basically one full 8oz Philadelphia block — convenient!",
    "Cook chicken in two batches for best browning."
  ]
},

{
  id: "creamy-chicken-piccata",
  title: "Creamy Chicken Piccata",
  description: "Pan-seared in butter and olive oil, with white cooking wine and a glossy lemon-caper cream sauce.",
  image: "images/creamy-chicken-piccata.png",
  category: "Chicken",
  dateAdded: "2026-06-15",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "6",
  tags: ["chicken", "Italian-inspired", "weeknight dinner"],

  ingredients: [
    {
      title: "For the Chicken",
      items: [
        "2 lbs boneless skinless chicken breast, pounded or sliced into thin cutlets",
        "⅓ cup all-purpose flour",
        "2 tsp garlic powder",
        "1½ tsp kosher salt",
        "½ tsp black pepper"
      ]
    },
    {
      title: "For the Sear",
      items: [
        "1 tbsp unsalted butter",
        {
          qty: 1.5,
          unit: "tbsp",
          name: "olive oil",
          note: "Pairing it with butter lets the sear go hotter without scorching, while still keeping that buttery flavor — swap in plain butter or a neutral oil and you'll lose one or the other.",
          guideLink: { guideId: "oils-and-fats", tab: "smoke" },
        },
      ]
    },
    {
      title: "For the Sauce",
      items: [
        "¼ cup white cooking wine",
        "½ cup chicken broth",
        "⅓ cup fresh lemon juice (about 3 lemons)",
        "4 tbsp unsalted butter",
        "3 garlic cloves, minced",
        "¼ cup brined capers, drained",
        "½ cup heavy cream",
        "¼ tsp red pepper flakes",
        "1 tbsp cold unsalted butter, for finishing",
        "Salt and pepper to taste",
        "Fresh parsley, for garnish"
      ]
    }
  ],

  steps: [
    "Season chicken lightly with salt and pepper on both sides. Combine the flour, garlic powder, 1½ tsp salt, and pepper in a shallow dish. Dredge each cutlet to coat lightly on both sides.",
    "Heat 1 tbsp butter and 1½ tbsp olive oil together in a large heavy skillet over medium heat until the butter foams and subsides. Working in batches if needed, sear the cutlets 3–4 minutes per side without crowding. Remove and set aside. Reduce heat to low.",
    "Add the minced garlic to the pan and sauté about 30 seconds until fragrant. Pour in the white cooking wine and scrape up all the browned bits from the bottom of the pan. Let it bubble and reduce by about half, 1–2 minutes.",
    "Add the 4 tbsp butter and let it melt, then stir in the broth and lemon juice. Bring to a gentle simmer, then slowly stir in the heavy cream and add the capers and red pepper flakes.",
    "Return the chicken to the pan and simmer gently 4–8 minutes until cooked through (165°F internal temp). Taste the sauce and adjust salt as needed.",
    "Remove from heat. Swirl in the cold finishing butter until glossy. Garnish with fresh parsley and lemon slices. Serve immediately over pasta, rice, or with crusty bread."
  ],

  notes: [
    "Pat the chicken dry before dredging so the flour sticks evenly and you get a proper sear instead of steaming.",
    "The finishing butter is optional but makes the sauce glossy and restaurant-rich — don't skip it if you can help it.",
    "If the sauce breaks (looks greasy or separated), pull it fully off heat and whisk in a splash of cold cream or broth.",
    "White cooking wine has added salt, so taste before salting the sauce further."
  ]
},

{
  id: "smothered-chicken",
  title: "Smothered Chicken",
  description: "Southern comfort done right — bold spiced chicken seared golden, then finished in a rich, bacony pan gravy.",
  image: "images/smothered-chicken.png",
  category: "Chicken",
  dateAdded: "2026-06-28",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "4",
  tags: ["chicken", "southern", "comfort food", "bacon", "gravy", "skillet", "weeknight dinner"],

  ingredients: [
    {
      title: "The Dredge",
      items: [
        { qty: 0.5, unit: "cup", name: "flour", notes: "all-purpose" },
        { qty: 2, unit: "tsp", name: "kosher salt" },
        { qty: 2, unit: "tsp", name: "garlic powder" },
        { qty: 1.5, unit: "tsp", name: "smoked paprika" },
        { qty: 1.5, unit: "tsp", name: "onion powder" },
        { qty: 1, unit: "tsp", name: "black pepper", notes: "freshly ground" },
        { qty: 0.25, unit: "tsp", name: "white pepper" },
        { qty: 0.5, unit: "tsp", name: "cayenne pepper" }
      ]
    },
    {
      title: "The Chicken",
      items: [
        { qty: 1.5, unit: "lb", name: "chicken breast", notes: "thin-sliced, boneless skinless" },
        { qty: 3, unit: "tbsp", name: "avocado oil" }
      ]
    },
    {
      title: "The Gravy",
      items: [
        { qty: 3, unit: "slice", name: "bacon", notes: "center cut, chopped" },
        { qty: 0.5, unit: "cup", name: "sweet onion", notes: "finely chopped, from 1 small onion" },
        { qty: 1.5, unit: "tbsp", name: "garlic", notes: "minced, from about 4 cloves" },
        { qty: 1.5, unit: "cup", name: "chicken broth" },
        { qty: 0.5, unit: "cup", name: "half and half" },
        { qty: 1, unit: "tsp", name: "Worcestershire sauce" },
        { qty: 0.75, unit: "tsp", name: "kosher salt" },
        { qty: 1, unit: "tbsp", name: "unsalted butter" }
      ]
    },
    {
      title: "Garnish",
      items: [
        { qty: null, unit: null, name: "remaining cooked bacon", notes: "reserved from above" },
        { qty: 2, unit: "tbsp", name: "green onions", notes: "sliced" }
      ]
    }
  ],

  steps: [
    "Make the dredge: Stir together the flour, 2 tsp salt, garlic powder, smoked paprika, onion powder, black pepper, white pepper, and cayenne in a shallow bowl. Reserve 3 Tbsp of this mixture for the gravy. Dredge the chicken in the remaining flour mixture and set aside.",
    "Sear the chicken: Heat avocado oil in a large skillet over medium. Working in batches, sear chicken about 2 minutes per side — just until golden. They'll finish cooking in the gravy, so pull them when golden, not fully cooked. Remove to a plate.",
    "Cook the bacon: Add bacon to the pan drippings and cook over medium, stirring occasionally, until browned and crisp, about 4–5 minutes. Remove bacon with a slotted spoon to a paper towel-lined plate. Reserve half the bacon for garnish; set the other half aside to stir into the gravy. If the pan looks dry after removing the bacon, leave any remaining searing oil in — don't drain it.",
    "Build the base: Cook onion in the drippings over medium until softened, about 3 minutes. Add garlic and cook until fragrant, about 1 minute.",
    "Make the gravy: Add the reserved 3 Tbsp flour mixture to the skillet and stir constantly for about 2 minutes until the raw flour smell is gone. Slowly whisk in chicken broth, then half and half, then Worcestershire sauce. Cook over medium-high, whisking constantly, until thickened — about 4–5 minutes. Stir in the remaining 3/4 tsp salt and taste.",
    "Finish the chicken: Nestle chicken back into the gravy and cook uncovered for 2–3 minutes, until cooked through and gravy clings to the chicken. Stir in the reserved half of the bacon. Remove from heat and swirl in the butter.",
    "Serve: Garnish with remaining bacon and sliced scallions. Serve over mashed potatoes or rice."
  ],

  notes: [
    "Don't cover the pan during the final simmer — keeping it open lets the gravy tighten and cling rather than steam the chicken.",
    "Thin-sliced breasts cook fast. Pull from the sear when golden, not fully cooked — they'll finish in 2–3 minutes in the gravy.",
    "If your bacon renders less fat than expected, just leave the avocado oil from searing in the pan rather than draining it.",
    "Serve over mashed potatoes or rice to catch every bit of that gravy."
  ]
},

  {
  id: "bold-shrimp-scampi-with-angel-hair",
  title: "Bold Shrimp Scampi with Angel Hair",
  description: "Big garlic energy, properly saucy pasta, and just enough heat to keep things interesting.",
  image: "images/shrimp-scampi.png",
  category: "Seafood",
  dateAdded: "2026-06-28",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "6",
  tags: ["shrimp", "seafood", "pasta", "garlic", "weeknight dinner"],

  ingredients: [
    {
      title: "For the Shrimp",
      items: [
        { qty: 1.5, unit: "lb", name: "large shrimp", notes: "peeled and deveined" },
        { qty: 0.5, unit: "tsp", name: "garlic powder" },
        { qty: null, unit: null, name: "Salt and black pepper, to taste" }
      ]
    },
    {
      title: "For the Sauce and Pasta",
      items: [
        { qty: 12, unit: "oz", name: "angel hair pasta" },
        { qty: 4, unit: "tbsp", name: "unsalted butter" },
        { qty: 3, unit: "tbsp", name: "olive oil" },
        { qty: 10, unit: "clove", name: "garlic", notes: "minced" },
        { qty: 1, unit: null, name: "small yellow onion", notes: "finely diced" },
        { qty: 1, unit: "tsp", name: "red pepper flakes" },
        { qty: 1, unit: "cup", name: "dry white wine" },
        { qty: 1/3, unit: "cup", name: "lemon juice", notes: "from about 2 lemons", approx: true },
        { qty: 0.5, unit: "tsp", name: "worcestershire sauce" },
        { qty: 1, unit: "tsp", name: "hot sauce", notes: "such as Tabasco or Frank's" },
        { qty: 1, unit: "tsp", name: "salt" },
        { qty: 0.75, unit: "tsp", name: "black pepper" },
        { qty: 0.5, unit: "cup", name: "reserved pasta water" }
      ]
    },
    {
      title: "To Finish",
      items: [
        { qty: 0.25, unit: "cup", name: "fresh chopped parsley" },
        { qty: 0.25, unit: "cup", name: "parmesan", notes: "grated, optional", optional: true }
      ]
    }
  ],

  steps: [
    "Season the shrimp: Pat shrimp dry with paper towels — wet shrimp steam instead of sear. Toss with garlic powder, a pinch of salt, and a pinch of black pepper. Set aside.",
    "Cook the pasta: Bring a large pot of heavily salted water to a boil. Cook angel hair until just shy of al dente — it'll finish in the sauce. Before draining, scoop out at least 1/2 cup of pasta water. Drain and set pasta aside.",
    "Sear the shrimp: Heat olive oil in a large skillet over medium-high until shimmering. Add shrimp in a single layer — don't crowd them. Sear 60–90 seconds per side until they just start to get color but are NOT fully cooked through. Pull them out onto a plate and set aside.",
    "Bloom the butter and pepper flakes: Reduce heat to medium. Add butter to the same pan. Once foamy, add red pepper flakes and stir for 30 seconds until sizzling and fragrant.",
    "Build the aromatics: Add onion and all 10 cloves of minced garlic. Cook, stirring frequently, for 3–4 minutes until the onion is translucent and the garlic is golden and fragrant — not brown.",
    "Reduce the wine: Pour in the white wine and turn heat to medium-high. Let it reduce by about half, stirring occasionally — about 4–5 minutes. You want the alcohol smell gone and the sauce visibly thickened.",
    "Add worcestershire and lemon: Reduce heat to medium. Stir in the worcestershire sauce and hot sauce, then add the lemon juice. Taste and adjust salt and pepper before the shrimp go back in.",
    "Finish the shrimp and pasta: Reduce heat to low. Add the drained pasta directly to the pan and toss to coat, adding splashes of reserved pasta water as needed to make the sauce glossy and clingy. Nestle the seared shrimp back in and toss everything together for about 1 minute until the shrimp are just cooked through.",
    "Serve: Plate immediately and top with fresh parsley and a light sprinkle of parmesan if using. Scampi waits for no one."
  ],

  notes: [
    "The pasta water is non-negotiable. The starch is what makes the sauce glossy and clingy instead of thin and soupy. Don't skip scooping it out before you drain.",
    "Worcestershire is the secret weapon. Half a teaspoon sounds like nothing, but it adds a savory backbone that makes everything taste more intensely like itself. You won't detect it — you'll just wonder why this tastes better than other scampis.",
    "Wine: Use something you'd drink. Pinot Grigio or Sauvignon Blanc are ideal. Avoid anything labeled \"cooking wine.\"",
    "Heat level: As written this is medium — noticeable but not aggressive. Pull the red pepper flakes back to 1/2 tsp if you're cooking for heat-sensitive folks.",
    "Don't overcook the shrimp. Pull them from the sear before they're fully done — they finish in the sauce. Overcooked shrimp are rubbery and sad."
  ]
},

  {
  id: "nacho-bar-queso",
  title: "Nacho Bar Queso (BWW Hatch Chile Copycat)",
  description: "A smooth, pourable queso loaded with Hatch green chiles — copycat-style from Buffalo Wild Wings, with optional chorizo for the meat lovers.",
  image: "images/no-photo.jpg",
  category: "Snacks & Sides",
  dateAdded: "2026-06-30",
  carbs: null,
  fat: null,
  fiber: null,
  calories: "",
  protein: "",
  servings: "6",
  tags: ["queso", "dip", "cheese", "hatch chile", "party", "copycat"],

  ingredients: [
    {
      title: "Cheese Base",
      items: [
        { qty: 16, unit: "oz", name: "white American cheese", notes: "cubed" },
        { qty: 8, unit: "oz", name: "pepper jack cheese", notes: "shredded" }
      ]
    },
    {
      title: "Liquid + Stabilizer",
      items: [
        { qty: 18, unit: "fl oz", name: "evaporated milk", notes: "about 1½ cans" },
        { qty: 1.5, unit: "tbsp", name: "cornstarch" }
      ]
    },
    {
      title: "Flavor",
      items: [
        { qty: 1, unit: "cup", name: "Hatch green chiles", notes: "drained and lightly sautéed" },
        { qty: 0.75, unit: "tsp", name: "kosher salt" },
        { qty: 0.5, unit: "tsp", name: "garlic powder" },
        { qty: 0.5, unit: "tsp", name: "onion powder" },
        { qty: 1, unit: "tsp", name: "smoked paprika" },
        { qty: 1, unit: "tsp", name: "ground cumin" },
        { qty: null, unit: null, name: "Optional: splash of jalapeño brine", optional: true }
      ]
    },
    {
      title: "Chorizo (Cooked Separately)",
      items: [
        { qty: 12, qtyMax: 16, unit: "oz", name: "chorizo", notes: "browned and drained", optional: true }
      ]
    }
  ],

  steps: [
    "Cold whisk the cornstarch into the evaporated milk until smooth.",
    "Heat gently in a saucepan over medium-low until steaming — do not boil.",
    "Lower the heat and add the cheeses gradually, stirring constantly until fully melted and smooth.",
    "Stir in the Hatch green chiles and all seasonings. Taste and adjust.",
    "Fold in the browned chorizo, or keep it separate for people to add themselves.",
    "Keep warm on low heat, splashing in extra evaporated milk if it thickens too much.",
    "Serve with optional toppings like salsa, extra jalapeños, fresh cilantro, or pico de gallo."
  ],

  notes: [
    "Use freshly cubed white American deli cheese for the smoothest melt — pre-packaged slices work but may be slightly grainier.",
    "Sauté the Hatch chiles briefly in a dry pan before adding to drive off excess moisture and deepen their flavor.",
    "A splash of jalapeño brine at the end brightens everything without adding visible heat."
  ]
},

];