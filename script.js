let current = 0;
let gameOver = false;
let userTurn = true;

const chatEl = document.getElementById("chat");
const currentNumberEl = document.getElementById("currentNumber");
const resetBtn = document.getElementById("resetBtn");
const moveButtons = document.querySelectorAll(".moveBtn");

resetBtn.addEventListener("click", resetGame);

moveButtons.forEach(button => {
  button.addEventListener("click", () => {
    const move = Number(button.dataset.move);
    userMove(move);
  });
});

function resetGame() {
  current = 0;
  gameOver = false;
  chatEl.innerHTML = "";
  currentNumberEl.textContent = current;

  const userStarts = Math.random() < 0.5;

  if (userStarts) {
    userTurn = true;
    addInfo("Your turn");
    enableButtons();
    updateMoveButtons();
  } else {
    userTurn = false;
    disableButtons();

    setTimeout(() => {
      const systemNumbers = sayNumbers(1);
      addMessage("system", "System", String(systemNumbers[systemNumbers.length - 1]));

      if (checkLoss("System")) return;

      userTurn = true;
      enableButtons();
      updateMoveButtons();
      addInfo("Your turn");
    }, 500);
  }
}

function userMove(move) {
  if (gameOver || !userTurn) return;

  // First number must always be 1.
  if (current === 0 && move !== 1) return;

  const userNumbers = sayNumbers(move);
  const userLastNumber = userNumbers[userNumbers.length - 1];

  addMessage("you", "You", String(userLastNumber));

  if (checkLoss("You")) return;

  userTurn = false;
  disableButtons();

  setTimeout(() => {
    const systemChoice = systemMove();
    const systemNumbers = sayNumbers(systemChoice);
    const systemLastNumber = systemNumbers[systemNumbers.length - 1];

    addMessage("system", "System", String(systemLastNumber));

    if (checkLoss("System")) return;

    userTurn = true;
    enableButtons();
    updateMoveButtons();
    addInfo("Your turn");
  }, 500);
}

function sayNumbers(move) {
  const numbers = [];

  for (let i = 0; i < move; i++) {
    current += 1;
    numbers.push(current);

    if (current === 21) break;
  }

  currentNumberEl.textContent = current;
  return numbers;
}

function systemMove() {
  // If system starts, it must say 1.
  if (current === 0) {
    return 1;
  }

  const targets = [4, 8, 12, 16, 20];

  const possibleMoves = [1, 2, 3].filter(move => current + move <= 21);
  const safeMoves = possibleMoves.filter(move => current + move < 21);

  if (safeMoves.length === 0) {
    return 1;
  }

  for (const move of safeMoves) {
    if (targets.includes(current + move)) {
      return move;
    }
  }

  return safeMoves[Math.floor(Math.random() * safeMoves.length)];
}

function checkLoss(playerName) {
  if (current >= 21) {
    gameOver = true;
    disableButtons();

    if (playerName === "You") {
      addInfo("You said 21. You lost.");
      addMessage("system", "System", "I win");
    } else {
      addInfo("System said 21. You win!");
      addMessage("system", "System", "I lost");
    }

    return true;
  }

  return false;
}

function addMessage(type, name, text) {
  const message = document.createElement("div");
  message.className = `message ${type}`;

  message.innerHTML = `
    <span class="name">${name}</span>
    ${text}
  `;

  chatEl.appendChild(message);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function addInfo(text) {
  const info = document.createElement("div");
  info.className = "message info";
  info.textContent = text;

  chatEl.appendChild(info);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function disableButtons() {
  moveButtons.forEach(button => {
    button.disabled = true;
  });
}

function enableButtons() {
  moveButtons.forEach(button => {
    button.disabled = false;
  });
}

function updateMoveButtons() {
  moveButtons.forEach(button => {
    const move = Number(button.dataset.move);

    // At the beginning, only +1 is allowed because the game must start with 1.
    if (current === 0 && move !== 1) {
      button.disabled = true;
      return;
    }

    // Do not allow moves beyond 21.
    if (current + move > 21) {
      button.disabled = true;
      return;
    }

    button.disabled = false;
  });
}

resetGame();