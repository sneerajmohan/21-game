let current = 0;
let gameOver = false;
let userTurn = true;
let winner = "";

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
  winner = "";
  userTurn = true;
  chatEl.innerHTML = "";
  currentNumberEl.textContent = current;

  const userStarts = Math.random() < 0.5;

  if (userStarts) {
    addInfo("Your turn");
    enableButtons();
    updateMoveButtons();
  } else {
    userTurn = false;
    disableButtons();

    setTimeout(() => {
      const systemNumbers = sayNumbers(1);
      addMessage("system", "System", String(last(systemNumbers)));

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
  addMessage("you", "You", String(last(userNumbers)));

  if (checkLoss("You")) return;

  userTurn = false;
  disableButtons();

  setTimeout(() => {
    const systemChoice = systemMove();
    const systemNumbers = sayNumbers(systemChoice);

    addMessage("system", "System", String(last(systemNumbers)));

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

    if (current >= 21) {
      current = 21;
      break;
    }
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

  const winnerText = winner === "You" ? "You 🙂" : "System 🙁";

  const text =
    `I played "Don’t Say 21."

    Winner: ${winnerText}

    Play here: ${gameLink}`;

  const card = document.createElement("div");
  card.className = "share-card";

  const textarea = document.createElement("textarea");
  textarea.readOnly = true;
  textarea.value = text;

  const button = document.createElement("button");
  button.textContent = "Copy result";

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(textarea.value);
    } catch {
      textarea.select();
      document.execCommand("copy");
    }

    button.textContent = "Copied!";
    setTimeout(() => {
      button.textContent = "Copy result";
    }, 1200);
  });

  card.appendChild(textarea);
  card.appendChild(button);
  chatEl.appendChild(card);
  chatEl.scrollTop = chatEl.scrollHeight;
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

    button.disabled = false;
  });
}

function last(arr) {
  return arr[arr.length - 1];
}

resetGame();