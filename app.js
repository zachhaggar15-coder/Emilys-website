(function () {
  var cards = window.COUNTRY_CAPITALS || [];
  var continents = ["Whole World", "Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
  var populationFilters = [
    { label: "All", value: "all" },
    { label: "Well known", value: "well-known" },
    { label: "Medium", value: "medium" },
    { label: "Niche", value: "niche" },
  ];
  var sessionModes = [
    { label: "Practice", value: "practice" },
    { label: "Daily challenge", value: "challenge" },
    { label: "Review mistakes", value: "review" },
  ];
  var timerOptions = {
    off: 0,
    "30": 30,
    "60": 60,
  };
  var challengeSize = 10;
  var shopStorageKey = "capitalCards.shop.v1";
  var heartRewards = {
    correct: 5,
    correctWithHint: 3,
    streakBonus: 10,
    roundComplete: 10,
    perfectDaily: 50,
  };
  var shopCategories = [
    {
      id: "theme",
      label: "Themes",
      copy: "Repaint the whole game in a new colour palette.",
    },
    {
      id: "effect",
      label: "Celebrations",
      copy: "Choose what rains down when you hit a streak or ace a round.",
    },
    {
      id: "buddy",
      label: "Study buddies",
      copy: "A little friend who sits on your card and cheers you on.",
    },
    {
      id: "home",
      label: "Coo homes",
      copy: "Pick where your coo lives. The background changes behind your coo.",
    },
    {
      id: "friend",
      label: "Friends",
      copy: "Once your coo is all grown up (day 90), a little friend can move in too.",
    },
    {
      id: "cow",
      label: "Coo outfits",
      copy: "Dress up your highland cow. One hat, one pair of glasses and one neck piece at a time. Tap again to take it off.",
    },
  ];
  var shopItems = [
    { id: "theme-ocean", category: "theme", name: "Ocean Breeze", price: 0, icon: "🌊", swatch: ["#0f766e", "#d9f5f0", "#f4f9fc"] },
    { id: "theme-strawberry", category: "theme", name: "Strawberry Milk", price: 60, icon: "🍓", swatch: ["#db2777", "#fce7f3", "#fff5f9"] },
    { id: "theme-lavender", category: "theme", name: "Lavender Dream", price: 80, icon: "💜", swatch: ["#7c3aed", "#ede9fe", "#faf7ff"] },
    { id: "theme-peach", category: "theme", name: "Peach Sorbet", price: 80, icon: "🍑", swatch: ["#ea580c", "#ffedd5", "#fff8f1"] },
    { id: "theme-matcha", category: "theme", name: "Matcha Latte", price: 100, icon: "🍵", swatch: ["#4d7c0f", "#ecfccb", "#fbfef5"] },
    { id: "theme-cotton-candy", category: "theme", name: "Cotton Candy", price: 150, icon: "🍭", swatch: ["#c026d3", "#e0f2fe", "#fdf4ff"] },
    { id: "effect-confetti", category: "effect", name: "Confetti", price: 0, icon: "🎊" },
    { id: "effect-hearts", category: "effect", name: "Love hearts", price: 40, icon: "💕", pieces: ["💖", "💕", "💗", "💓"] },
    { id: "effect-stars", category: "effect", name: "Shooting stars", price: 50, icon: "⭐", pieces: ["⭐", "🌟", "✨", "💫"] },
    { id: "effect-petals", category: "effect", name: "Cherry blossoms", price: 70, icon: "🌸", pieces: ["🌸", "💮", "🌷"] },
    { id: "effect-butterflies", category: "effect", name: "Butterflies", price: 90, icon: "🦋", pieces: ["🦋", "🦋", "✨"] },
    { id: "effect-kittens", category: "effect", name: "Kitten shower", price: 120, icon: "🐱", pieces: ["🐱", "😻", "🐾", "😸"] },
    { id: "buddy-none", category: "buddy", name: "No buddy", price: 0, icon: "🫥" },
    { id: "buddy-cow", category: "buddy", name: "Your highland coo", price: 0, icon: "🐮" },
    { id: "buddy-kitty", category: "buddy", name: "Kitty", price: 40, icon: "🐱" },
    { id: "buddy-bunny", category: "buddy", name: "Bunny", price: 60, icon: "🐰" },
    { id: "buddy-frog", category: "buddy", name: "Froggy", price: 60, icon: "🐸" },
    { id: "buddy-penguin", category: "buddy", name: "Penguin", price: 80, icon: "🐧" },
    { id: "buddy-bear", category: "buddy", name: "Teddy", price: 80, icon: "🧸" },
    { id: "buddy-unicorn", category: "buddy", name: "Unicorn", price: 150, icon: "🦄" },
    { id: "home-meadow", category: "home", name: "Sunny meadow", price: 0, icon: "🌼" },
    { id: "home-glen", category: "home", name: "Highland glen", price: 60, icon: "⛰️" },
    { id: "home-barn", category: "home", name: "Cosy barn", price: 80, icon: "🛖" },
    { id: "home-beach", category: "home", name: "Seaside", price: 100, icon: "🏖️" },
    { id: "home-snow", category: "home", name: "Snowy field", price: 120, icon: "❄️" },
    { id: "friend-none", category: "friend", name: "Just us", price: 0, icon: "💕" },
    { id: "friend-sheep", category: "friend", name: "Woolly sheep", price: 0, icon: "🐑", grownOnly: true },
    { id: "friend-chick", category: "friend", name: "Little chick", price: 60, icon: "🐥", grownOnly: true },
    { id: "friend-piglet", category: "friend", name: "Piglet", price: 80, icon: "🐷", grownOnly: true },
    { id: "cow-bow", category: "cow", slot: "hat", name: "Pink bow", price: 30 },
    { id: "cow-bell", category: "cow", slot: "neck", name: "Cow bell", price: 30 },
    { id: "cow-bow-tie", category: "cow", slot: "neck", name: "Bow tie", price: 40 },
    { id: "cow-round-glasses", category: "cow", slot: "face", name: "Reading glasses", price: 50 },
    { id: "cow-party-hat", category: "cow", slot: "hat", name: "Party hat", price: 60 },
    { id: "cow-scarf", category: "cow", slot: "neck", name: "Cosy scarf", price: 60 },
    { id: "cow-heart-glasses", category: "cow", slot: "face", name: "Heart sunglasses", price: 70 },
    { id: "cow-flower-crown", category: "cow", slot: "hat", name: "Flower crown", price: 80 },
    { id: "cow-crown", category: "cow", slot: "hat", name: "Royal crown", price: 150 },
    { id: "cow-beret", category: "cow", slot: "hat", name: "French beret", price: null, exclusive: "Europe" },
    { id: "cow-blossom-clip", category: "cow", slot: "hat", name: "Blossom clip", price: null, exclusive: "Asia" },
    { id: "cow-safari-hat", category: "cow", slot: "hat", name: "Safari hat", price: null, exclusive: "Africa" },
    { id: "cow-cowboy-hat", category: "cow", slot: "hat", name: "Cowboy hat", price: null, exclusive: "North America" },
    { id: "cow-beanie", category: "cow", slot: "hat", name: "Knitted beanie", price: null, exclusive: "South America" },
    { id: "cow-lei", category: "cow", slot: "neck", name: "Flower lei", price: null, exclusive: "Oceania" },
  ];
  var petGrowDays = 90;
  var petStages = [
    { id: "egg", fromDay: 0, label: "Egg" },
    { id: "egg-cracked", fromDay: 2, label: "Hatching egg" },
    { id: "calf", fromDay: 3, label: "Newborn calf" },
    { id: "young-calf", fromDay: 15, label: "Calf" },
    { id: "young", fromDay: 45, label: "Young coo" },
    { id: "adult", fromDay: 90, label: "Grown-up highland coo" },
  ];
  // Happiness drops slowly over time (about 30% a day) and snacks top it back up.
  // It never hurts the cow: at worst it gets sleepy until the next snack.
  var happinessLossPerHour = 1.25;
  var happyBonusThreshold = 70;
  var snacks = [
    { id: "grass", name: "Fresh grass", icon: "🌿", price: 5, happiness: 10 },
    { id: "carrot", name: "Carrot", icon: "🥕", price: 10, happiness: 20 },
    { id: "apple", name: "Apple", icon: "🍎", price: 15, happiness: 30 },
    { id: "biscuit", name: "Oat biscuit", icon: "🍪", price: 20, happiness: 45 },
    { id: "cake", name: "Birthday cake", icon: "🍰", price: 40, happiness: 100, party: true },
  ];
  var petLines = {
    fed: ["Nom nom!", "Mmm, tasty!", "Moo-velous!", "*happy chewing*", "Thank moo! 💕"],
    party: ["Party time! 🎉", "Best day ever!", "Cake!!! 💕"],
    pet: ["Moo!", "Hi! 💕", "*swishes tail*", "Hehe", "Love you!"],
    correct: ["Moo-velous!", "So clever!", "Yay!", "Genius coo-mate!"],
    wrong: ["It's okay!", "Next one!", "Moo worries 💕"],
    streak: ["Streak! 🔥", "Moo-nstoppable!", "Yeehaw! 🎉"],
    tricky: ["Ooh, a tricky one!", "Hmm, this one's rare!", "Ooh, niche!"],
    hello: ["Welcome back! 💕", "Hi hi! 👋", "Moo! Missed you 💕", "Yay, you're here!"],
  };
  var backupPrefix = "COO1:";
  var backupReminderDays = 14;
  var birthdayEveryDays = 30;
  // Each week has a different continent to explore, in this order.
  var journeyOrder = ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"];
  var journeyTiers = [
    { id: "bronze", label: "Bronze", medal: "🥉", target: 10, hearts: 20 },
    { id: "silver", label: "Silver", medal: "🥈", target: 25, hearts: 40 },
    { id: "gold", label: "Gold", medal: "🥇", target: 50, hearts: 80, outfit: true },
  ];
  var defaultEquipped = {
    theme: "theme-ocean",
    effect: "effect-confetti",
    buddy: "buddy-cow",
    home: "home-meadow",
    friend: "friend-none",
    "cow-hat": "",
    "cow-face": "",
    "cow-neck": "",
  };
  var buddyLines = {
    correct: ["Yay!", "So smart!", "You got it!", "Wow 💕", "Genius!", "Go you!"],
    wrong: ["It's okay!", "Next one!", "Almost!", "You've got this", "No worries 💕"],
    streak: ["On fire!", "Unstoppable!", "Superstar!"],
    tricky: ["Ooh, a tricky one!", "Hmm, a rare one!"],
  };
  var mapPathById = {};
  var mapCenterById = {};
  var svgNamespace = "http://www.w3.org/2000/svg";
  // Each frame hugs its continent with a small margin (measured from the map shapes).
  var mapViewBoxes = {
    "Whole World": "0 0 1000 500",
    Africa: "423 140 246 213",
    Asia: "566 90 344 195",
    Europe: "426 20 191 139",
    "North America": "17 13 343 223",
    "South America": "268 209 142 202",
    Oceania: "808 220 224 166",
    Caribbean: "258 170 88 64",
  };

  // Tiny islands that crowd together; "Tap the map" zooms right in on them.
  var caribbeanIslandIds = ["atg", "brb", "dma", "grd", "kna", "lca", "vct", "tto"];
  var mapTapTargetPx = 8;
  // Countries whose islands sit either side of the date line look huge to the code but are tiny on screen.
  var dateLineIslands = { fji: { lon: 178.1, lat: -17.8 } };
  var smallCountryMarkers = {
    and: { lon: 1.52, lat: 42.51 },
    atg: { lon: -61.8, lat: 17.06 },
    bhr: { lon: 50.56, lat: 26.07 },
    brb: { lon: -59.54, lat: 13.19 },
    cpv: { lon: -23.51, lat: 14.93 },
    com: { lon: 43.33, lat: -11.65 },
    dma: { lon: -61.37, lat: 15.42 },
    grd: { lon: -61.68, lat: 12.12 },
    kir: { lon: 173.0, lat: 1.87 },
    lie: { lon: 9.56, lat: 47.17 },
    mdv: { lon: 73.51, lat: 4.18 },
    mhl: { lon: 171.18, lat: 7.13 },
    mus: { lon: 57.5, lat: -20.2 },
    fsm: { lon: 158.2, lat: 6.9 },
    mco: { lon: 7.42, lat: 43.74 },
    nru: { lon: 166.93, lat: -0.52 },
    plw: { lon: 134.58, lat: 7.5 },
    kna: { lon: -62.73, lat: 17.36 },
    lca: { lon: -60.98, lat: 13.91 },
    vct: { lon: -61.29, lat: 13.25 },
    wsm: { lon: -172.1, lat: -13.76, wrapPacific: true },
    smr: { lon: 12.46, lat: 43.94 },
    stp: { lon: 6.61, lat: 0.19 },
    syc: { lon: 55.45, lat: -4.68 },
    sgp: { lon: 103.82, lat: 1.35 },
    ton: { lon: -175.2, lat: -21.18, wrapPacific: true },
    tuv: { lon: 179.19, lat: -8.52 },
  };
  var state = {
    continent: "Whole World",
    populationTier: "all",
    mode: "country-to-capital",
    sessionMode: "practice",
    answerStyle: "type",
    timerMode: "off",
    timerRemaining: 0,
    timerId: null,
    roundEnded: false,
    hintShown: false,
    deck: [],
    deckIndex: 0,
    current: null,
    promptType: "country",
    hasAnswered: false,
    score: 0,
    answered: 0,
    streak: 0,
    bestStreak: 0,
    mapStatusById: {},
    mistakeIds: {},
    history: [],
    correctByContinent: {},
    perfectChallengeEarned: false,
    mapCollapsed: false,
    shopCategory: "theme",
    mapTappedId: null,
    calendarMonth: null,
    selectedDiaryDay: null,
    shop: loadShop(),
  };

  var elements = {
    continentControls: document.getElementById("continent-controls"),
    populationControls: document.getElementById("population-controls"),
    sessionControls: document.getElementById("session-controls"),
    modeSelect: document.getElementById("mode-select"),
    answerStyleSelect: document.getElementById("answer-style-select"),
    timerSelect: document.getElementById("timer-select"),
    restartButton: document.getElementById("restart-button"),
    scoreValue: document.getElementById("score-value"),
    streakValue: document.getElementById("streak-value"),
    bestStreakValue: document.getElementById("best-streak-value"),
    deckCount: document.getElementById("deck-count"),
    answeredCount: document.getElementById("answered-count"),
    timerPill: document.getElementById("timer-pill"),
    timerValue: document.getElementById("timer-value"),
    progressFill: document.getElementById("progress-fill"),
    levelBadge: document.getElementById("level-badge"),
    badgeRack: document.getElementById("badge-rack"),
    motivationText: document.getElementById("motivation-text"),
    mapPanel: document.querySelector(".map-panel"),
    countryMap: document.getElementById("country-map"),
    mapTitle: document.getElementById("map-title"),
    mapDetail: document.getElementById("map-detail"),
    mapToggleButton: document.getElementById("map-toggle-button"),
    cardFrame: document.getElementById("card-frame"),
    flashcard: document.getElementById("flashcard"),
    promptLabel: document.getElementById("prompt-label"),
    promptFlag: document.getElementById("prompt-flag"),
    promptText: document.getElementById("prompt-text"),
    promptHelper: document.getElementById("prompt-helper"),
    answerText: document.getElementById("answer-text"),
    answerFlag: document.getElementById("answer-flag"),
    answerHelper: document.getElementById("answer-helper"),
    funFactText: document.getElementById("fun-fact-text"),
    typedAnswerForm: document.getElementById("typed-answer-form"),
    typedAnswerInput: document.getElementById("typed-answer-input"),
    choiceAnswer: document.getElementById("choice-answer"),
    feedbackText: document.getElementById("feedback-text"),
    hintButton: document.getElementById("hint-button"),
    showAnswerButton: document.getElementById("show-answer-button"),
    nextButton: document.getElementById("next-button"),
    countrySearchInput: document.getElementById("country-search-input"),
    countryListCount: document.getElementById("country-list-count"),
    countryList: document.getElementById("country-list"),
    roundSummary: document.getElementById("round-summary"),
    summaryTitle: document.getElementById("summary-title"),
    summaryCopy: document.getElementById("summary-copy"),
    summaryStats: document.getElementById("summary-stats"),
    summaryMissedList: document.getElementById("summary-missed-list"),
    summaryCloseButton: document.getElementById("summary-close-button"),
    summaryReviewButton: document.getElementById("summary-review-button"),
    summaryNewRoundButton: document.getElementById("summary-new-round-button"),
    celebrationLayer: document.getElementById("celebration-layer"),
    heartWallet: document.getElementById("heart-wallet"),
    heartCount: document.getElementById("heart-count"),
    heartPopLayer: document.getElementById("heart-pop-layer"),
    shopButton: document.getElementById("shop-button"),
    shopOverlay: document.getElementById("shop-overlay"),
    shopCloseButton: document.getElementById("shop-close-button"),
    shopHeartCount: document.getElementById("shop-heart-count"),
    shopTabs: document.getElementById("shop-tabs"),
    shopCategoryCopy: document.getElementById("shop-category-copy"),
    shopGrid: document.getElementById("shop-grid"),
    cardBuddy: document.getElementById("card-buddy"),
    petName: document.getElementById("pet-name"),
    petNameRow: document.getElementById("pet-name-row"),
    petNameForm: document.getElementById("pet-name-form"),
    petNamePrompt: document.getElementById("pet-name-prompt"),
    petNameInput: document.getElementById("pet-name-input"),
    petNameCancel: document.getElementById("pet-name-cancel"),
    petRenameButton: document.getElementById("pet-rename-button"),
    petStageLabel: document.getElementById("pet-stage-label"),
    petGrowthFill: document.getElementById("pet-growth-fill"),
    petGrowthNote: document.getElementById("pet-growth-note"),
    petStage: document.getElementById("pet-stage"),
    petArt: document.getElementById("pet-art"),
    petSpeech: document.getElementById("pet-speech"),
    petHappinessValue: document.getElementById("pet-happiness-value"),
    petHappinessFill: document.getElementById("pet-happiness-fill"),
    petMood: document.getElementById("pet-mood"),
    snackRow: document.getElementById("snack-row"),
    journeyTitle: document.getElementById("journey-title"),
    journeyCopy: document.getElementById("journey-copy"),
    journeyFill: document.getElementById("journey-fill"),
    journeyMarkers: document.getElementById("journey-markers"),
    journeyCount: document.getElementById("journey-count"),
    journeyRewards: document.getElementById("journey-rewards"),
    journeyPlayButton: document.getElementById("journey-play-button"),
    journeyNext: document.getElementById("journey-next"),
    toast: document.getElementById("toast"),
    petScene: document.getElementById("pet-scene"),
    petFriend: document.getElementById("pet-friend"),
    mapShell: document.querySelector(".map-shell"),
    mapLegend: document.querySelector(".map-legend"),
    mapAnswer: document.getElementById("map-answer"),
    mapAnswerCopy: document.getElementById("map-answer-copy"),
    soundButton: document.getElementById("sound-button"),
    soundIcon: document.getElementById("sound-icon"),
    soundLabel: document.getElementById("sound-label"),
    backupButton: document.getElementById("backup-button"),
    backupOverlay: document.getElementById("backup-overlay"),
    backupCloseButton: document.getElementById("backup-close-button"),
    backupCode: document.getElementById("backup-code"),
    backupCopyButton: document.getElementById("backup-copy-button"),
    backupCopyStatus: document.getElementById("backup-copy-status"),
    backupLast: document.getElementById("backup-last"),
    restoreCode: document.getElementById("restore-code"),
    restoreButton: document.getElementById("restore-button"),
    restoreStatus: document.getElementById("restore-status"),
    scrapbookButton: document.getElementById("scrapbook-button"),
    scrapbookOverlay: document.getElementById("scrapbook-overlay"),
    scrapbookCloseButton: document.getElementById("scrapbook-close-button"),
    scrapbookStats: document.getElementById("scrapbook-stats"),
    calendarPrev: document.getElementById("calendar-prev"),
    calendarNext: document.getElementById("calendar-next"),
    calendarMonth: document.getElementById("calendar-month"),
    calendarGrid: document.getElementById("calendar-grid"),
    calendarDayDetail: document.getElementById("calendar-day-detail"),
    cardBuddyFace: document.getElementById("card-buddy-face"),
    cardBuddyBubble: document.getElementById("card-buddy-bubble"),
  };

  var encouragement = {
    start: [
      "Choose your deck and start the streak.",
      "One clean answer at a time. The map will start to stick.",
      "Ready when you are. Pick the pair hiding behind the card.",
    ],
    correct: [
      "Correct. Nice and crisp.",
      "That one landed.",
      "Sharp answer. Keep the streak alive.",
      "Clean recall. Your map is getting brighter.",
      "Exactly right. Next stop, another capital.",
    ],
    wrong: [
      "Close one. Read the pair, then take the next card.",
      "No drama. That answer is now easier to remember.",
      "Misses are useful here. Lock it in and keep moving.",
      "That one was slippery. The next card is yours.",
    ],
    streak: [
      "Three in a row. You are warming up.",
      "Five-card streak. That is real momentum.",
      "Ten-card streak. Serious geography rhythm.",
      "Fifteen-card streak. The world tour is moving fast.",
    ],
  };

  function init() {
    buildMapCache();
    renderContinentControls();
    renderPopulationControls();
    renderSessionControls();
    bindEvents();
    ensureEggInDiary();
    refreshPet(true);
    refreshJourney();
    applyEquippedItems();
    renderSoundButton();
    renderHearts();
    renderSnacks();
    renderPet();
    renderJourney();
    window.setInterval(function () {
      refreshPet(false);
      refreshJourney();
      renderPet();
      renderJourney();
    }, 60000);
    renderMapCollapseState();
    renderCountryBrowser();
    startRound();
    window.setTimeout(greetVisitor, 900);
    window.setTimeout(maybeRemindBackup, 7000);
  }

  function bindEvents() {
    elements.modeSelect.addEventListener("change", function (event) {
      state.mode = event.target.value;
      startRound();
    });

    elements.answerStyleSelect.addEventListener("change", function (event) {
      state.answerStyle = event.target.value;
      startRound();
    });

    elements.timerSelect.addEventListener("change", function (event) {
      state.timerMode = event.target.value;
      startRound();
    });

    elements.restartButton.addEventListener("click", startRound);

    elements.typedAnswerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (state.hasAnswered) {
        nextCard();
        return;
      }
      checkTypedAnswer();
    });

    elements.hintButton.addEventListener("click", showHint);

    elements.showAnswerButton.addEventListener("click", function () {
      if (!state.current || state.hasAnswered) {
        return;
      }
      resolveAnswer(false, true);
    });

    elements.nextButton.addEventListener("click", nextCard);

    elements.countrySearchInput.addEventListener("input", renderCountryBrowser);

    elements.mapToggleButton.addEventListener("click", function () {
      state.mapCollapsed = !state.mapCollapsed;
      renderMapCollapseState();
    });

    elements.summaryCloseButton.addEventListener("click", closeRoundSummary);
    elements.summaryNewRoundButton.addEventListener("click", function () {
      closeRoundSummary();
      startRound();
    });
    elements.summaryReviewButton.addEventListener("click", function () {
      state.sessionMode = "review";
      closeRoundSummary();
      updateActiveSessionMode();
      startRound();
    });

    elements.shopButton.addEventListener("click", openShop);
    elements.soundButton.addEventListener("click", toggleSound);
    elements.backupButton.addEventListener("click", openBackup);
    elements.backupCloseButton.addEventListener("click", function () {
      closeDialog(elements.backupOverlay, elements.backupButton);
    });
    elements.backupCopyButton.addEventListener("click", copyBackupCode);
    elements.restoreButton.addEventListener("click", restoreFromCode);
    elements.scrapbookButton.addEventListener("click", openScrapbook);
    elements.scrapbookCloseButton.addEventListener("click", function () {
      closeDialog(elements.scrapbookOverlay, elements.scrapbookButton);
    });
    elements.calendarPrev.addEventListener("click", function () {
      moveCalendar(-1);
    });
    elements.calendarNext.addEventListener("click", function () {
      moveCalendar(1);
    });
    [elements.backupOverlay, elements.scrapbookOverlay].forEach(function (overlay) {
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
          overlay.hidden = true;
        }
      });
    });
    elements.countryMap.addEventListener("click", handleMapTap);
    watchDialogs();
    elements.petRenameButton.addEventListener("click", function () {
      openNameForm();
      elements.petNameInput.focus();
      elements.petNameInput.select();
    });
    elements.petNameForm.addEventListener("submit", savePetName);
    elements.petNameCancel.addEventListener("click", closeNameForm);
    elements.petStage.addEventListener("click", function () {
      if (getPetStage().id.indexOf("egg") === 0) {
        petSay(getPetStage().id === "egg" ? "*wobble wobble*" : "*crack*");
        bounceClass(elements.petArt, "is-wobbling", 700);
        return;
      }
      petSay(randomItem(petLines.pet));
      bounceClass(elements.petArt, "is-hopping", 650);
      playSound("moo");
    });
    elements.journeyPlayButton.addEventListener("click", function () {
      state.continent = getJourneyContinent();
      if (state.sessionMode === "review") {
        state.sessionMode = "practice";
      }
      updateActiveContinent();
      startRound();
      elements.cardFrame.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    elements.shopCloseButton.addEventListener("click", closeShop);
    elements.shopOverlay.addEventListener("click", function (event) {
      if (event.target === elements.shopOverlay) {
        closeShop();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && canUseEnterForNext(event.target)) {
        event.preventDefault();
        nextCard();
        return;
      }
      if (event.key !== "Escape") {
        return;
      }
      if (!elements.shopOverlay.hidden) {
        closeShop();
      }
      elements.backupOverlay.hidden = true;
      elements.scrapbookOverlay.hidden = true;
    });
  }

  function renderContinentControls() {
    elements.continentControls.innerHTML = "";
    continents.forEach(function (continent) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "chip";
      button.textContent = continent;
      button.setAttribute("aria-pressed", String(continent === state.continent));
      button.addEventListener("click", function () {
        state.continent = continent;
        updateActiveContinent();
        startRound();
      });
      elements.continentControls.appendChild(button);
    });
  }

  function renderPopulationControls() {
    elements.populationControls.innerHTML = "";
    populationFilters.forEach(function (filter) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "chip";
      button.textContent = filter.label;
      button.setAttribute("aria-pressed", String(filter.value === state.populationTier));
      button.addEventListener("click", function () {
        state.populationTier = filter.value;
        updateActivePopulationFilter();
        startRound();
      });
      elements.populationControls.appendChild(button);
    });
  }

  function renderSessionControls() {
    elements.sessionControls.innerHTML = "";
    sessionModes.forEach(function (mode) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "chip";
      button.dataset.value = mode.value;
      button.dataset.label = mode.label;
      button.textContent = getSessionModeLabel(mode);
      button.setAttribute("aria-pressed", String(mode.value === state.sessionMode));
      button.addEventListener("click", function () {
        state.sessionMode = mode.value;
        updateActiveSessionMode();
        startRound();
      });
      elements.sessionControls.appendChild(button);
    });
  }

  function updateActiveContinent() {
    Array.prototype.forEach.call(elements.continentControls.children, function (button) {
      button.setAttribute("aria-pressed", String(button.textContent === state.continent));
    });
  }

  function updateActivePopulationFilter() {
    Array.prototype.forEach.call(elements.populationControls.children, function (button) {
      var filter = populationFilters.find(function (item) {
        return item.label === button.textContent;
      });
      button.setAttribute("aria-pressed", String(filter && filter.value === state.populationTier));
    });
  }

  function updateActiveSessionMode() {
    Array.prototype.forEach.call(elements.sessionControls.children, function (button) {
      var mode = sessionModes.find(function (item) {
        return item.value === button.dataset.value;
      });
      button.textContent = mode ? getSessionModeLabel(mode) : button.dataset.label;
      button.setAttribute("aria-pressed", String(button.dataset.value === state.sessionMode));
    });
  }

  function getSessionModeLabel(mode) {
    if (mode.value === "review") {
      return mode.label + " (" + getMistakeCount() + ")";
    }
    return mode.label;
  }

  function buildMapCache() {
    var features = (window.WORLD_GEOJSON && window.WORLD_GEOJSON.features) || [];
    features.forEach(function (feature) {
      if (!feature.id) {
        return;
      }
      var id = feature.id.toLowerCase();
      mapPathById[id] = geometryToPath(feature.geometry);
      mapCenterById[id] = getFeatureCenter(feature.geometry);
    });
  }

  function startRound() {
    clearTimer();
    state.deck = getRoundDeck();
    state.deckIndex = 0;
    state.hasAnswered = false;
    state.roundEnded = false;
    state.hintShown = false;
    state.score = 0;
    state.answered = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.mapStatusById = {};
    state.history = [];
    state.timerRemaining = timerOptions[state.timerMode] || 0;
    elements.feedbackText.textContent = "";
    elements.motivationText.textContent = randomItem(encouragement.start);
    nextCard();
    if (state.deck.length && state.timerRemaining > 0) {
      startTimer();
    }
    updateActiveSessionMode();
    renderCountryBrowser();
    updateStats();
  }

  function getFilteredCards() {
    return cards.filter(function (card) {
      var matchesContinent = state.continent === "Whole World" || card.continent === state.continent;
      var matchesPopulation = state.populationTier === "all" || card.populationTier === state.populationTier;
      return matchesContinent && matchesPopulation;
    });
  }

  function getRoundDeck() {
    var filteredCards = getFilteredCards();
    if (state.sessionMode === "review") {
      return shuffle(filteredCards.filter(function (card) {
        return Boolean(state.mistakeIds[card.id]);
      }));
    }
    if (state.sessionMode === "challenge") {
      return seededShuffle(filteredCards, getDailySeed()).slice(0, Math.min(challengeSize, filteredCards.length));
    }
    return shuffle(filteredCards);
  }

  function getAvailableRoundCardCount() {
    var filteredCards = getFilteredCards();
    if (state.sessionMode === "review") {
      return filteredCards.filter(function (card) {
        return Boolean(state.mistakeIds[card.id]);
      }).length;
    }
    if (state.sessionMode === "challenge") {
      return Math.min(challengeSize, filteredCards.length);
    }
    return filteredCards.length;
  }

  function nextCard() {
    if (state.roundEnded) {
      return;
    }

    if (!state.deck.length) {
      renderEmptyDeck();
      updateStats();
      return;
    }

    if (state.deckIndex >= state.deck.length) {
      if (isFiniteRound()) {
        endRound("complete");
        return;
      }
      state.deck = shuffle(state.deck);
      state.deckIndex = 0;
    }

    state.current = state.deck[state.deckIndex];
    state.deckIndex += 1;
    state.hasAnswered = false;
    state.hintShown = false;
    state.promptType = getPromptType();
    state.mapTappedId = null;

    elements.cardFrame.classList.remove("answered", "is-correct", "is-wrong");
    elements.cardFrame.classList.toggle("is-flag-mode", state.promptType === "flag");
    elements.feedbackText.textContent = "";
    elements.typedAnswerInput.value = "";
    elements.typedAnswerInput.disabled = false;
    elements.hintButton.disabled = false;
    elements.nextButton.disabled = true;
    elements.nextButton.textContent = "Next card";
    elements.showAnswerButton.disabled = false;
    renderCard();
    renderAnswerControls();
    renderMap();
    updateStats();
    if (state.current.populationTier === "niche") {
      buddyReact("tricky");
    } else if (elements.cardBuddy.classList.contains("is-talking")) {
      elements.cardBuddy.classList.remove("is-talking");
      renderCardBuddy();
    }

    if (state.answerStyle === "type") {
      window.setTimeout(function () {
        elements.typedAnswerInput.focus();
      }, 80);
    }
  }

  function renderEmptyDeck() {
    state.current = null;
    state.hasAnswered = false;
    elements.cardFrame.classList.remove("answered", "is-correct", "is-wrong", "is-flag-mode");
    elements.promptLabel.textContent = "No cards";
    if (state.sessionMode === "review") {
      elements.promptText.textContent = getMistakeCount()
        ? "No matching mistakes"
        : "No mistakes yet";
      elements.promptHelper.textContent = getMistakeCount()
        ? "Try reviewing all continents or another well-known level."
        : "Miss or reveal a card, then come back here for targeted practice.";
    } else {
      elements.promptText.textContent = "No matches";
      elements.promptHelper.textContent = "Try another well-known level or continent.";
    }
    elements.answerText.textContent = "Adjust filters";
    elements.answerHelper.textContent = "This deck has no countries in that combination.";
    elements.funFactText.textContent = "Well known is 50m-plus people, medium is about 5m to 50m, and niche is under about 5m.";
    elements.promptFlag.className = "flag-symbol";
    elements.promptFlag.innerHTML = "";
    elements.answerFlag.className = "flag-symbol";
    elements.answerFlag.innerHTML = "";
    elements.feedbackText.textContent = "";
    elements.typedAnswerInput.value = "";
    elements.typedAnswerInput.disabled = true;
    elements.nextButton.disabled = true;
    elements.nextButton.textContent = "Next card";
    elements.hintButton.disabled = true;
    elements.showAnswerButton.disabled = true;
    elements.choiceAnswer.innerHTML = "";
    renderTimer();
    renderBadges();
    renderMap();
  }

  function getPromptType() {
    if (state.mode === "flag-to-country") {
      return "flag";
    }
    if (state.mode === "mixed") {
      return Math.random() > 0.5 ? "country" : "capital";
    }
    return state.mode === "country-to-capital" ? "country" : "capital";
  }

  function renderCard() {
    var isCountryPrompt = state.promptType === "country";
    var isCapitalPrompt = state.promptType === "capital";
    var isFlagPrompt = state.promptType === "flag";
    var prompt = isCountryPrompt
      ? state.current.country
      : isCapitalPrompt
        ? state.current.capital
        : "Which country uses this flag?";
    var answer = isCountryPrompt ? state.current.capital : state.current.country;
    elements.promptLabel.textContent = isCountryPrompt ? "Country" : isFlagPrompt ? "Flag" : "Capital";
    elements.promptFlag.className = "flag-symbol";
    elements.promptFlag.setAttribute("title", state.current.country + " flag");
    elements.promptFlag.innerHTML = getFlagMarkup(state.current);
    elements.promptText.textContent = prompt;
    elements.promptHelper.textContent = isMapMode()
      ? (isCountryPrompt ? "Find it on the map." : "Tap its country on the map.")
      : isCountryPrompt
        ? "Name the capital."
        : "Name the country.";
    elements.answerFlag.className = "flag-symbol";
    elements.answerFlag.setAttribute("title", state.current.country + " flag");
    elements.answerFlag.innerHTML = getFlagMarkup(state.current);
    elements.answerText.textContent = answer;
    elements.answerHelper.textContent = isCountryPrompt || isFlagPrompt
      ? state.current.country + " -> " + state.current.capital
      : state.current.capital + " -> " + state.current.country;
    elements.funFactText.textContent = state.current.fact || getFallbackFact(state.current);
  }

  function getFlagMarkup(card) {
    if (card.flagUrl) {
      return '<img src="' + escapeHtml(card.flagUrl) + '" alt="' + escapeHtml(card.country) + ' flag" class="flag-img" loading="lazy">';
    }
    return escapeHtml(card.flagEmoji || "");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getFallbackFact(card) {
    return card.capital + " is the capital of " + card.country + ", one of the UN member states in " + card.continent + ".";
  }

  function renderMap() {
    if (!elements.countryMap) {
      return;
    }

    var mapCards = getGeographicCards();
    var activeDeckCards = state.deck.length || isFiniteRound() ? state.deck : getFilteredCards();
    var deckIds = activeDeckCards.reduce(function (lookup, card) {
      lookup[card.id] = true;
      return lookup;
    }, {});
    elements.countryMap.innerHTML = "";
    state.mapRegion = getMapRegion();
    elements.countryMap.setAttribute("viewBox", mapViewBoxes[state.mapRegion] || mapViewBoxes["Whole World"]);
    elements.mapTitle.textContent = state.mapRegion === "Whole World" ? "World map" : state.mapRegion + " map";
    elements.mapDetail.textContent = getMapDetail();

    // Countries first, then the dots for tiny ones, so no dot is hidden under a big neighbour.
    mapCards.forEach(function (card) {
      if (mapPathById[card.id]) {
        renderMapPath(card, getMapStatus(card), Boolean(deckIds[card.id]));
      }
    });
    mapCards.forEach(function (card) {
      if (!mapPathById[card.id]) {
        renderMapMarker(card, getMapStatus(card), Boolean(deckIds[card.id]));
      }
    });

    renderCurrentMapPulse();
    if (isMapMode()) {
      addTapTargetsForTinyCountries();
    }
  }

  // In "Tap the map" the map zooms to the card's continent (or right into the Caribbean
  // for its tiny islands) so every country is big enough to tap.
  function getMapRegion() {
    if (isMapMode() && state.current) {
      if (caribbeanIslandIds.indexOf(state.current.id) !== -1) {
        return "Caribbean";
      }
      if (state.continent === "Whole World") {
        return state.current.continent;
      }
    }
    return state.continent;
  }

  function getMapPixelsPerUnit() {
    var viewBox = (mapViewBoxes[state.mapRegion] || mapViewBoxes["Whole World"]).split(" ").map(Number);
    var box = elements.countryMap.getBoundingClientRect();
    return box.width && box.height ? Math.min(box.width / viewBox[2], box.height / viewBox[3]) : 0;
  }

  function addTapTargetsForTinyCountries() {
    var scale = getMapPixelsPerUnit();
    if (!scale) {
      return;
    }
    Array.prototype.forEach.call(elements.countryMap.querySelectorAll("path.map-country"), function (path) {
      var box = path.getBBox();
      var island = dateLineIslands[path.getAttribute("data-id")];
      var center = island
        ? projectCoordinate(island.lon, island.lat, true)
        : { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      // Anything smaller than about 24px across gets a dot, so neighbouring dots can't hide it.
      if (!island && (box.width * scale >= mapTapTargetPx * 3 || box.height * scale >= mapTapTargetPx * 3)) {
        return;
      }
      var dot = document.createElementNS(svgNamespace, "circle");
      dot.setAttribute("cx", center.x.toFixed(2));
      dot.setAttribute("cy", center.y.toFixed(2));
      dot.setAttribute("r", (mapTapTargetPx / scale).toFixed(2));
      dot.setAttribute("class", path.getAttribute("class").replace("map-country", "map-marker map-hit"));
      dot.setAttribute("data-id", path.getAttribute("data-id"));
      elements.countryMap.appendChild(dot);
    });
  }

  function getGeographicCards() {
    if (state.continent === "Whole World") {
      return cards;
    }
    return cards.filter(function (card) {
      return card.continent === state.continent;
    });
  }

  function getMapDetail() {
    if (!state.deck.length) {
      return "No countries match those filters.";
    }
    if (!state.current) {
      return "Countries light up as you answer.";
    }
    if (state.roundEnded) {
      return "Round complete. Green countries were correct; red ones need review.";
    }
    if (!state.hasAnswered && isMapMode()) {
      return "The map is under your card. Tap the right country!";
    }
    if (!state.hasAnswered) {
      return "Asked now: " + state.current.country + " turns grey and gets a label.";
    }
    var status = state.mapStatusById[state.current.id] === "correct" ? "green" : "red";
    return state.current.country + " is now " + status + ".";
  }

  function getMapStatus(card) {
    if (state.current && !state.roundEnded && !state.hasAnswered && state.current.id === card.id && !isMapMode()) {
      return "current";
    }
    return state.mapStatusById[card.id] || "idle";
  }

  function renderMapPath(card, status, isInDeck) {
    var path = document.createElementNS(svgNamespace, "path");
    path.setAttribute("d", mapPathById[card.id]);
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("class", getMapClassName("map-country", status, isInDeck) + getTappedClass(card));
    path.setAttribute("data-id", card.id);
    path.setAttribute("aria-label", getMapAriaLabel(card, status));
    path.appendChild(getMapTitle(card, status));
    elements.countryMap.appendChild(path);
  }

  function renderMapMarker(card, status, isInDeck) {
    var point = getMapPoint(card);
    if (!point) {
      return;
    }
    var marker = document.createElementNS(svgNamespace, "circle");
    marker.setAttribute("cx", point.x.toFixed(2));
    marker.setAttribute("cy", point.y.toFixed(2));
    marker.setAttribute("r", getMarkerRadius(card));
    marker.setAttribute("class", getMapClassName("map-marker", status, isInDeck) + getTappedClass(card));
    marker.setAttribute("data-id", card.id);
    marker.setAttribute("aria-label", getMapAriaLabel(card, status));
    marker.appendChild(getMapTitle(card, status));
    elements.countryMap.appendChild(marker);
  }

  function renderCurrentMapPulse() {
    if (!state.current || state.hasAnswered || isMapMode()) {
      return;
    }
    var point = getMapPoint(state.current);
    if (!point) {
      return;
    }
    var pulse = document.createElementNS(svgNamespace, "circle");
    pulse.setAttribute("cx", point.x.toFixed(2));
    pulse.setAttribute("cy", point.y.toFixed(2));
    pulse.setAttribute("r", "10");
    pulse.setAttribute("class", "map-pulse");
    elements.countryMap.appendChild(pulse);
    renderCurrentMapLabel(point);
  }

  function getTappedClass(card) {
    return isMapMode() && state.hasAnswered && state.mapTappedId === card.id && state.mapTappedId !== state.current.id
      ? " map-tapped"
      : "";
  }

  function renderCurrentMapLabel(point) {
    var label = document.createElementNS(svgNamespace, "text");
    var useLeftSide = point.x > 820;
    var x = useLeftSide ? point.x - 12 : point.x + 12;
    var y = point.y < 42 ? point.y + 22 : point.y - 12;
    label.textContent = state.current.country;
    label.setAttribute("x", clamp(x, 20, 980).toFixed(2));
    label.setAttribute("y", clamp(y, 24, 480).toFixed(2));
    label.setAttribute("text-anchor", useLeftSide ? "end" : "start");
    label.setAttribute("class", "map-label");
    elements.countryMap.appendChild(label);
  }

  function getMapTitle(card, status) {
    var title = document.createElementNS(svgNamespace, "title");
    title.textContent = getMapAriaLabel(card, status);
    return title;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function renderMapCollapseState() {
    elements.mapPanel.classList.toggle("is-collapsed", state.mapCollapsed);
    elements.mapToggleButton.textContent = state.mapCollapsed ? "Show map" : "Hide map";
    elements.mapToggleButton.setAttribute("aria-expanded", String(!state.mapCollapsed));
  }

  function getMapClassName(baseClass, status, isInDeck) {
    return [
      baseClass,
      "map-status-" + status,
      isInDeck ? "in-deck" : "not-in-deck",
    ].join(" ");
  }

  function getMapAriaLabel(card, status) {
    var label = status === "idle" ? "not answered yet" : status;
    return card.country + " map status: " + label;
  }

  function getMapPoint(card) {
    var marker = smallCountryMarkers[card.id];
    if (marker) {
      return projectCoordinate(marker.lon, marker.lat, marker.wrapPacific);
    }
    return mapCenterById[card.id] || null;
  }

  function getMarkerRadius(card) {
    if (isMapMode()) {
      // Dots stay about the same size on screen at every zoom level, so they are easy to tap.
      var scale = getMapPixelsPerUnit();
      return scale ? (mapTapTargetPx / scale).toFixed(2) : "4.6";
    }
    if (state.current && state.current.id === card.id) {
      return "5.6";
    }
    return state.continent === "Whole World" ? "4.4" : "3.2";
  }

  function geometryToPath(geometry) {
    if (!geometry) {
      return "";
    }
    if (geometry.type === "Polygon") {
      return polygonToPath(geometry.coordinates);
    }
    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates.map(polygonToPath).join(" ");
    }
    return "";
  }

  function polygonToPath(polygon) {
    return polygon.map(ringToPath).join(" ");
  }

  function ringToPath(ring) {
    return ring.map(function (coordinate, index) {
      var point = projectCoordinate(coordinate[0], coordinate[1], false);
      return (index === 0 ? "M" : "L") + point.x.toFixed(2) + " " + point.y.toFixed(2);
    }).join(" ") + "Z";
  }

  function getFeatureCenter(geometry) {
    var bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    visitCoordinates(geometry && geometry.coordinates, function (coordinate) {
      var point = projectCoordinate(coordinate[0], coordinate[1], false);
      bounds.minX = Math.min(bounds.minX, point.x);
      bounds.minY = Math.min(bounds.minY, point.y);
      bounds.maxX = Math.max(bounds.maxX, point.x);
      bounds.maxY = Math.max(bounds.maxY, point.y);
    });
    if (!Number.isFinite(bounds.minX)) {
      return null;
    }
    return {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    };
  }

  function visitCoordinates(value, callback) {
    if (!Array.isArray(value)) {
      return;
    }
    if (typeof value[0] === "number" && typeof value[1] === "number") {
      callback(value);
      return;
    }
    value.forEach(function (item) {
      visitCoordinates(item, callback);
    });
  }

  function projectCoordinate(lon, lat, wrapPacific) {
    var projectedLon = lon;
    if (wrapPacific && (state.mapRegion || state.continent) === "Oceania" && projectedLon < 0) {
      projectedLon += 360;
    }
    return {
      x: ((projectedLon + 180) / 360) * 1000,
      y: ((90 - lat) / 180) * 500,
    };
  }

  function renderAnswerControls() {
    var useChoices = state.answerStyle === "choice";
    var useMap = isMapMode();
    elements.typedAnswerForm.hidden = state.answerStyle !== "type";
    elements.choiceAnswer.hidden = !useChoices;
    elements.mapAnswer.hidden = !useMap;
    placeMap(useMap);

    if (useChoices) {
      renderChoices();
    }
    if (useMap && state.current) {
      elements.mapAnswerCopy.textContent = state.promptType === "country"
        ? "Tap " + state.current.country + " on the map."
        : state.promptType === "flag"
          ? "Tap the country that uses this flag."
          : "Tap the country whose capital is " + state.current.capital + ".";
    }
  }

  // Dots for tiny countries can sit close together, so a tap goes to the nearest one.
  function getNearestDot(x, y) {
    var nearest = null;
    var nearestDistance = Infinity;
    Array.prototype.forEach.call(elements.countryMap.querySelectorAll("circle[data-id]"), function (dot) {
      var box = dot.getBoundingClientRect();
      var distance = Math.hypot(box.left + box.width / 2 - x, box.top + box.height / 2 - y);
      if (distance <= box.width / 2 + 6 && distance < nearestDistance) {
        nearest = dot;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  function watchDialogs() {
    var overlays = [elements.shopOverlay, elements.backupOverlay, elements.scrapbookOverlay, elements.roundSummary];
    var sync = function () {
      var open = overlays.some(function (overlay) {
        return !overlay.hidden;
      });
      document.body.classList.toggle("has-dialog", open);
    };
    var observer = new MutationObserver(sync);
    overlays.forEach(function (overlay) {
      observer.observe(overlay, { attributes: true, attributeFilter: ["hidden"] });
    });
    sync();
  }

  function canUseEnterForNext(target) {
    var typing = /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(target.tagName);
    var dialogOpen = document.body.classList.contains("has-dialog");
    return state.hasAnswered && !state.roundEnded && !typing && !dialogOpen;
  }

  function isMapMode() {
    return state.answerStyle === "map";
  }

  // In "Tap the map" mode the map moves under the card so it is big enough to tap.
  function placeMap(useMap) {
    if (useMap && elements.mapShell.parentNode !== elements.mapAnswer) {
      elements.mapAnswer.appendChild(elements.mapShell);
    } else if (!useMap && elements.mapShell.parentNode !== elements.mapPanel) {
      elements.mapPanel.insertBefore(elements.mapShell, elements.mapLegend);
    }
    elements.mapPanel.classList.toggle("is-lent", useMap);
  }

  function handleMapTap(event) {
    if (!isMapMode() || !state.current || state.hasAnswered || state.roundEnded) {
      return;
    }
    var target = event.target.closest("[data-id]");
    if (!target || target.tagName === "circle") {
      target = getNearestDot(event.clientX, event.clientY) || target;
    }
    if (!target) {
      return;
    }
    var tappedId = target.getAttribute("data-id");
    var tapped = cards.find(function (card) {
      return card.id === tappedId;
    });
    state.mapTappedId = tappedId;
    var isCorrect = tappedId === state.current.id;
    resolveAnswer(isCorrect, false);
    if (!isCorrect && tapped) {
      elements.feedbackText.textContent =
        "Oops, that's " + tapped.country + ". " + state.current.country + " is the one in red.";
    }
  }

  function renderChoices() {
    var choices = getChoices();
    elements.choiceAnswer.innerHTML = "";
    choices.forEach(function (choice) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = choice.label;
      button.addEventListener("click", function () {
        if (state.hasAnswered) {
          return;
        }
        resolveAnswer(choice.isCorrect, false, button);
      });
      elements.choiceAnswer.appendChild(button);
    });
  }

  function getChoices() {
    var answerKey = getAnswerKey();
    var correctLabel = state.current[answerKey];
    var pool = shuffle(getFilteredCards().filter(function (card) {
      return card.id !== state.current.id;
    }));

    var distractors = [];
    pool.forEach(function (card) {
      if (distractors.length >= 3) {
        return;
      }
      var label = card[answerKey];
      if (label !== correctLabel && distractors.indexOf(label) === -1) {
        distractors.push(label);
      }
    });

    return shuffle(
      [{ label: correctLabel, isCorrect: true }].concat(
        distractors.map(function (label) {
          return { label: label, isCorrect: false };
        })
      )
    );
  }

  function checkTypedAnswer() {
    var value = elements.typedAnswerInput.value.trim();
    if (!value) {
      elements.feedbackText.textContent = "Type an answer first.";
      elements.typedAnswerInput.focus();
      return;
    }
    resolveAnswer(isExpectedAnswer(value), false);
  }

  function isExpectedAnswer(value) {
    var answerType = getAnswerKey();
    var accepted = [state.current[answerType]].concat(state.current[answerType + "Aliases"] || []);
    return accepted.some(function (answer) {
      return answersMatch(value, answer);
    });
  }

  function answersMatch(left, right) {
    var a = normaliseAnswer(left);
    var b = normaliseAnswer(right);
    return a.text === b.text || a.compact === b.compact;
  }

  function normaliseAnswer(value) {
    var text = String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/\bst[.]?\b/g, "saint")
      .replace(/^the\s+/, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
    return {
      text: text,
      compact: text.replace(/\s+/g, ""),
    };
  }

  function resolveAnswer(isCorrect, wasRevealed, choiceButton) {
    if (!state.current || state.hasAnswered || state.roundEnded) {
      return;
    }

    state.hasAnswered = true;
    state.answered += 1;
    state.mapStatusById[state.current.id] = isCorrect ? "correct" : "wrong";
    state.history.push({
      id: state.current.id,
      country: state.current.country,
      capital: state.current.capital,
      continent: state.current.continent,
      expected: getExpectedAnswer(),
      promptType: state.promptType,
      correct: isCorrect,
      revealed: wasRevealed,
      hintUsed: state.hintShown,
    });
    elements.cardFrame.classList.add("answered");
    elements.typedAnswerInput.disabled = true;
    elements.nextButton.disabled = false;
    elements.nextButton.textContent = isFiniteRound() && state.deckIndex >= state.deck.length ? "See results" : "Next card";
    elements.hintButton.disabled = true;
    elements.showAnswerButton.disabled = true;
    disableChoices();

    if (isCorrect) {
      state.score += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      delete state.mistakeIds[state.current.id];
      state.correctByContinent[state.current.continent] = (state.correctByContinent[state.current.continent] || 0) + 1;
      elements.cardFrame.classList.add("is-correct");
      elements.feedbackText.textContent = getCorrectMessage();
      elements.motivationText.textContent = getStreakMessage();
      markChoice(choiceButton, true);
      playSound("correct");
      recordDiaryCorrect();
      var petBonus = isPetHappy() ? 1 : 0;
      earnHearts(
        (state.hintShown ? heartRewards.correctWithHint : heartRewards.correct) + petBonus,
        petBonus ? "(+1 happy coo)" : ""
      );
      recordJourneyAnswer(state.current);
      if (state.streak > 0 && state.streak % 5 === 0) {
        earnHearts(heartRewards.streakBonus, "streak bonus");
        celebrate();
        buddyReact("streak");
        if (!isEggStage(getPetStage())) {
          petSay(randomItem(petLines.streak));
          bounceClass(elements.petArt, "is-dancing", 1600);
        }
      } else {
        buddyReact("correct");
      }
    } else {
      state.streak = 0;
      state.mistakeIds[state.current.id] = true;
      elements.cardFrame.classList.add("is-wrong");
      elements.feedbackText.textContent = wasRevealed ? "Revealed. Study the pair, then take the next card." : getWrongMessage();
      elements.motivationText.textContent = "Answer: " + getExpectedAnswer() + ". Keep going.";
      markChoice(choiceButton, false);
      markCorrectChoice();
      playSound("wrong");
      buddyReact("wrong");
    }

    updateStats();
    updateActiveSessionMode();
    renderCountryBrowser();
    renderMap();
  }

  function showHint() {
    if (!state.current || state.hasAnswered || state.roundEnded || state.hintShown) {
      return;
    }

    state.hintShown = true;
    elements.hintButton.disabled = true;
    elements.feedbackText.textContent = "Hint: " + getHintText(getExpectedAnswer());
  }

  function getHintText(answer) {
    var answerLabel = getAnswerKey() === "capital" ? "capital" : "country";
    var firstCharacter = String(answer).trim().charAt(0).toUpperCase();
    var letterCount = String(answer)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z]/g, "").length;
    var placeClue = getAnswerKey() === "capital"
      ? "It belongs to a country in " + state.current.continent + "."
      : "It is in " + state.current.continent + ".";

    return "The " + answerLabel + " starts with " + firstCharacter + " and has " + letterCount + " letters. " + placeClue;
  }

  // The perfect-daily bonus pays once per day for each deck, so replaying it can't farm hearts.
  function claimDailyPerfect() {
    var today = getLocalDateKey();
    var key = state.continent + "|" + state.populationTier;
    var claims = state.shop.dailyPerfect;
    if (!claims || claims.date !== today) {
      claims = { date: today, decks: {} };
    }
    if (claims.decks[key]) {
      return false;
    }
    claims.decks[key] = true;
    state.shop.dailyPerfect = claims;
    saveShop();
    return true;
  }

  function isFiniteRound() {
    return state.sessionMode === "challenge" || state.sessionMode === "review";
  }

  function endRound(reason) {
    if (state.roundEnded) {
      return;
    }

    state.roundEnded = true;
    clearTimer();
    elements.typedAnswerInput.disabled = true;
    elements.nextButton.disabled = true;
    elements.nextButton.textContent = "Next card";
    elements.hintButton.disabled = true;
    elements.showAnswerButton.disabled = true;
    disableChoices();

    if (state.sessionMode === "challenge" && state.deck.length && state.score === state.deck.length) {
      state.perfectChallengeEarned = true;
      if (claimDailyPerfect()) {
        earnHearts(heartRewards.perfectDaily, "perfect daily");
      }
      celebrate();
    } else if (reason !== "time" && state.history.length) {
      earnHearts(heartRewards.roundComplete, "round complete");
    }

    elements.feedbackText.textContent = reason === "time"
      ? "Time is up. Your round summary is ready."
      : "Round complete. Your summary is ready.";
    updateStats();
    updateActiveSessionMode();
    renderCountryBrowser();
    renderMap();
    openRoundSummary(reason);
  }

  function openRoundSummary(reason) {
    var total = state.history.length;
    var missed = state.history.filter(function (answer) {
      return !answer.correct;
    });
    var hintsUsed = state.history.filter(function (answer) {
      return answer.hintUsed;
    }).length;
    var accuracy = total ? Math.round((state.score / total) * 100) : 0;

    elements.summaryTitle.textContent = reason === "time" ? "Sprint finished" : "Round complete";
    elements.summaryCopy.textContent = getSummaryCopy(total, missed.length, reason);
    elements.summaryStats.innerHTML = [
      getSummaryStatMarkup("Correct", state.score),
      getSummaryStatMarkup("Accuracy", accuracy + "%"),
      getSummaryStatMarkup("Best streak", state.bestStreak),
      getSummaryStatMarkup("Hints", hintsUsed),
    ].join("");

    elements.summaryMissedList.innerHTML = "";
    if (!missed.length) {
      var emptyItem = document.createElement("li");
      emptyItem.className = "summary-empty";
      emptyItem.textContent = total ? "No misses this round." : "No answered cards yet. Start another round when you are ready.";
      elements.summaryMissedList.appendChild(emptyItem);
    } else {
      missed.forEach(function (answer) {
        var item = document.createElement("li");
        item.innerHTML =
          "<strong>" + escapeHtml(answer.country) + "</strong>" +
          "<span>" + escapeHtml(answer.country) + " -> " + escapeHtml(answer.capital) + "</span>";
        elements.summaryMissedList.appendChild(item);
      });
    }

    elements.summaryReviewButton.hidden = getMistakeCount() === 0;
    elements.roundSummary.hidden = false;
    elements.summaryNewRoundButton.focus();
  }

  function getSummaryCopy(total, missedCount, reason) {
    if (!total) {
      return reason === "time"
        ? "The clock beat you to the first answer. Fresh sprint, fresh map."
        : "This deck is ready whenever you are.";
    }
    if (!missedCount) {
      return "Clean round. That is the kind of recall that sticks.";
    }
    if (state.score >= missedCount) {
      return "Good run. The misses are saved into review mode for a quick cleanup.";
    }
    return "Plenty to practice, and now you know exactly where to aim next.";
  }

  function getSummaryStatMarkup(label, value) {
    return '<div><span class="summary-stat-value">' + escapeHtml(value) + '</span><span class="summary-stat-label">' + escapeHtml(label) + "</span></div>";
  }

  function closeRoundSummary() {
    elements.roundSummary.hidden = true;
  }

  function clearTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    clearTimer();
    state.timerId = window.setInterval(function () {
      if (state.roundEnded) {
        clearTimer();
        return;
      }

      state.timerRemaining = Math.max(0, state.timerRemaining - 1);
      renderTimer();
      if (state.timerRemaining <= 0) {
        endRound("time");
      }
    }, 1000);
  }

  function renderTimer() {
    var hasTimer = (timerOptions[state.timerMode] || 0) > 0;
    elements.timerPill.hidden = !hasTimer;
    if (!hasTimer) {
      return;
    }
    elements.timerValue.textContent = formatTime(state.timerRemaining);
    elements.timerPill.classList.toggle("is-urgent", state.timerRemaining <= 10);
  }

  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainder = seconds % 60;
    return minutes + ":" + String(remainder).padStart(2, "0");
  }

  function renderCountryBrowser() {
    var query = normaliseAnswer(elements.countrySearchInput.value || "").text;
    var filteredCards = getFilteredCards();
    var browserCards = filteredCards.filter(function (card) {
      if (!query) {
        return true;
      }
      return normaliseAnswer([
        card.country,
        card.capital,
        card.continent,
        getPopulationLabel(card),
      ].join(" ")).text.indexOf(query) !== -1;
    }).sort(function (left, right) {
      return left.country.localeCompare(right.country);
    });

    elements.countryListCount.textContent = browserCards.length + " of " + filteredCards.length + " shown";
    elements.countryList.innerHTML = "";

    if (!browserCards.length) {
      var empty = document.createElement("div");
      empty.className = "country-list-empty";
      empty.textContent = "No countries match that search.";
      elements.countryList.appendChild(empty);
      return;
    }

    browserCards.forEach(function (card) {
      var item = document.createElement("article");
      var status = state.mapStatusById[card.id] || "idle";
      item.className = "country-item country-status-" + status;

      var flag = document.createElement("span");
      flag.className = "country-item-flag";
      flag.innerHTML = getFlagMarkup(card);

      var body = document.createElement("div");
      body.className = "country-item-body";
      body.innerHTML =
        "<h3>" + escapeHtml(card.country) + "</h3>" +
        '<p class="country-item-meta">' + escapeHtml(card.capital) + " - " + escapeHtml(card.continent) + " - " + escapeHtml(getPopulationLabel(card)) + "</p>" +
        "<p>" + escapeHtml(card.fact || getFallbackFact(card)) + "</p>";

      if (state.mistakeIds[card.id]) {
        var reviewBadge = document.createElement("span");
        reviewBadge.className = "country-review-badge";
        reviewBadge.textContent = "Review";
        body.appendChild(reviewBadge);
      }

      item.appendChild(flag);
      item.appendChild(body);
      elements.countryList.appendChild(item);
    });
  }

  function getPopulationLabel(card) {
    var filter = populationFilters.find(function (item) {
      return item.value === card.populationTier;
    });
    return filter ? filter.label : "All";
  }

  function renderBadges() {
    var badges = getEarnedBadges();
    elements.badgeRack.innerHTML = "";
    if (!badges.length) {
      var empty = document.createElement("span");
      empty.className = "badge-empty";
      empty.textContent = "Badges unlock as you answer.";
      elements.badgeRack.appendChild(empty);
      return;
    }

    badges.forEach(function (badge) {
      var token = document.createElement("span");
      token.className = "badge-token";
      token.textContent = badge;
      elements.badgeRack.appendChild(token);
    });
  }

  function getEarnedBadges() {
    var badges = [];
    var totalCorrect = Object.keys(state.correctByContinent).reduce(function (sum, continent) {
      return sum + state.correctByContinent[continent];
    }, 0);

    if (totalCorrect >= 1) {
      badges.push("First correct");
    }
    if (state.bestStreak >= 5) {
      badges.push("Five-card streak");
    }
    if (state.bestStreak >= 10) {
      badges.push("Ten-card streak");
    }
    if (state.perfectChallengeEarned) {
      badges.push("Perfect daily");
    }
    if (continents.slice(1).every(function (continent) {
      return (state.correctByContinent[continent] || 0) > 0;
    })) {
      badges.push("World sampler");
    }

    continents.slice(1).forEach(function (continent) {
      if ((state.correctByContinent[continent] || 0) >= 5) {
        badges.push(continent + " ace");
      }
    });

    return badges;
  }

  function disableChoices() {
    Array.prototype.forEach.call(elements.choiceAnswer.querySelectorAll("button"), function (button) {
      button.disabled = true;
    });
  }

  function markChoice(button, isCorrect) {
    if (!button) {
      return;
    }
    button.classList.add(isCorrect ? "correct-choice" : "wrong-choice");
  }

  function markCorrectChoice() {
    var expected = getExpectedAnswer();
    Array.prototype.forEach.call(elements.choiceAnswer.querySelectorAll("button"), function (button) {
      if (button.textContent === expected) {
        button.classList.add("correct-choice");
      }
    });
  }

  function getExpectedAnswer() {
    return state.current[getAnswerKey()];
  }

  function getAnswerKey() {
    if (isMapMode()) {
      return "country";
    }
    return state.promptType === "country" ? "capital" : "country";
  }

  function getCorrectMessage() {
    return randomItem(encouragement.correct) + " " + state.current.country + " pairs with " + state.current.capital + ".";
  }

  function getWrongMessage() {
    return randomItem(encouragement.wrong) + " Correct answer: " + getExpectedAnswer() + ".";
  }

  function getStreakMessage() {
    if (state.streak >= 15) {
      return encouragement.streak[3];
    }
    if (state.streak >= 10) {
      return encouragement.streak[2];
    }
    if (state.streak >= 5) {
      return encouragement.streak[1];
    }
    if (state.streak >= 3) {
      return encouragement.streak[0];
    }
    return randomItem(encouragement.correct);
  }

  function updateStats() {
    var deckSize = state.deck.length || getAvailableRoundCardCount();
    var progress = deckSize ? Math.min(100, (state.answered / deckSize) * 100) : 0;
    elements.scoreValue.textContent = String(state.score);
    elements.streakValue.textContent = String(state.streak);
    elements.bestStreakValue.textContent = String(state.bestStreak);
    elements.deckCount.textContent = getDeckCountLabel(deckSize);
    elements.answeredCount.textContent = isFiniteRound()
      ? state.answered + " of " + deckSize + " answered"
      : state.answered + " answered";
    elements.progressFill.style.width = progress + "%";
    elements.levelBadge.textContent = getLevelName(state.score, state.streak);
    renderTimer();
    renderBadges();
  }

  function getDeckCountLabel(deckSize) {
    if (state.sessionMode === "challenge") {
      return deckSize + "-card daily challenge";
    }
    if (state.sessionMode === "review") {
      return deckSize + (deckSize === 1 ? " review card" : " review cards");
    }
    return deckSize + (deckSize === 1 ? " card" : " cards");
  }

  function getLevelName(score, streak) {
    if (streak >= 15 || score >= 40) {
      return "World Navigator";
    }
    if (streak >= 10 || score >= 25) {
      return "Capital Sprinter";
    }
    if (streak >= 5 || score >= 12) {
      return "Map Builder";
    }
    if (score >= 4) {
      return "Route Finder";
    }
    return "Map Starter";
  }

  function celebrate(effectId) {
    var colors = ["#0f766e", "#14b8a6", "#f97316", "#facc15", "#2563eb", "#ec4899"];
    var effect = getShopItem(effectId || state.shop.equipped.effect);
    var emojiPieces = effect && effect.pieces;
    playSound("fanfare");
    elements.celebrationLayer.innerHTML = "";
    for (var i = 0; i < 26; i += 1) {
      var piece = document.createElement("span");
      piece.style.left = 8 + Math.random() * 84 + "%";
      piece.style.animationDelay = Math.random() * 0.25 + "s";
      if (emojiPieces) {
        piece.className = "emoji-piece";
        piece.textContent = emojiPieces[i % emojiPieces.length];
        piece.style.fontSize = 1.3 + Math.random() * 1.2 + "rem";
      } else {
        piece.className = "confetti-piece";
        piece.style.background = colors[i % colors.length];
        piece.style.transform = "rotate(" + Math.random() * 180 + "deg)";
      }
      elements.celebrationLayer.appendChild(piece);
    }

    window.clearTimeout(celebrate.timeoutId);
    celebrate.timeoutId = window.setTimeout(function () {
      elements.celebrationLayer.innerHTML = "";
    }, emojiPieces ? 1900 : 1300);
  }

  function seededShuffle(items, seed) {
    var result = items.slice().sort(function (left, right) {
      return left.country.localeCompare(right.country);
    });
    var random = seededRandom(seed);
    for (var i = result.length - 1; i > 0; i -= 1) {
      var j = Math.floor(random() * (i + 1));
      var temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  }

  function seededRandom(seed) {
    var value = seed % 2147483647;
    if (value <= 0) {
      value += 2147483646;
    }
    return function () {
      value = (value * 16807) % 2147483647;
      return (value - 1) / 2147483646;
    };
  }

  function getDailySeed() {
    return hashString(getLocalDateKey() + "|" + state.continent + "|" + state.populationTier);
  }

  function getLocalDateKey() {
    var date = new Date();
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function hashString(text) {
    var hash = 0;
    for (var i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) || 1;
  }

  function getMistakeCount() {
    return Object.keys(state.mistakeIds).length;
  }

  function shuffle(items) {
    var result = items.slice();
    for (var i = result.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function loadShop() {
    var saved = null;
    try {
      saved = JSON.parse(window.localStorage.getItem(shopStorageKey));
    } catch (error) {
      saved = null;
    }

    var shop = {
      hearts: 0,
      owned: {},
      equipped: Object.assign({}, defaultEquipped),
      pet: {
        name: "",
        bornOn: getLocalDateKey(),
        happiness: 80,
        happinessAt: Date.now(),
        lastStage: "egg",
      },
      journey: { weekKey: "", count: 0, claimed: {} },
      settings: { muted: false },
      diary: {},
      backupAt: 0,
      backupReminderOn: "",
    };
    if (saved && typeof saved === "object") {
      shop.hearts = Math.max(0, Number(saved.hearts) || 0);
      shop.owned = saved.owned && typeof saved.owned === "object" ? saved.owned : {};
      Object.keys(defaultEquipped).forEach(function (category) {
        var itemId = saved.equipped && saved.equipped[category];
        if (itemId === "" || (itemId && getShopItem(itemId))) {
          shop.equipped[category] = itemId;
        }
      });
      if (!saved.pet && shop.equipped.buddy === "buddy-none") {
        // First visit since the cow arrived: let her sit on the card straight away.
        shop.equipped.buddy = "buddy-cow";
      }
      if (saved.pet && typeof saved.pet === "object") {
        Object.assign(shop.pet, saved.pet);
        if (!saved.pet.nameChosen && shop.pet.name === "Hamish") {
          // "Hamish" was only a placeholder in an earlier version, so let her choose the real name.
          shop.pet.name = "";
        }
      }
      if (saved.journey && typeof saved.journey === "object") {
        Object.assign(shop.journey, saved.journey);
      }
      if (saved.settings && typeof saved.settings === "object") {
        Object.assign(shop.settings, saved.settings);
      }
      if (saved.diary && typeof saved.diary === "object") {
        shop.diary = saved.diary;
      }
      shop.backupAt = Number(saved.backupAt) || 0;
      if (saved.dailyPerfect && typeof saved.dailyPerfect === "object") {
        shop.dailyPerfect = saved.dailyPerfect;
      }
      shop.backupReminderOn = String(saved.backupReminderOn || "");
    }
    return shop;
  }

  function saveShop() {
    try {
      window.localStorage.setItem(shopStorageKey, JSON.stringify(state.shop));
    } catch (error) {
      // Storage can be blocked (private browsing). The shop still works for this visit.
    }
  }

  function getShopItem(itemId) {
    return shopItems.find(function (item) {
      return item.id === itemId;
    });
  }

  function isOwned(item) {
    return item.price === 0 || Boolean(state.shop.owned[item.id]);
  }

  function getEquipSlot(item) {
    return item.slot ? "cow-" + item.slot : item.category;
  }

  function earnHearts(amount, reason) {
    if (!amount) {
      return;
    }
    state.shop.hearts += amount;
    saveShop();
    renderHearts();
    showHeartPop(amount, reason);
  }

  function renderHearts() {
    elements.heartCount.textContent = String(state.shop.hearts);
    elements.shopHeartCount.textContent = String(state.shop.hearts);
    updateSnackButtons();
  }

  function showHeartPop(amount, reason) {
    var pop = document.createElement("span");
    pop.className = "heart-pop";
    pop.textContent = "+" + amount + " 💖" + (reason ? " " + reason : "");
    var rect = elements.heartWallet.getBoundingClientRect();
    var left = rect.left + rect.width / 2;
    var top = rect.bottom + 4;
    if (!isOnScreen(rect)) {
      // The counter is scrolled out of view, so pop the hearts over the card instead.
      var cardRect = elements.cardFrame.getBoundingClientRect();
      left = cardRect.left + cardRect.width / 2;
      top = isOnScreen(cardRect) ? Math.max(12, cardRect.top + 56) : 60;
    }
    pop.style.left = left + "px";
    pop.style.top = top + "px";
    elements.heartPopLayer.appendChild(pop);

    elements.heartWallet.classList.remove("is-bumping");
    void elements.heartWallet.offsetWidth;
    elements.heartWallet.classList.add("is-bumping");

    window.setTimeout(function () {
      pop.remove();
    }, 1400);
  }

  function isOnScreen(rect) {
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function applyEquippedItems() {
    var theme = state.shop.equipped.theme.replace("theme-", "");
    document.body.dataset.theme = theme;

    renderCardBuddy();
    elements.cardBuddyBubble.textContent = "";
    elements.cardBuddy.classList.remove("is-talking");
  }

  function renderCardBuddy(moodOverride) {
    var buddy = getShopItem(state.shop.equipped.buddy);
    var hasBuddy = buddy && buddy.id !== "buddy-none";
    var isCow = hasBuddy && buddy.id === "buddy-cow";
    elements.cardBuddy.hidden = !hasBuddy;
    elements.cardBuddy.classList.toggle("is-cow", Boolean(isCow));
    if (isCow) {
      elements.cardBuddyFace.innerHTML = getCowMarkup(null, isEggStage(getPetStage()) ? null : moodOverride);
    } else {
      elements.cardBuddyFace.textContent = hasBuddy ? buddy.icon : "";
    }
  }

  function buddyReact(mood) {
    if (elements.cardBuddy.hidden) {
      return;
    }
    var lines = state.shop.equipped.buddy === "buddy-cow" && petLines[mood] ? petLines[mood] : buddyLines[mood];
    elements.cardBuddyBubble.textContent = randomItem(lines);
    // A surprised face for rare countries, back to normal for everything else.
    renderCardBuddy(mood === "tricky" ? "surprised" : null);
    elements.cardBuddy.classList.remove("is-happy", "is-sad", "is-talking");
    void elements.cardBuddy.offsetWidth;
    elements.cardBuddy.classList.add(mood === "wrong" ? "is-sad" : "is-happy", "is-talking");

    window.clearTimeout(buddyReact.timeoutId);
    buddyReact.timeoutId = window.setTimeout(function () {
      elements.cardBuddy.classList.remove("is-talking");
    }, 1800);
  }

  function openShop() {
    renderShop();
    elements.shopOverlay.hidden = false;
    elements.shopCloseButton.focus();
  }

  function closeShop() {
    elements.shopOverlay.hidden = true;
    elements.shopButton.focus();
  }

  function renderShop() {
    renderHearts();

    elements.shopTabs.innerHTML = "";
    shopCategories.forEach(function (category) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "chip";
      tab.setAttribute("role", "tab");
      tab.textContent = category.label;
      tab.setAttribute("aria-pressed", String(category.id === state.shopCategory));
      tab.setAttribute("aria-selected", String(category.id === state.shopCategory));
      tab.addEventListener("click", function () {
        state.shopCategory = category.id;
        renderShop();
      });
      elements.shopTabs.appendChild(tab);
    });

    var activeCategory = shopCategories.find(function (category) {
      return category.id === state.shopCategory;
    });
    elements.shopCategoryCopy.textContent = activeCategory ? activeCategory.copy : "";

    elements.shopGrid.innerHTML = "";
    shopItems
      .filter(function (item) {
        return item.category === state.shopCategory;
      })
      .forEach(function (item) {
        elements.shopGrid.appendChild(getShopItemCard(item));
      });
  }

  function getShopItemCard(item) {
    var owned = isOwned(item);
    var equipped = state.shop.equipped[getEquipSlot(item)] === item.id;
    var card = document.createElement("article");
    card.className = "shop-item" + (equipped ? " is-equipped" : "") + (owned ? " is-owned" : "");

    var preview = document.createElement("div");
    preview.className = "shop-item-preview";
    if (item.swatch) {
      preview.style.background =
        "linear-gradient(135deg, " + item.swatch[2] + " 0 40%, " + item.swatch[1] + " 40% 70%, " + item.swatch[0] + " 70% 100%)";
    }
    var icon = document.createElement("span");
    icon.className = "shop-item-icon";
    if (item.category === "cow" || item.id === "buddy-cow") {
      icon.classList.add("is-cow");
      icon.innerHTML = getCowMarkup(item.slot ? item : null);
    } else if (item.category === "home") {
      preview.classList.add("is-scene");
      icon.classList.add("is-cow");
      preview.innerHTML = window.CowArt.scene(item.id);
      icon.innerHTML = window.CowArt.render({ stage: "adult", mood: "happy" });
    } else if (item.category === "friend" && item.id !== "friend-none") {
      icon.classList.add("is-cow");
      icon.innerHTML = window.CowArt.friend(item.id);
    } else {
      icon.textContent = item.icon;
    }
    preview.appendChild(icon);
    card.appendChild(preview);

    var name = document.createElement("h3");
    name.textContent = item.name;
    card.appendChild(name);

    var price = document.createElement("span");
    price.className = "shop-item-price";
    if (item.exclusive) {
      price.textContent = owned ? "Owned · Trip reward" : "🥇 Gold reward";
    } else {
      price.textContent = owned ? (item.price === 0 ? "Free" : "Owned") : item.price + " 💖";
    }
    card.appendChild(price);

    var button = document.createElement("button");
    button.type = "button";
    if (equipped && item.slot) {
      button.className = "shop-action is-equipped";
      button.textContent = "Wearing ✓ · Take off";
      button.addEventListener("click", function () {
        equipItem(item);
      });
    } else if (equipped) {
      button.className = "shop-action is-equipped";
      button.textContent = "Equipped ✓";
      button.disabled = true;
    } else if (!owned && item.exclusive) {
      button.className = "shop-action";
      button.textContent = "Win it in " + item.exclusive + " week";
      button.disabled = true;
    } else if (item.grownOnly && !isPetGrown()) {
      button.className = "shop-action";
      button.textContent = "Unlocks on day " + petGrowDays;
      button.disabled = true;
    } else if (owned) {
      button.className = "shop-action";
      button.textContent = item.slot ? "Wear it" : "Use this";
      button.addEventListener("click", function () {
        equipItem(item);
      });
    } else if (state.shop.hearts >= item.price) {
      button.className = "shop-action is-buy";
      button.textContent = "Buy";
      button.addEventListener("click", function () {
        buyItem(item);
      });
    } else {
      button.className = "shop-action";
      button.textContent = "Need " + (item.price - state.shop.hearts) + " more";
      button.disabled = true;
    }
    card.appendChild(button);

    if (item.category === "effect") {
      var previewButton = document.createElement("button");
      previewButton.type = "button";
      previewButton.className = "shop-preview-link";
      previewButton.textContent = "Preview";
      previewButton.addEventListener("click", function () {
        celebrate(item.id);
      });
      card.appendChild(previewButton);
    }

    return card;
  }

  function buyItem(item) {
    if (item.exclusive || (item.grownOnly && !isPetGrown()) || isOwned(item) || state.shop.hearts < item.price) {
      return;
    }
    state.shop.hearts -= item.price;
    state.shop.owned[item.id] = true;
    playSound("sparkle");
    equipItem(item);
    celebrate(item.category === "effect" ? item.id : null);
  }

  function equipItem(item) {
    if (!isOwned(item) || (item.grownOnly && !isPetGrown())) {
      return;
    }
    var slot = getEquipSlot(item);
    if (item.slot && state.shop.equipped[slot] === item.id) {
      state.shop.equipped[slot] = "";
    } else {
      state.shop.equipped[slot] = item.id;
    }
    saveShop();
    applyEquippedItems();
    renderPet();
    renderShop();
    if (item.category === "buddy" || item.category === "cow") {
      buddyReact("correct");
    }
  }

  function getPetAgeDays() {
    var born = parseDateKey(state.shop.pet.bornOn);
    var today = parseDateKey(getLocalDateKey());
    return Math.max(0, Math.round((today - born) / 86400000));
  }

  function parseDateKey(key) {
    var parts = String(key).split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return new Date(new Date().setHours(0, 0, 0, 0));
    }
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function getPetStage() {
    var age = getPetAgeDays();
    var current = petStages[0];
    petStages.forEach(function (stage) {
      if (age >= stage.fromDay) {
        current = stage;
      }
    });
    return current;
  }

  function isEggStage(stage) {
    return stage.id.indexOf("egg") === 0;
  }

  function getPetHappiness() {
    if (isEggStage(getPetStage())) {
      return 100;
    }
    var hours = Math.max(0, (Date.now() - Number(state.shop.pet.happinessAt || Date.now())) / 3600000);
    var value = Number(state.shop.pet.happiness) - hours * happinessLossPerHour;
    return Math.round(Math.min(100, Math.max(0, value)));
  }

  function getPetMood() {
    var happiness = getPetHappiness();
    var name = getPetName();
    if (happiness >= happyBonusThreshold) {
      return { id: "happy", text: "Over the moo-n 💕 Bonus +1 heart for every correct answer!" };
    }
    if (happiness >= 40) {
      return { id: "content", text: "Content and cosy. A snack would make " + name + " extra happy." };
    }
    if (happiness >= 15) {
      return { id: "sad", text: capitalise(name) + " is a little peckish... maybe a carrot?" };
    }
    return { id: "sleepy", text: name + " is sleepy and hungry. A snack will help!" };
  }

  function isPetHappy() {
    return !isEggStage(getPetStage()) && getPetHappiness() >= happyBonusThreshold;
  }

  function refreshPet(isFirstLoad) {
    var pet = state.shop.pet;
    var stage = getPetStage();
    if (stage.id !== pet.lastStage) {
      growPet(stage, isFirstLoad);
    }
    welcomeFriend();
    celebrateBirthday();
  }

  function growPet(stage, isFirstLoad) {
    var pet = state.shop.pet;

    var wasEgg = pet.lastStage.indexOf("egg") === 0;
    pet.lastStage = stage.id;
    if (wasEgg && !isEggStage(stage)) {
      // Start the happiness clock from the moment the calf hatches.
      pet.happiness = 85;
      pet.happinessAt = Date.now();
      showToast(pet.name
        ? "🐣 Your egg hatched! Say hello to " + pet.name + ", your baby highland coo!"
        : "🐣 Your egg hatched! Your baby highland coo needs a name 💕");
      addDiaryEvent("🐣", "Your egg hatched");
      celebrate("effect-hearts");
    } else if (stage.id === "adult") {
      showToast("🎉 " + capitalise(getPetName()) + " is all grown up! 90 days of love.");
      addDiaryEvent("🎉", capitalise(getPetName()) + " grew all the way up");
      celebrate("effect-hearts");
    } else if (!isFirstLoad || stage.id !== "egg") {
      showToast("🌱 " + capitalise(getPetName()) + " grew into a " + stage.label.toLowerCase() + "!");
      addDiaryEvent("🌱", "Grew into a " + stage.label.toLowerCase());
    }
    saveShop();
    renderCardBuddy();
  }

  function getCowMarkup(previewItem, moodOverride) {
    var equipped = state.shop.equipped;
    var stage = getPetStage();
    var outfit = {
      hat: equipped["cow-hat"],
      face: equipped["cow-face"],
      neck: equipped["cow-neck"],
    };
    if (previewItem) {
      // Shop previews show the grown-up coo wearing just that item.
      outfit = { hat: "", face: "", neck: "" };
      outfit[previewItem.slot] = previewItem.id;
    }
    return window.CowArt.render({
      stage: previewItem ? "adult" : stage.id,
      mood: previewItem ? "happy" : moodOverride || getPetMood().id,
      hat: outfit.hat,
      face: outfit.face,
      neck: outfit.neck,
    });
  }

  function renderPet() {
    var pet = state.shop.pet;
    var stage = getPetStage();
    var age = getPetAgeDays();
    var egg = isEggStage(stage);
    var happiness = getPetHappiness();
    var mood = getPetMood();

    elements.petName.textContent = pet.name || "Your coo";
    if (!pet.name && elements.petNameForm.hidden) {
      openNameForm();
    }
    elements.petStageLabel.textContent = stage.label + " · Day " + Math.min(age + 1, petGrowDays) + " of " + petGrowDays +
      (isBirthdayToday() ? " · 🎂 Birthday!" : "");
    elements.petGrowthFill.style.width = Math.min(100, (age / petGrowDays) * 100) + "%";
    elements.petGrowthNote.textContent = age >= petGrowDays
      ? "All grown up! 🎉"
      : (petGrowDays - age) + (petGrowDays - age === 1 ? " day" : " days") + " to go";

    elements.petArt.innerHTML = getCowMarkup();
    elements.petArt.dataset.mood = egg ? "egg" : mood.id;
    renderPetHome();

    elements.petHappinessValue.textContent = egg ? "Snug" : happiness + "%";
    elements.petHappinessFill.style.width = happiness + "%";
    elements.petHappinessFill.parentElement.dataset.level = egg ? "happy" : mood.id;
    elements.petMood.textContent = egg
      ? (stage.id === "egg"
        ? "Keep answering while your egg stays warm. It hatches on day 3!"
        : "Something is wriggling inside... it hatches tomorrow!")
      : mood.text;

    updateSnackButtons();
  }

  function updateSnackButtons() {
    var egg = isEggStage(getPetStage());
    Array.prototype.forEach.call(elements.snackRow.querySelectorAll("button"), function (button) {
      var snack = snacks.find(function (item) {
        return item.id === button.dataset.snack;
      });
      button.disabled = egg || !snack || state.shop.hearts < snack.price;
      button.title = egg
        ? "Snacks unlock when the egg hatches"
        : snack.name + ": +" + snack.happiness + "% happiness for " + snack.price + " hearts";
    });
  }

  function renderSnacks() {
    elements.snackRow.innerHTML = "";
    snacks.forEach(function (snack) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "snack-button";
      button.dataset.snack = snack.id;
      button.innerHTML =
        '<span class="snack-icon" aria-hidden="true">' + snack.icon + "</span>" +
        '<span class="snack-name">' + escapeHtml(snack.name) + "</span>" +
        '<span class="snack-price">' + snack.price + " 💖</span>";
      button.addEventListener("click", function () {
        feedPet(snack, button);
      });
      elements.snackRow.appendChild(button);
    });
  }

  function feedPet(snack, button) {
    if (isEggStage(getPetStage()) || state.shop.hearts < snack.price) {
      return;
    }

    state.shop.hearts -= snack.price;
    state.shop.pet.happiness = Math.min(100, getPetHappiness() + snack.happiness);
    state.shop.pet.happinessAt = Date.now();
    saveShop();
    renderHearts();
    renderPet();
    renderCardBuddy();
    playSound("crunch");
    animateSnack(snack, button);
  }

  function animateSnack(snack, button) {
    var stageRect = elements.petStage.getBoundingClientRect();
    var buttonRect = button.getBoundingClientRect();
    var food = document.createElement("span");
    food.className = "snack-fly";
    food.textContent = snack.icon;
    elements.petStage.appendChild(food);

    var startX = buttonRect.left + buttonRect.width / 2 - stageRect.left;
    var startY = buttonRect.top + buttonRect.height / 2 - stageRect.top;
    var mouthX = stageRect.width / 2;
    var mouthY = stageRect.height * 0.62;
    var peakY = Math.min(startY, mouthY) - 60;
    var move = function (x, y, scale) {
      return "translate(" + (x - 16) + "px, " + (y - 16) + "px) scale(" + scale + ")";
    };

    var flight = food.animate(
      [
        { transform: move(startX, startY, 1), opacity: 1 },
        { transform: move((startX + mouthX) / 2, peakY, 1.3), opacity: 1, offset: 0.5 },
        { transform: move(mouthX, mouthY, 0.4), opacity: 0 },
      ],
      { duration: 700, easing: "ease-in-out", fill: "forwards" }
    );

    flight.onfinish = function () {
      food.remove();
      bounceClass(elements.petArt, snack.party ? "is-dancing" : "is-munching", snack.party ? 1600 : 1000);
      petSay(randomItem(snack.party ? petLines.party : petLines.fed));
      floatPetHearts(snack.party ? 8 : 4);
      playSound("moo");
      if (snack.party) {
        celebrate();
      }
    };
  }

  function floatPetHearts(count) {
    for (var i = 0; i < count; i += 1) {
      var heart = document.createElement("span");
      heart.className = "pet-heart";
      heart.textContent = randomItem(["💕", "💖", "💗"]);
      heart.style.left = 30 + Math.random() * 40 + "%";
      heart.style.animationDelay = i * 0.12 + "s";
      elements.petStage.appendChild(heart);
      window.setTimeout(heart.remove.bind(heart), 1600 + i * 120);
    }
  }

  function petSay(text) {
    elements.petSpeech.textContent = text;
    bounceClass(elements.petSpeech, "is-visible", 1800);
  }

  function bounceClass(element, className, duration) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.clearTimeout(element["_" + className]);
    element["_" + className] = window.setTimeout(function () {
      element.classList.remove(className);
    }, duration);
  }

  function getPetName() {
    return state.shop.pet.name || "your coo";
  }

  function capitalise(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function openNameForm() {
    var hasName = Boolean(state.shop.pet.name);
    elements.petNamePrompt.textContent = hasName
      ? "Give " + state.shop.pet.name + " a new name"
      : "What will you call your coo? 💕";
    elements.petNameInput.value = state.shop.pet.name;
    elements.petNameCancel.hidden = !hasName;
    elements.petNameRow.hidden = true;
    elements.petNameForm.hidden = false;
  }

  function closeNameForm() {
    elements.petNameForm.hidden = true;
    elements.petNameRow.hidden = false;
  }

  function savePetName(event) {
    event.preventDefault();
    var name = elements.petNameInput.value.trim().slice(0, 20);
    if (!name) {
      elements.petNameInput.focus();
      return;
    }
    var isFirstName = !state.shop.pet.name;
    state.shop.pet.name = name;
    state.shop.pet.nameChosen = true;
    if (isFirstName) {
      addDiaryEvent("💕", "Named your coo " + name);
    }
    saveShop();
    closeNameForm();
    renderPet();
    petSay(isFirstName ? "I'm " + name + "! 💕" : "I love it! 💕");
    bounceClass(elements.petArt, "is-hopping", 650);
  }

  function getWeekStart(date) {
    var start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var daysSinceMonday = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - daysSinceMonday);
    return start;
  }

  function getWeekIndex(weekStart) {
    var firstMonday = new Date(2024, 0, 1);
    return Math.round((weekStart - firstMonday) / (7 * 86400000));
  }

  function getJourneyContinent(offset) {
    var index = getWeekIndex(getWeekStart(new Date())) + (offset || 0);
    return journeyOrder[((index % journeyOrder.length) + journeyOrder.length) % journeyOrder.length];
  }

  function getJourneyOutfit(continent) {
    return shopItems.find(function (item) {
      return item.exclusive === continent;
    });
  }

  function refreshJourney() {
    var weekStart = getWeekStart(new Date());
    var weekKey = [
      weekStart.getFullYear(),
      String(weekStart.getMonth() + 1).padStart(2, "0"),
      String(weekStart.getDate()).padStart(2, "0"),
    ].join("-");
    if (state.shop.journey.weekKey !== weekKey) {
      state.shop.journey = { weekKey: weekKey, count: 0, claimed: {} };
      saveShop();
    }
  }

  function recordJourneyAnswer(card) {
    refreshJourney();
    var continent = getJourneyContinent();
    if (!card || card.continent !== continent) {
      return;
    }

    var journey = state.shop.journey;
    journey.count += 1;
    journeyTiers.forEach(function (tier) {
      if (journey.count < tier.target || journey.claimed[tier.id]) {
        return;
      }
      journey.claimed[tier.id] = true;
      earnHearts(tier.hearts, tier.label.toLowerCase() + " medal");
      var message = tier.medal + " " + tier.label + " medal on your " + continent + " trip! +" + tier.hearts + " hearts";
      if (tier.outfit) {
        var outfit = getJourneyOutfit(continent);
        if (outfit) {
          state.shop.owned[outfit.id] = true;
          message += " and a " + outfit.name + " for " + getPetName() + "! Find it in Coo outfits.";
        }
      }
      showToast(message);
      addDiaryEvent(tier.medal, tier.label + " medal on the " + continent + " trip");
      celebrate();
    });
    saveShop();
    renderJourney();
  }

  function renderJourney() {
    var continent = getJourneyContinent();
    var journey = state.shop.journey;
    var goal = journeyTiers[journeyTiers.length - 1].target;
    var outfit = getJourneyOutfit(continent);

    elements.journeyTitle.textContent = continent;
    elements.journeyCopy.textContent =
      "Get " + continent + " answers right this week (any deck that includes " + continent + " counts).";
    elements.journeyFill.style.width = Math.min(100, (journey.count / goal) * 100) + "%";
    elements.journeyCount.textContent = journey.count + " correct so far";

    elements.journeyMarkers.innerHTML = "";
    journeyTiers.forEach(function (tier) {
      var marker = document.createElement("span");
      marker.className = "journey-marker" + (journey.claimed[tier.id] ? " is-claimed" : "");
      marker.style.left = (tier.target / goal) * 100 + "%";
      marker.textContent = tier.medal;
      elements.journeyMarkers.appendChild(marker);
    });

    elements.journeyRewards.innerHTML = "";
    journeyTiers.forEach(function (tier) {
      var item = document.createElement("li");
      item.className = journey.claimed[tier.id] ? "is-claimed" : "";
      var reward = "+" + tier.hearts + " 💖";
      if (tier.outfit && outfit) {
        reward += " + " + outfit.name + " for your coo";
      }
      item.innerHTML =
        "<span>" + tier.medal + " " + tier.target + " correct</span>" +
        "<strong>" + (journey.claimed[tier.id] ? "✓ " : "") + escapeHtml(reward) + "</strong>";
      elements.journeyRewards.appendChild(item);
    });

    elements.journeyPlayButton.textContent = "Play the " + continent + " deck";
    elements.journeyNext.textContent = "New trip on Monday: " + getJourneyContinent(1);
  }

  // Messages wait their turn so a hatch, birthday and medal on the same day are all seen.
  var toastQueue = [];

  function showToast(message) {
    toastQueue.push(message);
    if (toastQueue.length === 1) {
      showNextToast();
    }
  }

  function showNextToast() {
    if (!toastQueue.length) {
      return;
    }
    elements.toast.textContent = toastQueue[0];
    elements.toast.hidden = false;
    bounceClass(elements.toast, "is-visible", 4200);
    window.setTimeout(function () {
      elements.toast.hidden = true;
      toastQueue.shift();
      window.setTimeout(showNextToast, 250);
    }, 4500);
  }

  // ---------- Cow life: homes, friends, birthdays, greetings ----------

  function isPetGrown() {
    return getPetAgeDays() >= petGrowDays;
  }

  function renderPetHome() {
    var home = state.shop.equipped.home || "home-meadow";
    if (elements.petScene.dataset.home !== home) {
      elements.petScene.innerHTML = window.CowArt.scene(home);
      elements.petScene.dataset.home = home;
    }
    var friend = isPetGrown() ? state.shop.equipped.friend : "friend-none";
    var hasFriend = friend && friend !== "friend-none";
    elements.petFriend.hidden = !hasFriend;
    if (hasFriend && elements.petFriend.dataset.friend !== friend) {
      elements.petFriend.innerHTML = window.CowArt.friend(friend);
      elements.petFriend.dataset.friend = friend;
    }
  }

  function welcomeFriend() {
    var pet = state.shop.pet;
    if (!isPetGrown() || pet.friendArrived) {
      return;
    }
    pet.friendArrived = true;
    state.shop.owned["friend-sheep"] = true;
    if (state.shop.equipped.friend === "friend-none") {
      state.shop.equipped.friend = "friend-sheep";
    }
    showToast("🐑 A woolly sheep moved in to keep " + getPetName() + " company! More friends are in the shop.");
    addDiaryEvent("🐑", "A sheep friend moved in");
    saveShop();
  }

  function isBirthdayToday() {
    var age = getPetAgeDays();
    return age >= petGrowDays && (age - petGrowDays) % birthdayEveryDays === 0;
  }

  function celebrateBirthday() {
    var pet = state.shop.pet;
    var today = getLocalDateKey();
    if (!isBirthdayToday() || pet.lastBirthday === today) {
      return;
    }
    pet.lastBirthday = today;
    pet.happiness = 100;
    pet.happinessAt = Date.now();
    var months = Math.round(getPetAgeDays() / 30);
    var gift = "a party hat";
    if (state.shop.owned["cow-party-hat"]) {
      state.shop.hearts += 50;
      gift = "50 bonus hearts";
    } else {
      state.shop.owned["cow-party-hat"] = true;
    }
    showToast("🎂 Happy " + months + "-month birthday, " + getPetName() + "! A free birthday cake 🍰 and " + gift + "!");
    addDiaryEvent("🎂", months + "-month birthday party");
    saveShop();
    renderHearts();
    window.setTimeout(function () {
      celebrate("effect-hearts");
      bounceClass(elements.petArt, "is-dancing", 1600);
    }, 1200);
  }

  function greetVisitor() {
    if (elements.petSpeech.classList.contains("is-visible")) {
      return;
    }
    if (isEggStage(getPetStage())) {
      petSay("*wiggle wiggle*");
      bounceClass(elements.petArt, "is-wobbling", 700);
      return;
    }
    petSay(randomItem(petLines.hello));
    bounceClass(elements.petArt, "is-hopping", 650);
  }

  // ---------- Sounds (made in the browser, no audio files needed) ----------

  var audioContext = null;

  function getAudioContext() {
    if (state.shop.settings.muted) {
      return null;
    }
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      return audioContext;
    } catch (error) {
      return null;
    }
  }

  function playTone(context, options) {
    var start = context.currentTime + (options.delay || 0);
    var oscillator = context.createOscillator();
    var gain = context.createGain();
    oscillator.type = options.type || "sine";
    oscillator.frequency.setValueAtTime(options.from, start);
    if (options.to) {
      oscillator.frequency.exponentialRampToValueAtTime(options.to, start + options.length);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(options.volume || 0.1, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + options.length);
    var output = gain;
    if (options.filter) {
      var filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = options.filter;
      gain.connect(filter);
      output = filter;
    }
    oscillator.connect(gain);
    output.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + options.length + 0.05);
    return oscillator;
  }

  function playNoise(context, delay, length) {
    var buffer = context.createBuffer(1, Math.floor(context.sampleRate * length), context.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    var source = context.createBufferSource();
    var filter = context.createBiquadFilter();
    var gain = context.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    gain.gain.value = 0.25;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(context.currentTime + delay);
  }

  function playSound(name) {
    var context = getAudioContext();
    if (!context) {
      return;
    }
    if (name === "correct") {
      playTone(context, { from: 660, length: 0.14, volume: 0.08 });
      playTone(context, { from: 990, length: 0.22, volume: 0.08, delay: 0.1 });
    } else if (name === "wrong") {
      playTone(context, { from: 320, to: 220, length: 0.25, volume: 0.07, type: "triangle" });
    } else if (name === "moo") {
      var moo = playTone(context, { from: 190, to: 120, length: 0.8, volume: 0.12, type: "sawtooth", filter: 700 });
      var wobble = context.createOscillator();
      var wobbleDepth = context.createGain();
      wobble.frequency.value = 6;
      wobbleDepth.gain.value = 5;
      wobble.connect(wobbleDepth);
      wobbleDepth.connect(moo.frequency);
      wobble.start();
      wobble.stop(context.currentTime + 0.9);
    } else if (name === "crunch") {
      [0, 0.13, 0.26].forEach(function (delay) {
        playNoise(context, delay, 0.07);
      });
    } else if (name === "sparkle") {
      [784, 988, 1175, 1568].forEach(function (note, index) {
        playTone(context, { from: note, length: 0.18, volume: 0.06, delay: index * 0.07 });
      });
    } else if (name === "fanfare") {
      [523, 659, 784, 1047].forEach(function (note, index) {
        playTone(context, { from: note, length: 0.25, volume: 0.06, delay: index * 0.1, type: "triangle" });
      });
    }
  }

  function toggleSound() {
    state.shop.settings.muted = !state.shop.settings.muted;
    saveShop();
    renderSoundButton();
    playSound("correct");
  }

  function renderSoundButton() {
    var muted = state.shop.settings.muted;
    elements.soundIcon.textContent = muted ? "🔇" : "🔊";
    elements.soundLabel.textContent = muted ? "Sound off" : "Sound on";
    elements.soundButton.setAttribute("aria-pressed", String(!muted));
  }

  // ---------- Scrapbook diary ----------

  function getDiaryDay(dateKey) {
    var key = dateKey || getLocalDateKey();
    if (!state.shop.diary[key]) {
      state.shop.diary[key] = { c: 0, e: [] };
    }
    return state.shop.diary[key];
  }

  function recordDiaryCorrect() {
    getDiaryDay().c += 1;
  }

  function addDiaryEvent(icon, text, dateKey) {
    var day = getDiaryDay(dateKey);
    var exists = day.e.some(function (event) {
      return event.t === text;
    });
    if (!exists && day.e.length < 10) {
      day.e.push({ i: icon, t: text });
    }
    saveShop();
  }

  function ensureEggInDiary() {
    var bornOn = state.shop.pet.bornOn;
    var day = state.shop.diary[bornOn];
    if (!day || !day.e.some(function (event) {
      return event.i === "🥚";
    })) {
      addDiaryEvent("🥚", "Your coo egg arrived", bornOn);
    }
  }

  function openScrapbook() {
    var today = new Date();
    state.calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    state.selectedDiaryDay = getLocalDateKey();
    renderScrapbook();
    elements.scrapbookOverlay.hidden = false;
    elements.scrapbookCloseButton.focus();
  }

  function moveCalendar(step) {
    state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() + step, 1);
    renderScrapbook();
  }

  function toDateKey(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function renderScrapbook() {
    var diary = state.shop.diary;
    var keys = Object.keys(diary);
    var daysPlayed = keys.filter(function (key) {
      return diary[key].c > 0;
    }).length;
    var totalCorrect = keys.reduce(function (sum, key) {
      return sum + diary[key].c;
    }, 0);
    var medals = keys.reduce(function (sum, key) {
      return sum + diary[key].e.filter(function (event) {
        return /medal/.test(event.t);
      }).length;
    }, 0);

    elements.scrapbookStats.innerHTML = [
      getSummaryStatMarkup("Days played", daysPlayed),
      getSummaryStatMarkup("Day streak", getDayStreak()),
      getSummaryStatMarkup("Correct", totalCorrect),
      getSummaryStatMarkup("Medals", medals),
    ].join("");

    var month = state.calendarMonth;
    var now = new Date();
    elements.calendarNext.disabled =
      month.getFullYear() > now.getFullYear() ||
      (month.getFullYear() === now.getFullYear() && month.getMonth() >= now.getMonth());
    elements.calendarMonth.textContent = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    elements.calendarGrid.innerHTML = "";
    ["M", "T", "W", "T", "F", "S", "S"].forEach(function (label) {
      var head = document.createElement("span");
      head.className = "calendar-weekday";
      head.textContent = label;
      elements.calendarGrid.appendChild(head);
    });
    var offset = (month.getDay() + 6) % 7;
    for (var blank = 0; blank < offset; blank += 1) {
      elements.calendarGrid.appendChild(document.createElement("span"));
    }
    var daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    var todayKey = getLocalDateKey();
    for (var dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
      elements.calendarGrid.appendChild(getCalendarCell(new Date(month.getFullYear(), month.getMonth(), dayNumber), todayKey));
    }
    renderDiaryDetail();
  }

  function getCalendarCell(date, todayKey) {
    var key = toDateKey(date);
    var entry = state.shop.diary[key];
    var cell = document.createElement("button");
    cell.type = "button";
    cell.className = "calendar-day";
    if (entry) {
      var level = entry.c >= 25 ? 3 : entry.c >= 10 ? 2 : entry.c > 0 ? 1 : 0;
      cell.classList.add("level-" + level);
    }
    if (key === todayKey) {
      cell.classList.add("is-today");
    }
    if (key === state.selectedDiaryDay) {
      cell.classList.add("is-selected");
    }
    cell.innerHTML =
      "<span>" + date.getDate() + "</span>" +
      (entry && entry.e.length ? '<span class="calendar-emoji">' + entry.e[entry.e.length - 1].i + "</span>" : "");
    cell.addEventListener("click", function () {
      state.selectedDiaryDay = key;
      renderScrapbook();
    });
    return cell;
  }

  function renderDiaryDetail() {
    var key = state.selectedDiaryDay;
    var entry = state.shop.diary[key];
    var date = parseDateKey(key);
    var title = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
    if (!entry || (!entry.c && !entry.e.length)) {
      elements.calendarDayDetail.innerHTML = "<strong>" + escapeHtml(title) + "</strong><p>Nothing here yet.</p>";
      return;
    }
    var lines = [];
    if (entry.c) {
      lines.push("<li>✅ " + entry.c + " correct " + (entry.c === 1 ? "answer" : "answers") + "</li>");
    }
    entry.e.forEach(function (event) {
      lines.push("<li>" + escapeHtml(event.i + " " + event.t) + "</li>");
    });
    elements.calendarDayDetail.innerHTML = "<strong>" + escapeHtml(title) + "</strong><ul>" + lines.join("") + "</ul>";
  }

  function getDayStreak() {
    var streak = 0;
    var date = new Date();
    var todayEntry = state.shop.diary[toDateKey(date)];
    if (!todayEntry || !todayEntry.c) {
      // Today still counts as "in progress", so start from yesterday.
      date.setDate(date.getDate() - 1);
    }
    while (state.shop.diary[toDateKey(date)] && state.shop.diary[toDateKey(date)].c > 0) {
      streak += 1;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  }

  // ---------- Backup and restore ----------

  function openBackup() {
    elements.backupCode.value = getBackupCode();
    elements.backupCopyStatus.textContent = "";
    elements.restoreStatus.textContent = "";
    elements.restoreCode.value = "";
    renderBackupLast();
    elements.backupOverlay.hidden = false;
    elements.backupCloseButton.focus();
  }

  function closeDialog(overlay, returnFocus) {
    overlay.hidden = true;
    returnFocus.focus();
  }

  function getBackupCode() {
    var json = JSON.stringify(state.shop);
    return backupPrefix + window.btoa(unescape(encodeURIComponent(json)));
  }

  function renderBackupLast() {
    elements.backupLast.textContent = state.shop.backupAt
      ? "Last copied on " + new Date(state.shop.backupAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) + "."
      : "You haven't copied a save code yet.";
  }

  function copyBackupCode() {
    var code = elements.backupCode.value;
    var markCopied = function () {
      state.shop.backupAt = Date.now();
      saveShop();
      renderBackupLast();
      elements.backupCopyStatus.textContent = "Copied! Paste it somewhere safe 💕";
    };
    var fallback = function () {
      elements.backupCode.focus();
      elements.backupCode.select();
      try {
        if (document.execCommand("copy")) {
          markCopied();
          return;
        }
      } catch (error) {
        // Fall through to the manual message below.
      }
      elements.backupCopyStatus.textContent = "Select the code above and copy it manually.";
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(markCopied, fallback);
    } else {
      fallback();
    }
  }

  function readBackupCode(code) {
    var cleaned = String(code).replace(/\s+/g, "");
    if (cleaned.indexOf(backupPrefix) !== 0) {
      return null;
    }
    try {
      var json = decodeURIComponent(escape(window.atob(cleaned.slice(backupPrefix.length))));
      var data = JSON.parse(json);
      if (typeof data.hearts !== "number" || !data.pet || typeof data.pet !== "object") {
        return null;
      }
      return data;
    } catch (error) {
      return null;
    }
  }

  function restoreFromCode() {
    var data = readBackupCode(elements.restoreCode.value);
    if (!data) {
      elements.restoreStatus.textContent = "That code doesn't look right. Make sure you pasted all of it.";
      return;
    }
    var summary = data.hearts + " hearts" + (data.pet.name ? " and " + data.pet.name + " the coo" : "");
    if (!window.confirm("Restore this backup with " + summary + "? It replaces what's on this device right now.")) {
      return;
    }
    try {
      window.localStorage.setItem(shopStorageKey, JSON.stringify(data));
    } catch (error) {
      elements.restoreStatus.textContent = "This browser won't let the game save. Try turning off private browsing.";
      return;
    }
    window.location.reload();
  }

  function maybeRemindBackup() {
    var shop = state.shop;
    var today = getLocalDateKey();
    var hasProgress = shop.hearts > 0 || Object.keys(shop.owned).length > 0 || shop.pet.name;
    var since = shop.backupAt || parseDateKey(shop.pet.bornOn).getTime();
    var daysSince = (Date.now() - since) / 86400000;
    if (!hasProgress || daysSince < backupReminderDays || shop.backupReminderOn === today) {
      return;
    }
    shop.backupReminderOn = today;
    saveShop();
    showToast("💾 Quick reminder: tap Backup at the top to save a code for your coo, just in case.");
  }

  init();
})();
