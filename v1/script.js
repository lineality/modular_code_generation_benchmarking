/*
JaveScript Snake Game

note: as a rule: default fonts only, NO web fonts, NO new fonts, NO fancy fonts,
NO extra fonts.

TODO:

a second monster-snake that is automated, 
where the player-snake and monster-snake can block each-other. 
monster snack crashes if it hits the player snake

1. start of duneon layout with doors;

note: enter and exit door locations will need to be saved in 'state' per room
when going between rooms, which primarility is the location of the doors,
other things such as monsters or maze-layout can be done later.

- entrance at random spot from wall
- clearly mark where the doorway is
- make sure wall located in the right place
(maybe related to 'unit' problem)
- make sure walls work as barriers

2. make monster-snakes in the room with-which the player-snake cannot collide

3. dungeon state

4. dungeon map in miniature off to the side

4. display game over


6. what in index.html is generated these errors?
what is requesting fonts?


ancilary goals for later
2. default food and less frequent special effect foods
3. display effect of square
5. not all food squares are active: fix this


Dugeon Puzzle Rooms:
- maze: pick a path
- monster-treasure rooms
- trace shape
- 

monsters:
- 

traps:
- 

teleport cubes in dungeon rooms

svg render snake?
- gif?
- 

TODO:
- pairs of special food items, e.g. fast and slow
- mystery food?
- 

TODO: Gif Dungeon of Snake
- Add Doors
- 
- pairs of food items: fast and slow
- 
- mystery food

- gif art cheesy wonderfulneww
- maze rooms
- 
- treasures
- traps
- monsters
- pets/allies
- 
- tron wall combat challenge
- 


Puzzle/Rooms:
- 


Request for font "Noto Sans Mono" blocked at visibility level 2 (requires 3)
index.html
Request for font "Noto Serif" blocked at visibility level 2 (requires 3)
index.html
Request for font "Noto Naskh Arabic" blocked at visibility level 2 (requires 3)
index.html
Request for font "Noto Sans" blocked at visibility level 2 (requires 3)
index.html
Request for font "Open Sans" blocked at visibility level 2 (requires 3)


shape chllenge (from color square?):
make the snake into a number shape to earch extra points

Note:
https://html-color.codes/grey

Gainsboro Grey
#dcdcdc

Dungeon of Snake:
- Tron Puzzle
- 


auto-generate mazes (in a maze room)

auto-select room type

'ai' for snake-monsters


tasks: 
1. fix monster-snake crash detection
e.g. is there any system for seeing if the monster-head
is touching the player-snake body?

*/



///////////////////////////
// DOM Domain Object Model
///////////////////////////
/*
each dungeon room has a puzzle
if the puzzle is solved then the door appears.
when you go through the door you enter a new dungeon room
with e.g. a randomly selected puzzle (see two below)

puzzles:
1. eat N(number of) food squares
2. cause the monster-snake to crash (into player body)
3. (future) 'bite' monster before it bites you
*/

document.addEventListener('DOMContentLoaded', (event) => {
    // Your JavaScript code here
    const gameBoard = document.getElementById('gameCanvas');
    // rest of your code...


    // Get the canvas element and its context for drawing
    const ctx = gameBoard.getContext('2d');

    ctx.font = 'arial';
    
    const maxWidth = 600; // Maximum width of the canvas
    const maxHeight = 600; // Maximum height of the canvas
    const minWidth = 200; // Minimum width of the canvas
    const minHeight = 200; // Minimum height of the canvas

    const foodSize = 20; // New variable for food size
    const snakeSize = 20; // or whatever your segment size is
    const doorLength = snakeSize * 2; // Door's length, 2 times the snake's head size
    const doorThickness = snakeSize/2; // Door's thickness, equal to the snake's head size


    // Additional variables to handle new food effects
    let gameSpeed = 100; // Initial game speed
    let boundaryEffect = false; // Initial boundary behavior
    let score = 0;
    let effectMessage = ''; // Initialize message variable
    
    // Set the initial position and color of the food
    let food = randomFoodPosition();
    
    // Define head globally or within a broader scope
    let snake = [{ x: 10, y: 10 }];
    let head = { x: snake[0].x, y: snake[0].y };
    
    ///////////
    // Puzzles
    ///////////
    let currentPuzzle = null;
    let puzzles = {
        // set target here for how many food-squares to eat
        eatFood: { type: 'eatFood', foodEaten: 0, target: 3 },
        crashMonster: { type: 'crashMonster', monsterCrashed: false }
    };
    
    function initializePuzzle() {
        // Select a random puzzle
        let puzzleTypes = Object.keys(puzzles);
        let selectedPuzzle = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
        currentPuzzle = {...puzzles[selectedPuzzle]}; // Clone the puzzle object

        // Reset puzzle specific states
        if(currentPuzzle.type === 'eatFood') {
            currentPuzzle.foodEaten = 0;
        } else if(currentPuzzle.type === 'crashMonster') {
            currentPuzzle.monsterCrashed = false;
        }
    }

    // Call this in goToNextRoom() and at game initialization
    initializePuzzle();
        
    // Update this in the advanceSnake function for 'eatFood' puzzle
    // if (currentPuzzle.type === 'eatFood' && /* food is eaten */) {
    //     currentPuzzle.foodEaten++;
    // }
    // Update this in the advanceSnake function for 'eatFood' puzzle
    if (currentPuzzle.type === 'eatFood' && head.x === food.x && head.y === food.y) {
        currentPuzzle.foodEaten++;
    }
        

    // Update this for 'crashMonster' puzzle
    /*
    For one type of puzzle, a monster crashing into your body defeats the monster
    in another type, the monster 'bites' you.
    
    Note: monster crashing into player-body and player crashing into monster-body
    are separate events with different outcomes.
    */
    // Handle Monster Collision
    function handleMonsterCollision() {
        if (currentPuzzle.type === 'crashMonster') {
            currentPuzzle.monsterCrashed = true;
            // Additional logic for handling the collision
            // For example, display a message or transition to the next level
            goToNextRoom();
        }
    }
        
    // function isPuzzleCompleted() {
    //     if (currentPuzzle.type === 'eatFood') {
    //         return currentPuzzle.foodEaten >= currentPuzzle.target;
    //     } else if (currentPuzzle.type === 'crashMonster') {
    //         return currentPuzzle.monsterCrashed;
    //     }
    //     return false;
    // }

    function isPuzzleCompleted() {
        if (currentPuzzle.type === 'eatFood') {
            return currentPuzzle.foodEaten >= currentPuzzle.target;
        } else if (currentPuzzle.type === 'crashMonster') {
            return currentPuzzle.monsterCrashed;
        }
        return false;
    }
            
    
    //////////
    // Doors
    /////////
    
    // Define the door object

    // Randomly choose a wall: 0 = top, 1 = right, 2 = bottom, 3 = left
    let wall = Math.floor(Math.random() * 4);
    let doorWidth = 20; // Adjust as needed
    let doorHeight = 20; // Adjust as needed
    
    // Assuming wall is already determined: 0 = top, 1 = right, 2 = bottom, 3 = left
    let door = {
        x: 0,
        y: 0,
        width: (wall === 1 || wall === 3) ? doorThickness : doorLength, // Width for left/right walls
        height: (wall === 0 || wall === 2) ? doorThickness : doorLength, // Height for top/bottom walls
        color: 'gold', // Color of the door
        visible: false, // Add this property        
      };


    // Function to initialize the door
    function initializeDoor() {
        // Randomly choose a wall: 0 = top, 1 = right, 2 = bottom, 3 = left
        let wall = Math.floor(Math.random() * 4);

        // Set door dimensions and position based on the wall
        door.width = (wall === 1 || wall === 3) ? doorThickness : doorLength;
        door.height = (wall === 0 || wall === 2) ? doorThickness : doorLength;

        // Adjust position based on the wall
        switch (wall) {
            case 0: // Top wall
                door.x = Math.random() * (gameBoard.width - doorLength);
                door.y = 0;
                break;
            case 1: // Right wall
                door.x = gameBoard.width - doorThickness;
                door.y = Math.random() * (gameBoard.height - doorLength);
                break;
            case 2: // Bottom wall
                door.x = Math.random() * (gameBoard.width - doorLength);
                door.y = gameBoard.height - doorThickness;
                break;
            case 3: // Left wall
                door.x = 0;
                door.y = Math.random() * (gameBoard.height - doorLength);
                break;
        }
    }

    // Call initializeDoor() in your game initialization logic
    initializeDoor();
        
        
    // Function to draw the door
    function drawDoor() {
        ctx.fillStyle = door.color;
        ctx.fillRect(door.x, door.y, door.width, door.height);
    }
        
    // function drawDoor() {
    //     ctx.fillStyle = '#000000'; // Door color (black)
    //     ctx.fillRect(door.x, door.y, door.width, door.height);
    // }

    // Check if the snake's head collides with the door
    function checkDoorCollision() {
        const head = snake[0]; // Assuming snake[0] is the head
        if (head.x < door.x + door.width &&
            head.x + snakeSize > door.x &&
            head.y < door.y + door.height &&
            head.y + snakeSize > door.y) {
            return true;
        }
        return false;
    }

    
    function handleDoorCollision() {
        if (checkDoorCollision() && door.visible) {
            // Logic for what happens when the door is reached
            // E.g., increase score, go to next level, etc.
            console.log("Door reached!"); // Replace with actual logic
            goToNextRoom(); // Go to the next room instead of restarting the game
            
        }
    }


    
    
    // Function to restart the game
    function restartGame() {
        snake = [{ x: 10, y: 10 }]; // Reset the snake's position
        score = 0; // Reset the score
        
        monsterSnake = [{ x: 50, y: 50 }]; // Reset monster-snake's position
        
        updateGameInfo(`Score: ${score}`); // Update the score display
        main(); // Restart the main game loop
    }
            
        
    // Initialize game info with score at game start
    updateGameInfo(`Score: ${score}`);

    // Function to generate a random position for food
    function randomFoodPosition() {
        const gridSize = gameBoard.width / 10;
        const colors = ['purple', 'blue', 'grey', 'red', 'yellow', 'orange'];
        return {
            x: Math.floor(Math.random() * gridSize) * 10,
            y: Math.floor(Math.random() * gridSize) * 10,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }



    // Initialize the snake as an array of objects, starting with one segment


    function checkCollision() {
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }


    // Direction vectors: dx (horizontal movement), dy (vertical movement)
    let dx = 10;
    let dy = 0;



    function clearBoard() {
        /* 
        https://html-color.codes/grey
        background colours
        
        orange
        '#FFD580'
        
        light grey
        dcdcdc
        
        dark grey
        a9a9a9
        
        */
        ctx.fillStyle = '#a9a9a9';  // background color
        ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    
        // Display text above the game arena
        ctx.fillStyle = 'black'; // Text color
        ctx.font = '16px Arial'; // Font
        ctx.fillText('Dungeon of Snake 50-49c', 20, 20); // Position the text
    }


    // Draws the snake on the canvas
    // Draw the snake using foodSize for each part
    function drawSnake() {
        ctx.fillStyle = 'green';
        snake.forEach(part => {
            ctx.fillRect(part.x, part.y, foodSize, foodSize); // Use foodSize
        });
    }


    

    
    // Updates the position of the snake
    // Modified advanceSnake function to incorporate new food effects
    function advanceSnake() {
        
        head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        snake.unshift(head); // Add new head

        // Check for collision with the monster snake
        if (checkMonsterCollision()) {
            if (currentPuzzle.type === 'crashMonster') {
                currentPuzzle.monsterCrashed = true;
            }
            // Optionally, you might want to handle what happens after the collision
            // For example, end the game or reset the room
        }
        
        // Check if snake has eaten the food considering the entire food square
        if (head.x < food.x + foodSize && head.x + foodSize > food.x &&
            head.y < food.y + foodSize && head.y + foodSize > food.y) {
            // Instead of growing by one unit, grow by a defined growth factor
            let growthFactor = 3; // For example, grow by 3 segments
            for (let i = 0; i < growthFactor; i++) {
                snake.push({}); // Add additional segments at the end of the snake
            }
            score += 1; // Increase score
            updateGameInfo(`Score: ${score}`); // Update the score display
            food = randomFoodPosition();
            
            // Update puzzle state if the current puzzle is 'eatFood'
            if (currentPuzzle.type === 'eatFood') {
                currentPuzzle.foodEaten++;
            }        
            
        } else {
            snake.pop(); // Only remove the last segment if the snake hasn't eaten
        }

        // Check for collision with the snake's body
        checkCollision();
    }


    function handleFoodEffect() {
        switch (food.color) {
            case 'purple':
                effectMessage = 'Speed change';
                gameSpeed = Math.random() > 0.5 ? gameSpeed - 20 : gameSpeed + 20;
                gameSpeed = Math.max(10, Math.min(gameSpeed, 200)); // Keep speed within bounds
                break;
                
            case 'blue':
                effectMessage = 'Shrink or Grow';
                const change = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
                if (Math.random() > 0.5) {
                    growSnake(change);
                } else {
                    shrinkSnake(change);
                }
                break;
                
            case 'grey':
                effectMessage = 'Mystery Multiple Food Spawn';                
                spawnExtraFood(); // Implement spawning logic for extra food
                break;
                
            // case 'red':
            //     effectMessage = 'Board Size Warp';                                
            //     changeBoundarySize(); // Implement boundary size change
            //     break;
                
            // case 'brown':
            //     effectMessage = 'Direction Change';                                
            //     randomDirectionChange(); // Implement random direction change
            //     break;
                
            // case 'orange':
            //     effectMessage = 'Walls Become Loops'
            //     boundaryEffect = !boundaryEffect; // Toggle wall behavior
                break;
        }
        // Update the game info with the new score
        updateGameInfo(`Score: ${score}`);
    }

    
    function growSnake(size) {
        for (let i = 0; i < size; i++) {
            snake.push({...snake[snake.length - 2]}); // Add a segment at the end
        }
    }

    function shrinkSnake(size) {
        snake.length = Math.max(1, snake.length - size); // Remove segments from the end
    }


    // Draws the food on the canvas drawFood function to reflect different food colors
    // Modify drawFood and drawExtraFood functions to use foodSize
    function drawFood() {
        ctx.fillStyle = food.color;
        ctx.fillRect(food.x, food.y, foodSize, foodSize);
    }



    let speedBoost = false;
    
    // Event listener for keyboard inputs to change the snake's direction
    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft" || 
            event.key === "ArrowUp" || event.key === "ArrowDown") {
            speedBoost = true;
        }
        changeDirection(event);
    });

    document.addEventListener("keyup", function(event) {
        speedBoost = false;
    });

    
    gameCanvas.addEventListener("keydown", changeDirection);

    // Function to change the direction of the snake
    function changeDirection(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        // Change the direction based on the key pressed
        // Prevents the snake from reversing directly into itself
        if (event.keyCode === LEFT_KEY && dx === 0) {
            dx = -10;
            dy = 0;
        } else if (event.keyCode === UP_KEY && dy === 0) {
            dx = 0;
            dy = -10;
        } else if (event.keyCode === RIGHT_KEY && dx === 0) {
            dx = 10;
            dy = 0;
        } else if (event.keyCode === DOWN_KEY && dy === 0) {
            dx = 0;
            dy = 10;
        }
    }

    // Grey Food Effect: Spawn single or pair of colored food cubes
    let extraFood = []; // Array to store extra food

    function spawnExtraFood() {
        const extraFoodCount = Math.random() > 0.5 ? 1 : 2;
        for (let i = 0; i < extraFoodCount; i++) {
            extraFood.push(randomFoodPosition());
        }
    }

    // You also need to draw these extra foods
    function drawExtraFood() {
        extraFood.forEach(foodItem => {
            ctx.fillStyle = foodItem.color;
            ctx.fillRect(foodItem.x, foodItem.y, foodSize, foodSize);
        });
    }


    // Red Food Effect: Change Boundary Size
    function changeBoundarySize() {
        const changeAmount = 20;
        if (Math.random() > 0.5) {
            gameBoard.width = Math.min(gameBoard.width + changeAmount, maxWidth);
            gameBoard.height = Math.min(gameBoard.height + changeAmount, maxHeight);
        } else {
            gameBoard.width = Math.max(gameBoard.width - changeAmount, minWidth);
            gameBoard.height = Math.max(gameBoard.height - changeAmount, minHeight);
        }
    }

    // Brown Food Effect: Change Direction Randomly
    function randomDirectionChange() {
        const directions = [[-10, 0], [10, 0], [0, -10], [0, 10]];
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * directions.length);
        } while (directions[randomIndex][0] === -dx && directions[randomIndex][1] === -dy);

        [dx, dy] = directions[randomIndex];
    }

    // ending game
    function didGameEnd() {
        if (snake.length === 0) return false; // Add this check

        // Check collision with the wall
        if (snake[0].x < 0 || snake[0].x >= gameBoard.width || 
            snake[0].y < 0 || snake[0].y >= gameBoard.height) {
            return true;
        }

        // Check collision with itself
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true;
            }
        }

        return false;
    }
    
    // function didGameEnd() {
    //     // Check collision with the wall
    //     if (snake[0].x < 0 || snake[0].x >= gameBoard.width || snake[0].y < 0 || snake[0].y >= gameBoard.height) {
    //         return true;
    //     }

    //     // Check collision with itself
    //     for (let i = 1; i < snake.length; i++) {
    //         if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
    //             return true;
    //         }
    //     }

    //     return false;
    // }
    

    function drawGameOver() {
        ctx.fillStyle = 'red'; // Text color
        ctx.font = '24px monospace'; // Use a generic monospace font
        ctx.textAlign = 'center'; // Align text in the center
        ctx.fillText('Game Over', gameBoard.width / 2, gameBoard.height / 2); // Position the text
        ctx.fillText(`Final Score: ${score}`, gameBoard.width / 2, gameBoard.height / 2 + 30); // Display the score below
        
        // Update game info with the final score
        updateGameInfo(`Game Over. Final Score: ${score}`);
    }

    function checkExtraFoodEaten() {
        extraFood = extraFood.filter(foodItem => {
            if (snake[0].x < foodItem.x + foodSize && snake[0].x + foodSize > foodItem.x &&
                snake[0].y < foodItem.y + foodSize && snake[0].y + foodSize > foodItem.y) {
                // Handle extra food effect
                return false;
            }
            return true;
        });
    }

    
    // Function to transition to the next room
    function goToNextRoom() {
        // Example logic for going to the next room
        console.log("Transitioning to the next room...");

        // Reset or modify the snake's position
        snake = [{ x: 10, y: 10 }];

        // Reset or modify game state variables as needed
        // score = 0;
        updateGameInfo(`Score: ${score}`);
        
        // Reinitialize the door for the next room
        initializeDoor();

        // Additional logic for changing the game environment for the new room
        // ...
        // Restart the game loop
        main();
    }
        
    
    function updateGameInfo(text) {
        const infoElement = document.getElementById('gameInfo');
        infoElement.innerText = text;
        infoElement.style.fontSize = '48px'; // Set font size to 24px
        infoElement.style.fontFamily = 'Arial'; // Set font family to Arial
    }





    let monsterSnake = [{ x: 50, y: 50 }]; // Initialize with different starting position

    // Monster Snake movement
    function moveMonsterSnake() {
        // Advanced logic for monster-snake movement
        // Implement a more sophisticated algorithm if needed
        // For now, we use a simple random direction change
        const directions = [[-10, 0], [10, 0], [0, -10], [0, 10]];
        let randomIndex = Math.floor(Math.random() * directions.length);
        monsterSnake.unshift({
            x: monsterSnake[0].x + directions[randomIndex][0], 
            y: monsterSnake[0].y + directions[randomIndex][1]
        });
        monsterSnake.pop(); // Keep the monster snake size constant
    }
    
    
    // function moveMonsterSnake() {
    //     // Logic to change monsterSnake's direction
    //     // For simplicity, let's use random direction change for now
    //     const directions = [[-10, 0], [10, 0], [0, -10], [0, 10]];
    //     let randomIndex = Math.floor(Math.random() * directions.length);
    //     monsterSnake.unshift({
    //         x: monsterSnake[0].x + directions[randomIndex][0], 
    //         y: monsterSnake[0].y + directions[randomIndex][1]
    //     });
    //     monsterSnake.pop(); // Keep the monster snake size constant
    // }


    function drawMonsterSnake() {
        ctx.fillStyle = 'red'; // Different color for monster-snake
        monsterSnake.forEach(part => {
            ctx.fillRect(part.x, part.y, snakeSize, snakeSize); // Assuming snakeSize is your segment size
        });
    }


    // function checkMonsterCollision() {
    //     const head = snake[0];
    //     return monsterSnake.some(segment => head.x === segment.x && head.y === segment.y);
    // }


    // // Improved checkMonsterCollision function
    // function checkMonsterCollision() {
    //     const head = snake[0];
    //     for (let segment of monsterSnake) {
    //         // Check if the head of the snake collides with any part of the monster-snake
    //         if (head.x === segment.x && head.y === segment.y) {
    //             handleMonsterCollision(); // Call this when a collision occurs
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // Improved checkMonsterCollision function
    function checkMonsterCollision() {
        const monsterHead = monsterSnake[0];
        for (let segment of snake) {
            // Check if the head of the monster-snake collides with any part of the player-snake
            if (monsterHead.x === segment.x && monsterHead.y === segment.y) {
                handleMonsterCollision(); // Call this when a collision occurs
                return true;
            }
        }
        return false;
    }



    // function didGameEnd() {
    //     // Existing collision checks...
    //     // Add a check for collision with the monster snake
    //     return checkMonsterCollision();
    // }


//     // Main game loop function, a.k.a. 'game loop'
//     function main() {
        
//         // check for 'Game Over'
//         if (didGameEnd()) {
//             drawGameOver();
//             return; // Stop the game loop
//         }
        
//         // check puzzle state: is puzzle completed yet?
//         if (isPuzzleCompleted() && !door.visible) {
//             door.visible = true;
//         }
        
//         // Draw the door if it's visible
//         if (door.visible) {
//             drawDoor();
//         }
        
//         // Going Through Door
//         if (checkDoorCollision()) {
//             handleDoorCollision(); // Handle the door collision appropriately
//             return;
//         }
        
//         setTimeout(function onTick() {
//             clearBoard();
//             drawFood();
//             drawExtraFood(); // Draw extra food
//             checkExtraFoodEaten(); // New function call
            
//             // Before calling advanceSnake, update head only if snake has elements
//             if (snake.length > 0) {
//                 head = { x: snake[0].x + dx, y: snake[0].y + dy };
//                 advanceSnake(head);
//             }
            
//             if (snake.length > 0) {
//                 // draw
//                 drawSnake();
                
//                 // update move position
//                 moveMonsterSnake();
                
//                 // draw
//                 drawMonsterSnake();
//             }
            
//             main();
//         }, speedBoost ? gameSpeed / 2 : gameSpeed); // Speed is doubled on boost
// }

    
function main() {
    // 1. Check if the game has ended
    if (didGameEnd()) {
        drawGameOver();
        return; // Exit the game loop if the game is over
    }

    // 2. Update Game State

    // Move the snake based on current direction
    advanceSnake();

    // Check for collisions with food and handle snake growth and score update
    // checkFoodCollision();

    // Check if a puzzle is completed and update the door visibility
    if (!door.visible && isPuzzleCompleted()) {
        door.visible = true;
    }

    // 3. Render Game Elements

    // Clear the game board before drawing anything
    clearBoard();

    // Draw the food
    drawFood();

    // Draw the door if it's visible
    if (door.visible) {
        drawDoor();
    }

    // Draw the snake
    drawSnake();

    // Optionally, draw any other elements like a monster snake
    // drawMonsterSnake();

    // Continue the game loop
    setTimeout(main, gameSpeed);
}


    
    
    // Start the game!!
    main();

});
