// Game Variables
const gameBoard = document.getElementById('game-board');
const player = document.getElementById('player');
const enemiesContainer = document.getElementById('enemies');
const lasersContainer = document.getElementById('lasers');
const scoreDisplay = document.getElementById('score');
let playerX = 280; // Initial player position
let score = 0;
let enemies = [];
let playerLasers = [];
let enemyLasers = [];
const enemyRows = 3;
const enemyCols = 8;
const enemySpeed = 1;
let enemyDirection = 1; // 1 = right, -1 = left
let gameOver = false;

// Create Enemies
function createEnemies() {
  for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyCols; col++) {
      const enemy = document.createElement('div');
      enemy.classList.add('enemy');
      enemy.style.left = `${col * 60 + 30}px`;
      enemy.style.top = `${row * 40 + 30}px`;
      enemiesContainer.appendChild(enemy);
      enemies.push(enemy);
    }
  }
}

// Move Enemies
function moveEnemies() {
  if (gameOver) return;

  let edgeReached = false;
  enemies.forEach(enemy => {
    const currentX = parseFloat(enemy.style.left);
    const newX = currentX + enemySpeed * enemyDirection;
    enemy.style.left = `${newX}px`;

    // Check if enemies hit the edge
    if (newX <= 0 || newX >= 570) {
      edgeReached = true;
    }
  });

  // Reverse direction and move down if edge is reached
  if (edgeReached) {
    enemyDirection *= -1;
    enemies.forEach(enemy => {
      const currentY = parseFloat(enemy.style.top);
      enemy.style.top = `${currentY + 20}px`;

      // Check if enemies reach the bottom (game over)
      if (currentY + 20 >= 360) {
        gameOver = true;
        alert("Game Over! Enemies reached the bottom.");
        resetGame();
      }
    });
  }
}

// Move Player
document.addEventListener('keydown', (e) => {
  if (gameOver) return;

  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= 10;
  } else if (e.key === 'ArrowRight' && playerX < 560) {
    playerX += 10;
  } else if (e.key === ' ') {
    shootPlayerLaser();
  }
  player.style.left = `${playerX}px`;
});

// Shoot Player Laser
function shootPlayerLaser() {
  const laser = document.createElement('div');
  laser.classList.add('laser');
  laser.style.left = `${playerX + 19}px`;
  laser.style.bottom = '30px';
  lasersContainer.appendChild(laser);
  playerLasers.push(laser);
}

// Move Player Lasers
function movePlayerLasers() {
  playerLasers.forEach((laser, index) => {
    const currentY = parseFloat(laser.style.bottom);
    const newY = currentY + 5;
    laser.style.bottom = `${newY}px`;

    // Remove laser if it goes off-screen
    if (newY > 400) {
      laser.remove();
      playerLasers.splice(index, 1);
    }

    // Check for collisions with enemies
    enemies.forEach((enemy, enemyIndex) => {
      if (checkCollision(laser, enemy)) {
        laser.remove();
        enemy.remove();
        playerLasers.splice(index, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;

        // Check if all enemies are defeated
        if (enemies.length === 0) {
          alert("You Win! All enemies defeated.");
          resetGame();
        }
      }
    });
  });
}

// Shoot Enemy Laser
function shootEnemyLaser() {
  if (enemies.length === 0 || gameOver) return;

  // Randomly select an enemy to shoot
  const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
  const laser = document.createElement('div');
  laser.classList.add('laser');
  laser.style.left = `${parseFloat(randomEnemy.style.left) + 15}px`;
  laser.style.top = `${parseFloat(randomEnemy.style.top) + 20}px`;
  lasersContainer.appendChild(laser);
  enemyLasers.push(laser);
}

// Move Enemy Lasers
function moveEnemyLasers() {
  enemyLasers.forEach((laser, index) => {
    const currentY = parseFloat(laser.style.top);
    const newY = currentY + 5;
    laser.style.top = `${newY}px`;

    // Remove laser if it goes off-screen
    if (newY > 400) {
      laser.remove();
      enemyLasers.splice(index, 1);
    }

    // Check for collisions with player
    if (checkCollision(laser, player)) {
      gameOver = true;
      alert("Game Over! You were hit by an enemy laser.");
      resetGame();
    }
  });
}

// Check Collision
function checkCollision(laser, target) {
  const laserRect = laser.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  return (
    laserRect.left < targetRect.right &&
    laserRect.right > targetRect.left &&
    laserRect.top < targetRect.bottom &&
    laserRect.bottom > targetRect.top
  );
}

// Reset Game
function resetGame() {
  gameOver = false;
  playerX = 280;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  enemiesContainer.innerHTML = '';
  lasersContainer.innerHTML = '';
  playerLasers = [];
  enemyLasers = [];
  enemies = [];
  createEnemies();
}

// Game Loop
function gameLoop() {
  if (!gameOver) {
    moveEnemies();
    movePlayerLasers();
    moveEnemyLasers();
    requestAnimationFrame(gameLoop);
  }
}

// Initialize Game
createEnemies();
setInterval ( shootEnemyLaser, 1000); // Enemies shoot every second
gameLoop();
