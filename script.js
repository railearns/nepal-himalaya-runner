const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const flag = document.getElementById("flag");
const scoreSpan = document.getElementById("score");
const bestScoreSpan = document.getElementById("best-score");
const restartBtn = document.getElementById("restart");

let isJumping = false;
let velocityY = 0;
let gravity = -0.6;
let jumpStrength = 10;
let groundY = 40; // ground height
let playerY = 40; // starting from ground
let score = 0;
let bestScore = parseInt(localStorage.getItem("mountainBest") || "0", 10);
bestScoreSpan.textContent = bestScore;

let gameSpeed = 4;
let obstacleX = 600;
let flagX = 900;
let gameOver = false;

function resetGame() {
  score = 0;
  scoreSpan.textContent = score;
  obstacleX = 600;
  flagX = 900;
  playerY = groundY;
  velocityY = 0;
  isJumping = false;
  gameOver = false;
  gameSpeed = 4;
}

function jump() {
  if (!isJumping && !gameOver) {
    isJumping = true;
    velocityY = jumpStrength;
  }
}

document.body.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (gameOver) {
      resetGame();
    } else {
      jump();
    }
  }
});

restartBtn.addEventListener("click", () => {
  resetGame();
});

function updatePlayer() {
  if (isJumping) {
    velocityY += gravity;
    playerY += velocityY;

    if (playerY <= groundY) {
      playerY = groundY;
      isJumping = false;
      velocityY = 0;
    }
  }

  player.style.bottom = playerY + "px";
}

function updateObstacle() {
  obstacleX -= gameSpeed;
  if (obstacleX < -40) {
    obstacleX = 600 + Math.random() * 200;
  }
  obstacle.style.right = (600 - obstacleX) + "px";
}

function updateFlag() {
  flagX -= gameSpeed;
  if (flagX < -40) {
    flagX = 600 + 200 + Math.random() * 200;
  }
  flag.style.right = (600 - flagX) + "px";
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  const flagRect = flag.getBoundingClientRect();

  // Rock collision (game over)
  if (
    playerRect.left < obstacleRect.right &&
    playerRect.right > obstacleRect.left &&
    playerRect.bottom > obstacleRect.top &&
    playerRect.top < obstacleRect.bottom
  ) {
    gameOver = true;
  }

  // Flag collision (score +1)
  if (
    playerRect.left < flagRect.right &&
    playerRect.right > flagRect.left &&
    playerRect.bottom > flagRect.top &&
    playerRect.top < flagRect.bottom
  ) {
    score++;
    scoreSpan.textContent = score;
    if (score > bestScore) {
      bestScore = score;
      bestScoreSpan.textContent = bestScore;
      localStorage.setItem("mountainBest", bestScore);
    }
    flagX = 600 + 200 + Math.random() * 200;
    // Increase difficulty a bit
    gameSpeed += 0.2;
  }
}

function gameLoop() {
  if (!gameOver) {
    updatePlayer();
    updateObstacle();
    updateFlag();
    checkCollision();
  }
  requestAnimationFrame(gameLoop);
}

resetGame();
gameLoop();
