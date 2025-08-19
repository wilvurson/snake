const WIDTH = 20;
const HEIGHT = 20;
const unitSpace = 40;

const board = document.querySelector(".board");

let score = 0;
const scoreDiv = document.createElement("div");
scoreDiv.className = "score";
scoreDiv.innerText = `Score: ${score}`;

let DIRECTION = "RIGHT";
let gameOver = false;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * max + min);
};

let food = { x: getRandomInt(0, WIDTH), y: getRandomInt(0, HEIGHT) };
let snake = [
  { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) },
  { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) - 1 },
  { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) - 2 },
];

const drawBoard = () => {
  board.innerHTML = "";
  board.style.width = `${40 * WIDTH}px`;
  board.style.height = `${40 * HEIGHT}px`;

  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      const tileEl = document.createElement("div");
      tileEl.setAttribute("x", row);
      tileEl.setAttribute("y", col);
      tileEl.className = "tile";
      board.appendChild(tileEl);
    }
  }

  // food
  const foodEl = document.querySelector(`[x="${food.x}"][y="${food.y}"]`);
  if (foodEl) foodEl.classList.add("food");

  // snake
  for (let i = 0; i < snake.length; i++) {
    const dot = snake[i];
    const el = document.querySelector(`[x="${dot.x}"][y="${dot.y}"]`);
    if (!el) continue;
    if (i === 0) {
      el.classList.add("head");
    } else {
      el.classList.add("body");
    }
  }
};

const endGame = () => {
  gameOver = true;

  const oldOverlay = document.querySelector(".game-over");
  if (oldOverlay) oldOverlay.remove();

  const gameOverDiv = document.createElement("div");
  gameOverDiv.className = "game-over";
  gameOverDiv.innerHTML = `
    <h1>Game Over</h1>
    <p>Your Score: ${score}</p>
    <button id="restartBtn">Restart</button>
  `;

  // append to body instead of board
  document.body.appendChild(gameOverDiv);

  document.getElementById("restartBtn").addEventListener("click", () => {
    // reset everything
    score = 0;
    scoreDiv.innerText = `Score: ${score}`;
    DIRECTION = "RIGHT";
    gameOver = false;
    snake = [
      { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) },
      { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) - 1 },
      { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) - 2 },
    ];
    food = { x: getRandomInt(0, WIDTH), y: getRandomInt(0, HEIGHT) };

    gameOverDiv.remove();
    drawBoard();
  });
};


setInterval(() => {
  if (gameOver) return;

  const newSnake = [];

  if (DIRECTION === "RIGHT") {
    newSnake[0] = { x: snake[0].x, y: (snake[0].y + 1) % WIDTH };
  } else if (DIRECTION === "LEFT") {
    let nextY = snake[0].y - 1;
    if (nextY === -1) nextY = WIDTH - 1;
    newSnake[0] = { x: snake[0].x, y: nextY };
  } else if (DIRECTION === "BOTTOM") {
    newSnake[0] = { x: (snake[0].x + 1) % HEIGHT, y: snake[0].y };
  } else if (DIRECTION === "TOP") {
    let nextX = snake[0].x - 1;
    if (nextX === -1) nextX = HEIGHT - 1;
    newSnake[0] = { x: nextX, y: snake[0].y };
  }

  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newSnake[0].x && snake[i].y === newSnake[0].y) {
      endGame();
      return;
    }
  }

  let eat_food = newSnake[0].x === food.x && newSnake[0].y === food.y;

  if (eat_food) {
    score++;
    scoreDiv.innerText = `Score: ${score}`;
    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    food = { x: getRandomInt(0, WIDTH), y: getRandomInt(0, HEIGHT) };
  }

  for (let i = 0; i < snake.length - 1; i++) {
    newSnake.push(snake[i]);
  }

  snake = newSnake;
  drawBoard();
}, 100);

window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key === "ArrowUp" && DIRECTION !== "BOTTOM") DIRECTION = "TOP";
  else if (key === "ArrowDown" && DIRECTION !== "TOP") DIRECTION = "BOTTOM";
  else if (key === "ArrowRight" && DIRECTION !== "LEFT") DIRECTION = "RIGHT";
  else if (key === "ArrowLeft" && DIRECTION !== "RIGHT") DIRECTION = "LEFT";
});

drawBoard();
