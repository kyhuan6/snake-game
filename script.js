document.addEventListener('DOMContentLoaded', () => {
    // Game canvas setup
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const scoreElement = document.getElementById('score');

    // Game settings
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = tileCount * gridSize;
    canvas.height = tileCount * gridSize;

    // Game state
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameSpeed = 150; // milliseconds
    let gameRunning = false;
    let gameLoop;

    // Initialize game
    function initGame() {
        // Initialize snake with 3 segments
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreElement.textContent = score;
        generateFood();
        drawGame();
    }

    // Generate food at random position
    function generateFood() {
        // Generate random coordinates
        let foodX = Math.floor(Math.random() * tileCount);
        let foodY = Math.floor(Math.random() * tileCount);
        
        // Check if food is on snake
        const isOnSnake = snake.some(segment => segment.x === foodX && segment.y === foodY);
        
        if (isOnSnake) {
            // If food is on snake, generate again
            generateFood();
        } else {
            food = { x: foodX, y: foodY };
        }
    }

    // Draw game elements
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Head is a different color
            if (index === 0) {
                ctx.fillStyle = '#2E7D32'; // Dark green for head
            } else {
                ctx.fillStyle = '#4CAF50'; // Green for body
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });
        
        // Draw food
        ctx.fillStyle = '#F44336'; // Red for food
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    }

    // Move snake
    function moveSnake() {
        // Update direction based on nextDirection
        direction = nextDirection;
        
        // Create new head based on current direction
        const head = { ...snake[0] };
        
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // Add new head to beginning of snake array
        snake.unshift(head);
        
        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            scoreElement.textContent = score;
            
            // Generate new food
            generateFood();
            
            // Increase game speed slightly
            if (gameSpeed > 50) {
                gameSpeed -= 2;
            }
        } else {
            // Remove tail if snake didn't eat food
            snake.pop();
        }
    }

    // Check for collisions
    function checkCollisions() {
        const head = snake[0];
        
        // Check wall collisions
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return true;
        }
        
        // Check self collisions (starting from 4th segment)
        for (let i = 4; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }

    // Game over
    function gameOver() {
        clearInterval(gameLoop);
        gameRunning = false;
        startButton.textContent = 'Start Game';
        
        // Display game over message
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 15);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
    }

    // Main game loop
    function runGame() {
        moveSnake();
        
        if (checkCollisions()) {
            gameOver();
            return;
        }
        
        drawGame();
    }

    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
        // Only change direction if game is running
        if (!gameRunning) return;
        
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') {
                    nextDirection = 'up';
                }
                break;
            case 'ArrowDown':
                if (direction !== 'up') {
                    nextDirection = 'down';
                }
                break;
            case 'ArrowLeft':
                if (direction !== 'right') {
                    nextDirection = 'left';
                }
                break;
            case 'ArrowRight':
                if (direction !== 'left') {
                    nextDirection = 'right';
                }
                break;
        }
    });

    // Start button event listener
    startButton.addEventListener('click', () => {
        if (gameRunning) {
            // Pause game
            clearInterval(gameLoop);
            gameRunning = false;
            startButton.textContent = 'Resume Game';
        } else {
            // Start or resume game
            if (snake.length === 0) {
                initGame();
            }
            
            gameRunning = true;
            startButton.textContent = 'Pause Game';
            gameLoop = setInterval(runGame, gameSpeed);
        }
    });

    // Reset button event listener
    resetButton.addEventListener('click', () => {
        clearInterval(gameLoop);
        gameRunning = false;
        startButton.textContent = 'Start Game';
        initGame();
    });

    // Initialize game on load
    initGame();
});