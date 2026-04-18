const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
let player = {
  x: 50,
  y: 50,
  radius: 10,
  speed: 3
};

// Game state
let gameState = "playing";

// Timer
let startTime = Date.now();
let elapsedTime = 0;

// Controls
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Obstacles
let obstacles = [
  { x: 150, y: 100, width: 100, height: 20 },
  { x: 120, y: 40, width: 150, height: 30 },
  { x: 400, y: 0, width: 40, height: 200 }
];

// Enemy
let enemy = {
  x: 300,
  y: 50,
  radius: 10,
  speed: 2,
  direction: 1
};

// Goal
let goal = {
  x: 450,
  y: 350,
  radius: 12
};

// Movement
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

  if (!isCollidingWithObstacle(newX, player.y)) {
    player.x = newX;
  }

  if (!isCollidingWithObstacle(player.x, newY)) {
    player.y = newY;
  }
}

// Obstacle collision
function isCollidingWithObstacle(px, py) {
  for (let o of obstacles) {
    let closestX = Math.max(o.x, Math.min(px, o.x + o.width));
    let closestY = Math.max(o.y, Math.min(py, o.y + o.height));

    let dx = px - closestX;
    let dy = py - closestY;

    if ((dx * dx + dy * dy) < (player.radius * player.radius)) {
      return true;
    }
  }
  return false;
}

// Enemy movement
function moveEnemy() {
  enemy.y += enemy.speed * enemy.direction;

  if (enemy.y > canvas.height - enemy.radius || enemy.y < enemy.radius) {
    enemy.direction *= -1;
  }
}

// Enemy collision
function checkEnemyCollision() {
  let dx = player.x - enemy.x;
  let dy = player.y - enemy.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.radius + enemy.radius) {
    player.x = 50;
    player.y = 50;
  }
}

// Win check
function checkWin() {
  let dx = player.x - goal.x;
  let dy = player.y - goal.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.radius + goal.radius) {
    gameState = "won";
  }
}

// Click (Play Again)
canvas.addEventListener("click", function (e) {
  if (gameState === "won") {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    if (
      mouseX > canvas.width / 2 - 60 &&
      mouseX < canvas.width / 2 + 60 &&
      mouseY > canvas.height / 2 + 10 &&
      mouseY < canvas.height / 2 + 50
    ) {
      player.x = 50;
      player.y = 50;
      startTime = Date.now();
      elapsedTime = 0;
      gameState = "playing";
    }
  }
});

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Timer
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";

  let minutes = Math.floor(elapsedTime / 60);
  let seconds = elapsedTime % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  ctx.fillText(`Time: ${minutes}:${seconds}`, 10, 25);

  // Boundary
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  // Player
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();

  // Obstacles
  ctx.fillStyle = "black";
  for (let o of obstacles) {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  }

  // Enemy
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  // Goal
  ctx.beginPath();
  ctx.arc(goal.x, goal.y, goal.radius, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();

  // Win screen
  if (gameState === "won") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
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

// Game loop
function gameLoop() {
  if (gameState === "playing") {
    movement();
    moveEnemy();
    checkEnemyCollision();
    checkWin();

    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  }

  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
