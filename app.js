(function () {
  var cards = window.COUNTRY_CAPITALS || [];
  var continents = ["Whole World", "Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
  var populationFilters = [
    { label: "All", value: "all" },
    { label: "Well known", value: "well-known" },
    { label: "Medium", value: "medium" },
    { label: "Niche", value: "niche" },
  ];
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
    answerStyle: "type",
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
  };

  var elements = {
    continentControls: document.getElementById("continent-controls"),
    populationControls: document.getElementById("population-controls"),
    modeSelect: document.getElementById("mode-select"),
    answerStyleSelect: document.getElementById("answer-style-select"),
    restartButton: document.getElementById("restart-button"),
    scoreValue: document.getElementById("score-value"),
    streakValue: document.getElementById("streak-value"),
    bestStreakValue: document.getElementById("best-streak-value"),
    deckCount: document.getElementById("deck-count"),
    answeredCount: document.getElementById("answered-count"),
    progressFill: document.getElementById("progress-fill"),
    levelBadge: document.getElementById("level-badge"),
    motivationText: document.getElementById("motivation-text"),
    countryMap: document.getElementById("country-map"),
    mapTitle: document.getElementById("map-title"),
    mapDetail: document.getElementById("map-detail"),
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
    showAnswerButton: document.getElementById("show-answer-button"),
    nextButton: document.getElementById("next-button"),
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
    bindEvents();
    scheduleOpeningSplash();
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

    elements.restartButton.addEventListener("click", startRound);

    elements.typedAnswerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (state.hasAnswered) {
        nextCard();
        return;
      }
      checkTypedAnswer();
    });

    elements.showAnswerButton.addEventListener("click", function () {
      if (!state.current || state.hasAnswered) {
        return;
      }
      resolveAnswer(false, true);
    });

    elements.nextButton.addEventListener("click", nextCard);
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
    state.deck = shuffle(getFilteredCards());
    state.deckIndex = 0;
    state.hasAnswered = false;
    state.score = 0;
    state.answered = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.mapStatusById = {};
    elements.feedbackText.textContent = "";
    elements.motivationText.textContent = randomItem(encouragement.start);
    nextCard();
    updateStats();
  }

  function getFilteredCards() {
    return cards.filter(function (card) {
      var matchesContinent = state.continent === "Whole World" || card.continent === state.continent;
      var matchesPopulation = state.populationTier === "all" || card.populationTier === state.populationTier;
      return matchesContinent && matchesPopulation;
    });
  }

  function nextCard() {
    if (!state.deck.length) {
      renderEmptyDeck();
      updateStats();
      return;
    }

    if (state.deckIndex >= state.deck.length) {
      state.deck = shuffle(state.deck);
      state.deckIndex = 0;
    }

    state.current = state.deck[state.deckIndex];
    state.deckIndex += 1;
    state.hasAnswered = false;
    state.promptType = getPromptType();

    elements.cardFrame.classList.remove("answered", "is-correct", "is-wrong");
    elements.feedbackText.textContent = "";
    elements.typedAnswerInput.value = "";
    elements.typedAnswerInput.disabled = false;
    elements.nextButton.disabled = true;
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
    elements.cardFrame.classList.remove("answered", "is-correct", "is-wrong");
    elements.promptLabel.textContent = "No cards";
    elements.promptText.textContent = "No matches";
    elements.promptHelper.textContent = "Try another well-known level or continent.";
    elements.answerText.textContent = "Adjust filters";
    elements.answerHelper.textContent = "This deck has no countries in that combination.";
    elements.funFactText.textContent = "Well known is 50m-plus people, medium is about 5m to 50m, and niche is under about 5m.";
    elements.promptFlag.className = "flag-symbol";
    elements.answerFlag.className = "flag-symbol";
    elements.feedbackText.textContent = "";
    elements.typedAnswerInput.value = "";
    elements.typedAnswerInput.disabled = true;
    elements.nextButton.disabled = true;
    elements.showAnswerButton.disabled = true;
    elements.choiceAnswer.innerHTML = "";
    renderMap();
  }

  function getPromptType() {
    if (state.mode === "mixed") {
      return Math.random() > 0.5 ? "country" : "capital";
    }
    return state.mode === "country-to-capital" ? "country" : "capital";
  }

  function renderCard() {
    var isCountryPrompt = state.promptType === "country";
    var prompt = isCountryPrompt ? state.current.country : state.current.capital;
    var answer = isCountryPrompt ? state.current.capital : state.current.country;
    elements.promptLabel.textContent = isCountryPrompt ? "Country" : "Capital";
    elements.promptFlag.className = "flag-symbol " + (state.current.flagClass || "");
    elements.promptFlag.setAttribute("title", state.current.country + " flag");
    elements.promptText.textContent = prompt;
    elements.promptHelper.textContent = isCountryPrompt ? "Name the capital." : "Name the country.";
    elements.answerFlag.className = "flag-symbol " + (state.current.flagClass || "");
    elements.answerFlag.setAttribute("title", state.current.country + " flag");
    elements.answerText.textContent = answer;
    elements.answerHelper.textContent = isCountryPrompt
      ? state.current.country + " -> " + state.current.capital
      : state.current.capital + " -> " + state.current.country;
    elements.funFactText.textContent = state.current.fact || getFallbackFact(state.current);
  }

  function getFallbackFact(card) {
    return card.capital + " is the capital of " + card.country + ", one of the UN member states in " + card.continent + ".";
  }

  function renderMap() {
    if (!elements.countryMap) {
      return;
    }

    var mapCards = getGeographicCards();
    var deckIds = getFilteredCards().reduce(function (lookup, card) {
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
    if (!state.hasAnswered) {
      return "Asked now: " + state.current.country + " turns grey.";
    }
    var status = state.mapStatusById[state.current.id] === "correct" ? "green" : "red";
    return state.current.country + " is now " + status + ".";
  }

  function getMapStatus(card) {
    if (state.current && !state.hasAnswered && state.current.id === card.id) {
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
    var answerKey = state.promptType === "country" ? "capital" : "country";
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
    var answerType = state.promptType === "country" ? "capital" : "country";
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
    state.hasAnswered = true;
    state.answered += 1;
    state.mapStatusById[state.current.id] = isCorrect ? "correct" : "wrong";
    elements.cardFrame.classList.add("answered");
    elements.typedAnswerInput.disabled = true;
    elements.nextButton.disabled = false;
    elements.showAnswerButton.disabled = true;
    disableChoices();

    if (isCorrect) {
      state.score += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      elements.cardFrame.classList.add("is-correct");
      elements.feedbackText.textContent = getCorrectMessage();
      elements.motivationText.textContent = getStreakMessage();
      markChoice(choiceButton, true);
      if (state.streak > 0 && state.streak % 5 === 0) {
        celebrate();
      }
    } else {
      state.streak = 0;
      elements.cardFrame.classList.add("is-wrong");
      elements.feedbackText.textContent = wasRevealed ? "Revealed. Study the pair, then take the next card." : getWrongMessage();
      elements.motivationText.textContent = "Answer: " + getExpectedAnswer() + ". Keep going.";
      markChoice(choiceButton, false);
      markCorrectChoice();
    }

    updateStats();
    renderMap();
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
    return state.promptType === "country" ? state.current.capital : state.current.country;
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
    var deckSize = state.deck.length || getFilteredCards().length;
    var progress = deckSize ? Math.min(100, (state.answered / deckSize) * 100) : 0;
    elements.scoreValue.textContent = String(state.score);
    elements.streakValue.textContent = String(state.streak);
    elements.bestStreakValue.textContent = String(state.bestStreak);
    elements.deckCount.textContent = deckSize + (deckSize === 1 ? " card" : " cards");
    elements.answeredCount.textContent = state.answered + " answered";
    elements.progressFill.style.width = progress + "%";
    elements.levelBadge.textContent = getLevelName(state.score, state.streak);
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
