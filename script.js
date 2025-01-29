const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

const allIcons = [
  "bi-alarm",
  "bi-basket",
  "bi-calendar",
  "bi-camera",
  "bi-cloud",
  "bi-heart",
  "bi-star",
  "bi-music-note",
  "bi-bell",
  "bi-bicycle",
  "bi-cloud-sun",
  "bi-pencil",
  "bi-gear",
  "bi-globe",
  "bi-envelope",
  "bi-flag",
  "bi-house",
  "bi-chat",
  "bi-lightbulb",
  "bi-shield-lock",
  "bi-trophy",
  "bi-umbrella",
  "bi-wallet",
  "bi-watch",
  "bi-wifi",
  "bi-wind",
  "bi-window",
  "bi-box",
  "bi-briefcase",
];

const icons = getRandomIcons(allIcons, 8);
const cards = [...icons, ...icons];
const fixedFlips = Math.floor(Math.random() * ((50 - 18) / 2 + 1)) * 2 + 18;
let flippedCards = [];
let score = 0;
let totalFlips = 0;
let missGuesses = 0;
let hintCount = 3;
let currentStep = 0;
let tutorialActive = false;
const hintBtnTooltipMessages = `
  <div class='text-start px-1 pt-1'>
          <strong>
            Available Hints
          </strong>
          <hr class='my-1 border-2'/>
          <p>Hint Button reveals the second card in a matching pair, helping you identify it when you're stuck.
            This feature is limited, so use it strategically when you're having trouble finding a match.</p>
  </div>
`;

const hintBtn = document.getElementById("hintBtn");
const hrUpper = document.getElementById("hr-upper");
const hrLower = document.getElementById("hr-lower");
const restartBtn = document.getElementById("restartBtn");
const reloadBtnContainer = document.getElementById("reloadBtnContainer");

function shuffleCards() {
  cards.sort(() => Math.random() - 0.5);
}

function getRandomIcons(iconList, numIcons) {
  const randomIcons = [];
  while (randomIcons.length < numIcons) {
    const randomIndex = Math.floor(Math.random() * iconList.length);
    if (!randomIcons.includes(iconList[randomIndex])) {
      randomIcons.push(iconList[randomIndex]);
    }
  }
  return randomIcons;
}

function createCards() {
  const gameContainer = document.getElementById("gameContainer");
  gameContainer.innerHTML = "";
  cards.forEach((icon, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("border-0");
    index == 0 ? card.classList.add("first") : null;
    card.innerHTML = `
          <div class="card-inner" id="${index + 1}" data-icon="${icon}">
            <div class="card-front"></div>
            <div class="card-back">
              <i class="bi ${icon}" style="font-size: 2rem;"></i>
            </div>
          </div>
        `;
    gameContainer.appendChild(card);
    card.addEventListener("click", () => flipCard(card));
    card.addEventListener("mouseover", () => cardHover(card));
  });
}

function showWinningMessage() {
  hrLower.remove();
  reloadBtnContainer.remove();
  hintBtn.disabled = true;
  hintBtn.classList.add("btn-disabled");

  const gameContainer = document.getElementById("gameContainer");
  const message = document.createElement("div");
  message.classList.add(
    "card",
    "shadow",
    "py-4",
    "px-0",
    "border-2",
    "text-center",
    "w-auto"
  );
  message.innerHTML = `
      <p class="fs-1">🎉</p>
      <h2>Congratulations!</h2>
      <p class="text-muted fs-5 mb-0">You won the game!</p>
      <p class="text-muted fs-6 mb-4 mt-1">You miss guess pairs of cards ${missGuesses} times.</p>
      <button class="btn btn-sm btn-outline-success mx-auto w-auto" onclick="location.reload()">Play Again</button>
  `;
  gameContainer.replaceWith(message);
}

function showGameOverMessage() {
  let cardFlipsStatus = document.getElementById("cardFlipsStatus");
  cardFlipsStatus.remove();

  hrUpper.classList.remove("my-2");
  hrUpper.classList.add("mt-2", "mb-4");
  hrLower.classList.remove("my-2");
  hrLower.classList.add("mb-2", "mt-4");

  const gameContainer = document.getElementById("gameContainer");
  const message = document.createElement("div");
  message.classList.add(
    "card",
    "shadow",
    "py-4",
    "px-0",
    "border-2",
    "text-center",
    "w-auto"
  );
  message.innerHTML = `
  <p class="fs-1 mb-0">😬</p>
  <h3 class="mt-0">Game Over!</h3>
  <p class="text-muted fs-6 mt-0 mb-3">You’ve run out of flips! No more moves left.</p>
  `;
  gameContainer.replaceWith(message);
}

function updateCardFlips() {
  let flipsLeftIndicator = document.getElementById("flipsLeft");
  if (fixedFlips - totalFlips === 1) {
    flipsLeftIndicator.innerHTML = `Only 1 flip left, make it count!`;
  } else if (fixedFlips - totalFlips === 0) {
    flipsLeftIndicator.innerHTML = `Run out of flips!`;
  } else {
    flipsLeftIndicator.innerHTML = `Flips Left : ${fixedFlips - totalFlips}`;
  }
}

function popupHintFor(card) {
  if (flippedCards.length === 1) {
    if (hintCount > 0) {
      hintCount--;
      const card = flippedCards[0];
      const flippedCardId = card
        .querySelector(".card-inner")
        .getAttribute("id");
      const flippedCardIcon = card.querySelector(".card-inner").dataset.icon;
      const hintCardId =
        cards.findIndex(
          (value, index) =>
            index !== flippedCardId - 1 && value === flippedCardIcon
        ) + 1;
      const hintCard = document.getElementById(hintCardId);
      hintCard.classList.add("hint-card-transition");
      checkHintBtnAvailability();
    }
  } else {
    const hintModal = new bootstrap.Modal(document.getElementById("hintModal"));
    hintModal.show();
  }
}

function flipCard(card) {
  const cardInner = card.querySelector(".card-inner");
  if (cardInner.classList.contains("is-flipped") || flippedCards.length === 2)
    return;

  cardInner.classList.add("is-flipped");
  flippedCards.push(card);
  totalFlips++;
  updateCardFlips();

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 1000);
  }
}

function cardHover(card) {
  card.classList.remove("hint-card-transition");
  const cardInner = card.querySelector(".card-inner");
  if (cardInner.classList.contains("is-flipped")) return;
  cardInner.classList.add("card-scale-up");
  card.addEventListener("mouseout", () => {
    cardInner.classList.remove("card-scale-up");
  });
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const icon1 = card1.querySelector(".card-inner").dataset.icon;
  const icon2 = card2.querySelector(".card-inner").dataset.icon;

  if (icon1 === icon2) {
    score++;
    const i1 = card1.querySelector(".card-back i");
    const i2 = card2.querySelector(".card-back i");
    i1.classList.remove(icon1);
    i2.classList.remove(icon2);
    i1.classList.add(`bi-${score}-square`);
    i2.classList.add(`bi-${score}-square`);
    card1.classList.add("matched");
    card2.classList.add("matched");
  } else {
    missGuesses++;
    card1.querySelector(".card-inner").classList.remove("is-flipped");
    card2.querySelector(".card-inner").classList.remove("is-flipped");
  }

  flippedCards = [];

  if (totalFlips === fixedFlips) {
    setTimeout(showGameOverMessage, 500);
  }

  if (score === icons.length) {
    setTimeout(showWinningMessage, 500);
  }
}

function checkHintBtnAvailability() {
  let hintButton = document.getElementById("hintBtn");

  if (hintCount === 0) {
    hintButton.disabled = true;
    hintButton.classList.add("btn-disabled");
    hintButton.setAttribute("data-bs-title", "No more hints left!");
    hintButton._tooltip.update();
  } else {
    hintButton.disabled = false;
    hintButton.setAttribute("data-bs-title", hintBtnTooltipMessages);
    hintButton._tooltip.update();
  }
}

restartBtn.addEventListener("click", () => {
  location.reload();
});

shuffleCards();
createCards();
updateCardFlips();
