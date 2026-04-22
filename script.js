const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 400;

let player = {
  x: 50,
  y: 50,
  radius: 10,
  speed: 3
};

let gameState = "playing";

let startTime = Date.now();
let elapsedTime = 0;

let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

let obstacles = [
  { x: 150, y: 100, width: 100, height: 20 },
  { x: 120, y: 40, width: 150, height: 30 },
  { x: 400, y: 0, width: 40, height: 200 },
  { x: 50, y: 80, width: 30, height: 280 },
  { x: 350, y: 260, width: 150, height: 20 }
];

let enemies = [
  { x: 300, y: 50, radius: 10, speed: 2, direction: 1, axis: "y", color: "red", startX: 300, startY: 50 },
  { x: 480, y: 250, radius: 10, speed: 4, direction: -1, axis: "x", color: "purple", startX: 480, startY: 250 },
  { x: 70, y: 10, radius: 10, speed: 2, direction: 1, axis: "y", color: "red", startX: 70, startY: 10 }
];

let goal = {
  x: 450,
  y: 350,
  radius: 12
};

function resetPlayer() {
  player.x = 50;
  player.y = 50;
}

function movement() {
  let newX = player.x;
  let newY = player.y;

  if (keys["ArrowUp"]) newY -= player.speed;
  if (keys["ArrowDown"]) newY += player.speed;
  if (keys["ArrowLeft"]) newX -= player.speed;
  if (keys["ArrowRight"]) newX += player.speed;

  const margin = 5;

  if (newX - player.radius < margin || newX + player.radius > canvas.width - margin) {
    newX = player.x;
  }

  if (newY - player.radius < margin || newY + player.radius > canvas.height - margin) {
    newY = player.y;
  }

  if (!isCollidingWithObstacle(newX, player.y)) player.x = newX;
  if (!isCollidingWithObstacle(player.x, newY)) player.y = newY;
}

function isCollidingWithObstacle(px, py) {
  for (let o of obstacles) {
    let closestX = Math.max(o.x, Math.min(px, o.x + o.width));
    let closestY = Math.max(o.y, Math.min(py, o.y + o.height));

    let dx = px - closestX;
    let dy = py - closestY;

    if (dx * dx + dy * dy < player.radius * player.radius) {
      return true;
    }
  }
  return false;
}

function moveEnemies() {
  for (let enemy of enemies) {
    if (enemy.axis === "y") {
      enemy.y += enemy.speed * enemy.direction;

      if (enemy.y > canvas.height - enemy.radius || enemy.y < enemy.radius) {
        enemy.direction *= -1;
      }
    }

    if (enemy.axis === "x") {
      enemy.x += enemy.speed * enemy.direction;

      if (enemy.x > canvas.width - enemy.radius || enemy.x < enemy.radius) {
        enemy.direction *= -1;
      }
    }
  }
}

function checkEnemyCollision() {
  for (let enemy of enemies) {
    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < player.radius + enemy.radius) {
      resetPlayer();
      startTime = Date.now();
      break;
    }
  }
}

function checkWin() {
  let dx = player.x - goal.x;
  let dy = player.y - goal.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.radius + goal.radius) {
    gameState = "won";
  }
}

function resetGame() {
  resetPlayer();
  startTime = Date.now();
  elapsedTime = 0;
  gameState = "playing";

  for (let enemy of enemies) {
    enemy.x = enemy.startX;
    enemy.y = enemy.startY;
  }

  enemies[0].direction = 1;
  enemies[1].direction = -1;
}

canvas.addEventListener("click", (e) => {
  if (gameState !== "won") return;

  let rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  let mouseY = e.clientY - rect.top;

  if (
    mouseX > canvas.width / 2 - 60 &&
    mouseX < canvas.width / 2 + 60 &&
    mouseY > canvas.height / 2 + 10 &&
    mouseY < canvas.height / 2 + 50
  ) {
    resetGame();
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";

  let minutes = Math.floor(elapsedTime / 60);
  let seconds = elapsedTime % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  ctx.fillText(`Time: ${minutes}:${seconds}`, 10, 25);

  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();

  ctx.fillStyle = "black";
  for (let o of obstacles) {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  }

  for (let enemy of enemies) {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(goal.x, goal.y, goal.radius, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();

  if (gameState === "won") {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("YOU WON!", canvas.width / 2, canvas.height / 2 - 40);

    let winMinutes = Math.floor(elapsedTime / 60);
    let winSeconds = elapsedTime % 60;
    winSeconds = winSeconds < 10 ? "0" + winSeconds : winSeconds;

    ctx.fillText(`Time: ${winMinutes}:${winSeconds}`, canvas.width / 2, canvas.height / 2 - 10);

    ctx.fillStyle = "green";
    ctx.fillRect(canvas.width / 2 - 60, canvas.height / 2 + 10, 120, 40);

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Play Again", canvas.width / 2, canvas.height / 2 + 35);
  }
}

function gameLoop() {
  if (gameState === "playing") {
    movement();
    moveEnemies();
    checkEnemyCollision();
    checkWin();
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  }

  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
