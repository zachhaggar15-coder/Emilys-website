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
  var mapPathById = {};
  var mapCenterById = {};
  var svgNamespace = "http://www.w3.org/2000/svg";
  var mapViewBoxes = {
    "Whole World": "0 0 1000 500",
    Africa: "410 135 275 285",
    Asia: "510 40 475 320",
    Europe: "415 70 245 170",
    "North America": "80 55 330 225",
    "South America": "285 230 180 250",
    Oceania: "705 220 340 210",
  };
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
    openingSplash: document.getElementById("opening-splash"),
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
    scheduleOpeningSplash();
    renderMapCollapseState();
    renderCountryBrowser();
    startRound();
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
    elements.promptHelper.textContent = isCountryPrompt
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
    elements.countryMap.setAttribute("viewBox", mapViewBoxes[state.continent] || mapViewBoxes["Whole World"]);
    elements.mapTitle.textContent = state.continent === "Whole World" ? "World map" : state.continent + " map";
    elements.mapDetail.textContent = getMapDetail();

    mapCards.forEach(function (card) {
      var status = getMapStatus(card);
      var isInDeck = Boolean(deckIds[card.id]);
      if (mapPathById[card.id]) {
        renderMapPath(card, status, isInDeck);
      } else {
        renderMapMarker(card, status, isInDeck);
      }
    });

    renderCurrentMapPulse();
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
    if (!state.hasAnswered) {
      return "Asked now: " + state.current.country + " turns grey and gets a label.";
    }
    var status = state.mapStatusById[state.current.id] === "correct" ? "green" : "red";
    return state.current.country + " is now " + status + ".";
  }

  function getMapStatus(card) {
    if (state.current && !state.roundEnded && !state.hasAnswered && state.current.id === card.id) {
      return "current";
    }
    return state.mapStatusById[card.id] || "idle";
  }

  function renderMapPath(card, status, isInDeck) {
    var path = document.createElementNS(svgNamespace, "path");
    path.setAttribute("d", mapPathById[card.id]);
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("class", getMapClassName("map-country", status, isInDeck));
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
    marker.setAttribute("class", getMapClassName("map-marker", status, isInDeck));
    marker.setAttribute("aria-label", getMapAriaLabel(card, status));
    marker.appendChild(getMapTitle(card, status));
    elements.countryMap.appendChild(marker);
  }

  function renderCurrentMapPulse() {
    if (!state.current || state.hasAnswered) {
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
    if (wrapPacific && state.continent === "Oceania" && projectedLon < 0) {
      projectedLon += 360;
    }
    return {
      x: ((projectedLon + 180) / 360) * 1000,
      y: ((90 - lat) / 180) * 500,
    };
  }

  function renderAnswerControls() {
    var useChoices = state.answerStyle === "choice";
    elements.typedAnswerForm.hidden = useChoices;
    elements.choiceAnswer.hidden = !useChoices;

    if (useChoices) {
      renderChoices();
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
      if (state.streak > 0 && state.streak % 5 === 0) {
        celebrate();
      }
    } else {
      state.streak = 0;
      state.mistakeIds[state.current.id] = true;
      elements.cardFrame.classList.add("is-wrong");
      elements.feedbackText.textContent = wasRevealed ? "Revealed. Study the pair, then take the next card." : getWrongMessage();
      elements.motivationText.textContent = "Answer: " + getExpectedAnswer() + ". Keep going.";
      markChoice(choiceButton, false);
      markCorrectChoice();
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
      celebrate();
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

  function celebrate() {
    var colors = ["#0f766e", "#14b8a6", "#f97316", "#facc15", "#2563eb"];
    elements.celebrationLayer.innerHTML = "";
    for (var i = 0; i < 26; i += 1) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = 8 + Math.random() * 84 + "%";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 0.18 + "s";
      piece.style.transform = "rotate(" + Math.random() * 180 + "deg)";
      elements.celebrationLayer.appendChild(piece);
    }

    window.setTimeout(function () {
      elements.celebrationLayer.innerHTML = "";
    }, 1300);
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

  function scheduleOpeningSplash() {
    if (!elements.openingSplash) {
      return;
    }

    window.setTimeout(function () {
      elements.openingSplash.classList.add("is-hiding");
      window.setTimeout(function () {
        elements.openingSplash.remove();
      }, 420);
    }, 3000);
  }

  init();
})();
