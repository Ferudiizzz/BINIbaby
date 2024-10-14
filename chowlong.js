// Canvas setup
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

// Player image
var playerready = false;
var playerimage = new Image();
playerimage.onload = function () {
    playerready = true;
};
playerimage.src = "images/chowlong.png"; // Ensure this is a cute player image

// Item (obstacle) image
var obstacleImage = new Image();
obstacleImage.src = "images/cherry.png"; // Change this to an obstacle image

// Ground image
var groundImage = new Image();
groundImage.src = "images/grass.png"; // Path to your ground image

// Cloud image
var cloudImage = new Image();
cloudImage.src = "images/cloud.png"; // Path to your cloud image

// Objects
var player = {
    x: 50,
    y: canvas.height - 70,
    width: 100,
    height: 70,
    speed: 5,
    jumpHeight: 23,
    gravity: 1.5,
    velocityY: 0,
    isGrounded: true,
    hitbox: {
        x: 50 + 20, // Adjusted for a more precise hitbox
        y: canvas.height - 70 + 20,
        width: 50, // Smaller width for better precision
        height: 30 // Smaller height for better precision
    }
};

// Cloud and ground positions
var cloudX = canvas.width; // Start with the cloud off-screen to the right
var groundX1 = 0; // First ground position
var groundX2 = canvas.width; // Second ground position for seamless looping

var obstacles = [];
var score = 0;
var isGameOver = false;

// Movement keys
var keys = {};

// Generate obstacles
function generateObstacles() {
    if (Math.random() < 0.01) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 50,
            width: 40,
            height: 40,
            hitbox: {
                x: canvas.width,
                y: canvas.height - 50,
                width: 40, // Match obstacle width
                height: 40  // Match obstacle height
            }
        });
    }
}

// Handle keys
addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
}, false);

// Reset the game
function reset() {
    player.x = 50;
    player.y = canvas.height - 70;
    player.velocityY = 0;
    score = 0;
    obstacles = [];
    isGameOver = false;
    cloudX = canvas.width; // Reset cloud position
    groundX1 = 0; // Reset first ground position
    groundX2 = canvas.width; // Reset second ground position
    document.getElementById('scoreDisplay').innerText = score;

    // Hide the restart button
    document.getElementById('restartButton').style.display = 'none';
}

// Show the restart button
function showRestartButton() {
    document.getElementById('restartButton').style.display = 'block';
}

// Update
var update = function () {
    if (!isGameOver) {
        // Jump mechanics
        if (!player.isGrounded) {
            player.velocityY += player.gravity;
            player.y += player.velocityY;

            // Check if the player is on the ground
            if (player.y >= canvas.height - 70) {
                player.y = canvas.height - 70;
                player.isGrounded = true;
                player.velocityY = 0;
            }
        }

        // Handle jump
        if (keys[32] && player.isGrounded) { // Space key for jump
            player.velocityY = -player.jumpHeight;
            player.isGrounded = false;
        }

        // Handle horizontal movement
        if (keys[37] || keys[65]) {
            player.x -= player.speed; // Move left
        }
        if (keys[39] || keys[68]) {
            player.x += player.speed; // Move right
        }

        // Update hitbox position
        player.hitbox.x = player.x + 20; // Adjust for hitbox position
        player.hitbox.y = player.y + 20; // Adjust for hitbox position

        // Move obstacles
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].x -= player.speed; // Move left

            // Update obstacle hitbox position
            obstacles[i].hitbox.x = obstacles[i].x; 
            obstacles[i].hitbox.y = obstacles[i].y;

            // Check for collision
            if (player.hitbox.x < obstacles[i].hitbox.x + obstacles[i].hitbox.width &&
                obstacles[i].hitbox.x < player.hitbox.x + player.hitbox.width &&
                player.hitbox.y < obstacles[i].hitbox.y + obstacles[i].hitbox.height &&
                obstacles[i].hitbox.y < player.hitbox.y + player.hitbox.height) {
                isGameOver = true; // End the game on collision
                showRestartButton(); // Show restart button when game is over
            }

            // Remove obstacle if it goes off screen
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
                document.getElementById('scoreDisplay').innerText = score; // Update score display
                i--;
            }
        }

        // Update cloud and ground positions for opposite movement
        cloudX -= player.speed * 0.5; // Move cloud slower
        groundX1 -= player.speed; // Move first ground position
        groundX2 -= player.speed; // Move second ground position

        // Loop ground positions for continuous movement
        if (groundX1 <= -canvas.width) groundX1 = canvas.width; // Reset first ground position
        if (groundX2 <= -canvas.width) groundX2 = canvas.width; // Reset second ground position

        // Loop cloud position for continuous movement
        if (cloudX <= -200) cloudX = canvas.width; // Reset cloud position if it goes off-screen

        generateObstacles(); // Generate new obstacles
    }
};

// Render
var render = function () {
    ctx.fillStyle = "#f3e5f5"; // Light purple background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cloud in the background
    if (cloudImage.complete) {
        ctx.drawImage(cloudImage, cloudX, 50, 200, 100); // Adjust position and size as needed
    }

    // Draw ground using images for seamless effect
    ctx.drawImage(groundImage, groundX1, canvas.height - 70, canvas.width, 70); // Draw first ground image
    ctx.drawImage(groundImage, groundX2, canvas.height - 70, canvas.width, 70); // Draw second ground image

    if (playerready) {
        ctx.drawImage(playerimage, player.x, player.y, player.width, player.height); // Draw player image
    }

    for (var i = 0; i < obstacles.length; i++) {
        ctx.drawImage(obstacleImage, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height); // Draw obstacles
    }

    // Game Over message
    if (isGameOver) {
        ctx.fillStyle = "#ff69b4"; // Hot pink color
        ctx.font = "48px Pacifico";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = "24px Pacifico";
        ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
    }
};

// Main loop
var main = function () {
    update();
    render();
};

// Initialize
reset();
setInterval(main, 20);

// Restart button functionality
document.getElementById('restartButton').onclick = function() {
    reset(); // Reset the game state
};
