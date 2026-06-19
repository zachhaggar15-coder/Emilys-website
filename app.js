(function () {
  var cards = window.COUNTRY_CAPITALS || [];
  var continents = ["Whole World", "Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
  var state = {
    continent: "Whole World",
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
  };

  var elements = {
    continentControls: document.getElementById("continent-controls"),
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
    cardFrame: document.getElementById("card-frame"),
    flashcard: document.getElementById("flashcard"),
    promptLabel: document.getElementById("prompt-label"),
    promptText: document.getElementById("prompt-text"),
    promptHelper: document.getElementById("prompt-helper"),
    answerText: document.getElementById("answer-text"),
    answerHelper: document.getElementById("answer-helper"),
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
    renderContinentControls();
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

  function updateActiveContinent() {
    Array.prototype.forEach.call(elements.continentControls.children, function (button) {
      button.setAttribute("aria-pressed", String(button.textContent === state.continent));
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
    elements.feedbackText.textContent = "";
    elements.motivationText.textContent = randomItem(encouragement.start);
    nextCard();
    updateStats();
  }

  function getFilteredCards() {
    if (state.continent === "Whole World") {
      return cards.slice();
    }
    return cards.filter(function (card) {
      return card.continent === state.continent;
    });
  }

  function nextCard() {
    if (!state.deck.length) {
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
    updateStats();

    if (state.answerStyle === "type") {
      window.setTimeout(function () {
        elements.typedAnswerInput.focus();
      }, 80);
    }
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
    elements.promptText.textContent = prompt;
    elements.promptHelper.textContent = isCountryPrompt ? "Name the capital." : "Name the country.";
    elements.answerText.textContent = answer;
    elements.answerHelper.textContent = isCountryPrompt
      ? state.current.country + " -> " + state.current.capital
      : state.current.capital + " -> " + state.current.country;
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
