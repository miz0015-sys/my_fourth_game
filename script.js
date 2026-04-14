const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
let player = {
  x: 50,
  y: 50,
  radius: 10,
  speed: 3
};

// Controls
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Obstacles
let obstacles = [
  { x: 150, y: 100, width: 100, height: 20 }
];

  // Block obstacle
  if (!isColliding(newX, newY)) {
    player.x = newX;
    player.y = newY;
  }
}

// Enemy
let enemy = {
  x: 300,
  y: 50,
  radius: 10,
  speed: 2,
  direction: 1
};

// Movement
function movement() {
  let newX = player.x;
  let newY = player.y;

  if (keys["ArrowUp"]) newY -= player.speed;
  if (keys["ArrowDown"]) newY += player.speed;
  if (keys["ArrowLeft"]) newX -= player.speed;
  if (keys["ArrowRight"]) newX += player.speed;

  // Boundary block
  if (newX - player.radius < 0 || newX + player.radius > canvas.width) {
    newX = player.x;
  }
  if (newY - player.radius < 0 || newY + player.radius > canvas.height) {
    newY = player.y;
  }

  // Obstacle check
  if (!isCollidingWithObstacle(newX, newY)) {
    player.x = newX;
    player.y = newY;
  }
}
// Obstacle collision
function isCollidingWithObstacle(px, py) {
  for (let o of obstacles) {
    if (
      px > o.x &&
      px < o.x + o.width &&
      py > o.y &&
      py < o.y + o.height
    ) {
      return true;
    }
  }
  return false;
}

// Enemy movement
function moveEnemy() {
  enemy.y += enemy.speed * enemy.direction;

  if (enemy.y > 300 || enemy.y < 50) {
    enemy.direction *= -1;
  }
}

// Enemy collision
function checkEnemyCollision() {
  let dx = player.x - enemy.x;
  let dy = player.y - enemy.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.radius + enemy.radius) {
    // Reset player position
    player.x = 50;
    player.y = 50;
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

// Red boundary
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
}

// Game loop
function gameLoop() {
  movement();
  moveEnemy();
  checkEnemyCollision();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
