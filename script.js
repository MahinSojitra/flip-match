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
const hrUpper = document.getElementById("hr-upper");
const hrLower = document.getElementById("hr-lower");
const restartBtn = document.getElementById("restartBtn");
const reloadBtnContainer = document.getElementById("reloadBtnContainer");

function shuffleIcons() {
  cards.sort(() => Math.random() - Math.random());
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
    card.innerHTML = `
          <div class="card-inner" data-icon="${icon}">
            <div class="card-front"></div>
            <div class="card-back">
              <i class="bi ${icon}" style="font-size: 2rem;"></i>
            </div>
          </div>
        `;
    gameContainer.appendChild(card);
    card.addEventListener("click", () => flipCard(card));
  });
}

function showWinningMessage() {
  hrLower.remove();
  reloadBtnContainer.remove();

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
      <p class="text-muted fs-5 mb-4">You won the game!</p>
      <button class="btn btn-sm btn-outline-success mx-auto w-auto" onclick="location.reload()">Play Again</button>`;
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

restartBtn.addEventListener("click", () => {
  location.reload();
});

createCards();
updateCardFlips();

const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);
