const WIDTH = 20;
const HEIGHT = 20;
const unitSpace = 40;

const board = document.querySelector(".board");

let score = 0;
const scoreDiv = document.createElement("div");
scoreDiv.className = "score";
scoreDiv.innerText = `Score: ${score}`;
document.body.insertBefore(scoreDiv, board);

let DIRECTION = "RIGHT";

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

  const foodEl = document.querySelector(`[x="${food.x}"][y="${food.y}"]`);
  foodEl.classList.add("food");

  for (let i = 0; i < snake.length; i++) {
    const dot = snake[i];
    if (i === 0) {
      const headEl = document.querySelector(`[x="${dot.x}"][y="${dot.y}"]`);
      headEl.classList.add("head");
    } else {
      const bodyEl = document.querySelector(`[x="${dot.x}"][y="${dot.y}"]`);
      bodyEl.classList.add("body");
    }
  }
};

setInterval(() => {
  const newSnake = [];

  if (DIRECTION === "RIGHT") {
    newSnake[0] = { x: snake[0].x, y: (snake[0].y + 1) % WIDTH };
  } else if (DIRECTION === "LEFT") {
    let nextY = snake[0].y - 1;
    if (nextY === -1) {
      nextY = WIDTH - 1;
    }
    newSnake[0] = { x: snake[0].x, y: nextY };
  } else if (DIRECTION === "BOTTOM") {
    newSnake[0] = { x: (snake[0].x + 1) % HEIGHT, y: snake[0].y };
  } else if (DIRECTION === "TOP") {
    let nextX = snake[0].x - 1;
    if (nextX === -1) {
      nextX = HEIGHT - 1;
    }
    newSnake[0] = { x: nextX, y: snake[0].y };
  }

  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newSnake[0].x && snake[i].y === newSnake[0].y) {
      drawBoard();
      return;
    }
  }

  let eat_food = newSnake[0].x === food.x && newSnake[0].y === food.y;

  if (eat_food) {
    // ✅ Increase score
    score++;
    scoreDiv.innerText = `Score: ${score}`;

    snake.push({ x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) - 2 });
    food = {
      x: getRandomInt(0, WIDTH),
      y: getRandomInt(0, HEIGHT),
    };
  }

  for (let i = 0; i < snake.length - 1; i++) {
    const dot = snake[i];
    newSnake.push(dot);
  }

  snake = newSnake;
  drawBoard();
}, 150);

window.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key === "ArrowUp" && DIRECTION !== "BOTTOM") {
    DIRECTION = "TOP";
  } else if (key === "ArrowDown" && DIRECTION !== "TOP") {
    DIRECTION = "BOTTOM";
  } else if (key === "ArrowRight" && DIRECTION !== "LEFT") {
    DIRECTION = "RIGHT";
  } else if (key === "ArrowLeft" && DIRECTION !== "RIGHT") {
    DIRECTION = "LEFT";
  }
});
