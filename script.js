let current = 0;
let gameOver = false;
let userTurn = true;
let winner = "";

const chatEl = document.getElementById("chat");
const currentNumberEl = document.getElementById("currentNumber");
const resetBtn = document.getElementById("resetBtn");
const moveButtons = document.querySelectorAll(".moveBtn");

const shareBox = document.getElementById("shareBox");
const shareText = document.getElementById("shareText");
const copyBtn = document.getElementById("copyBtn");

resetBtn.addEventListener("click", resetGame);

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareText.value);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy result";
    }, 1200);
  } catch {
    shareText.select();
    document.execCommand("copy");
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy result";
    }, 1200);
  }
});

moveButtons.forEach(button => {
  button.addEventListener("click", () => {
    const move = Number(button.dataset.move);
    userMove(move);
  });
});

function resetGame() {
  current = 0;
  gameOver = false;
  winner = "";
  chatEl.innerHTML = "";
  currentNumberEl.textContent = current;
  shareBox.classList.add("hidden");
  shareText.value = "";

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
      winner = "System";
      addInfo("You said 21. You lost.");
      addMessage("system", "System", "I win");
    } else {
      winner = "You";
      addInfo("System said 21. You win!");
      addMessage("system", "System", "I lost");
    }

    showShareResult();
    return true;
  }

  return false;
}

function showShareResult() {
  const gameLink = window.location.href;

  shareText.value =
`I played Don’t Say 21.

Winner: ${winner}
Final number: ${current}

Play here: ${gameLink}`;

  shareBox.classList.remove("hidden");
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

    if (current === 0 && move !== 1) {
      button.disabled = true;
      return;
    }

    if (current + move > 21) {
      button.disabled = true;
      return;
    }

    button.disabled = false;
  });
}

resetGame();