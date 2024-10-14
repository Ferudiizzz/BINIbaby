let player = document.getElementById("player");
let item = document.getElementById("item");
let obstacle = document.getElementById("obstacle");
let scoreDisplay = document.getElementById("score");
let score = 0;
let gameArea = document.getElementById("gameArea");

let itemY = -50; // Initial item position
let obstacleY = -50; // Initial obstacle position
let itemSpeed = 4; // Speed at which the item moves
let obstacleSpeed = 5; // Speed at which the obstacle moves

// Move player based on mouse movement
gameArea.addEventListener("mousemove", function (e) {
    let rect = gameArea.getBoundingClientRect();
    let mouseX = e.clientX - rect.left; // Get mouse position within game area

    // Keep player within game area bounds
    if (mouseX >= 0 && mouseX <= 350) {
        player.style.left = mouseX + "px";
    }
});

// Generate random X position within bounds
function getRandomXPosition(max) {
    return Math.floor(Math.random() * max);
}

// Game loop to move items and detect collisions
function gameLoop() {
    // Move item down
    itemY += itemSpeed;
    if (itemY > 600) {
        itemY = -50;
        item.style.left = getRandomXPosition(320) + "px"; // Reset to a random position
    }
    item.style.top = itemY + "px";

    // Move obstacle down
    obstacleY += obstacleSpeed;
    if (obstacleY > 600) {
        obstacleY = -50;
        obstacle.style.left = getRandomXPosition(300) + "px"; // Reset to a random position
    }
    obstacle.style.top = obstacleY + "px";

    // Get the player's current position
    let playerX = parseInt(player.style.left);

    // Hitbox dimensions
    let itemWidth = 40;
    let itemHeight = 40;
    let obstacleWidth = 30; // Adjust as per your obstacle size
    let obstacleHeight = 10; // Adjust as per your obstacle size

    // Detect collision with item
    if (
        playerX < parseInt(item.style.left) + itemWidth &&
        playerX + 50 > parseInt(item.style.left) &&
        550 < itemY + itemHeight &&
        600 > itemY
    ) {
        score++;
        itemY = -50; // Reset item position
        item.style.left = getRandomXPosition(360) + "px"; // Random new position
        scoreDisplay.textContent = "Score: " + score;
    }

    // Detect collision with obstacle
    if (
        playerX < parseInt(obstacle.style.left) + obstacleWidth &&
        playerX + 50 > parseInt(obstacle.style.left) &&
        520 < obstacleY + obstacleHeight &&
        600 > obstacleY
    ) {
        alert("Game Over! Final Score: " + score);
        score = 0;
        scoreDisplay.textContent = "Score: " + score;
        obstacleY = -50; // Reset obstacle position
        itemY = -50; // Reset item position
    }

    requestAnimationFrame(gameLoop);
}

gameLoop(); // Start the game loop
