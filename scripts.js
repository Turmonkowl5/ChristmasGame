// Get stage object
let stage = document.querySelector("#stage");
// Get canvas element
let canvas = document.querySelector("canvas");
// Get canvas context
let ctx = canvas.getContext("2d");
// Set the stage width and height to match that of the canvas
stage.style.width = canvas.width + "px";
stage.style.height = canvas.height + "px";
// Position Text
let output = document.querySelector("#gameMessage");
//! Arrays
let sprites = [];
let assetsToLoad = [];
let ices = [];
let stars = [];
let levels =[];
//! Game Variables
let assetsLoaded = 0;
let starsCollected = 0;
let aRot = 0;
let rF = true;
// GameStates
let LOADING = 0;
let PLAYING = 1;
let OVER = 2;
let BUILDING = 3;
let gameState = LOADING;
// Arrow key codes
let RIGHT = 39;
let LEFT = 37;
let SPACE = 32;
// Speed of acceleratin
let accel = 2;
// Sets booleans for the direction the sprites will move
let moveRight = false;
let moveLeft = false;
let jump = false;
// Adds a window listner to listen for the keypresses
window.addEventListener("keydown", function(event){
    switch(event.keyCode){
        case RIGHT:
            moveRight = true;
            break;
        case LEFT:
            moveLeft = true;
            break;
        case SPACE:
            jump = true;
            break;
    }
    event.preventDefault();
},false);
// Adds a window listner looking for when user lets go of the keys
window.addEventListener("keyup", function(event){
    switch(event.keyCode){
        case RIGHT:
            moveRight = false;
            break;
        case LEFT:
            moveLeft = false;
            break;
        case SPACE:
            jump = false;
            break;
    }
},false);
// !Map and object creation
// Map 
let EMPTY = 0;
let ICE = 1;
let STAR = 2;
let TREE = 3;
let ROWS = 12;
let COLUMNS = 16;
let SIZE = 64;
let map1 = [
    [0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,2,0,1,1,0,0,1,0,0,2,0,0,0,0],
    [0,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
    [2,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
    [1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,1,1,1,0,0,1,0,0,1],
    [1,1,1,0,0,0,0,1,1,1,1,0,1,1,0,1],
    [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1]
];
levels.push(map1);
let objects1 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0]

];
levels.push(objects1);
let map2 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
    [0,0,0,1,0,0,1,1,1,0,2,1,0,0,0,1],
    [2,0,0,0,0,0,0,0,0,0,0,1,2,1,1,1],
    [1,1,0,0,1,0,0,0,0,0,0,0,1,1,0,0],
    [0,0,0,2,1,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],
    [1,1,0,0,0,0,2,1,0,0,0,0,0,0,2,1],
    [1,1,1,1,0,0,1,1,0,0,0,0,0,0,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1],
    [0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,1]
];
levels.push(map2);
let objects2 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],
];
levels.push(objects2);
let currentLevel = 0;
let totalLevels = levels.length / 2;
// Creat image
let image = new Image();
image.src = "/images/testSheet.png";
image.addEventListener("load",loadHandler, false);
assetsToLoad.push(image);
// Create backgroun
let background = Object.create(spriteObject);
background.sourceX = 128;
background.sourceWidth = 1024;
background.sourceHeight = 454;
background.width = 1024;
background.height = 768;
sprites.push(background);
// Create Player
let tree = null;
// star
let star = null;
// Start update loop
update();
// ! Functions
function update(){
    window.requestAnimationFrame(update, canvas);
    switch(gameState){
        case LOADING:
            console.log("Loading...");
            break;
        case PLAYING:
            playGame();
            render();
            break;
        case OVER:
            endGame();
            break;
        case BUILDING:
            stars = [];
            starsCollected = 0;
            ices = [];
            sprites = [];
            background = Object.create(spriteObject);
            background.sourceX = 128;
            background.sourceWidth = 1024;
            background.sourceHeight = 454;
            background.width = 1024;
            background.height = 768;
            sprites.push(background);
            buildMap(levels[currentLevel]);
            buildMap(levels[currentLevel + 1]);
    }
}
// Called when things are loaded
function loadHandler(){
    assetsLoaded ++;
    if(assetsLoaded === assetsToLoad.length){
        gameState = BUILDING;
    }
}
// Called when game should be played
function playGame(){
    //! Movement code
    if(moveLeft && !moveRight){
        tree.vx = -accel;
    }
    if(moveRight && !moveLeft){
        tree.vx = accel;
    }
    if(jump && tree.isOnGround){
        tree.vy += tree.jumpForce;
        tree.isOnGround = false;
    }
    // Checks for no movement
    if(!moveLeft && !moveRight){
        tree.vx = 0;
    }
    // Apply gravity
    tree.vy += tree.gravity;
    // Limit the top speed
    if(tree.vy > tree.speedLimit * 2){
        tree.vy = tree.speedLimit * 2;
    }
    // Apply movement
    tree.x += tree.vx;
    tree.y += tree.vy;
    // Check for box collision
    for(let i = 0; i < ices.length; i ++){
        let collSide = blockRectangle(tree,ices[i], false);
            if(collSide === "bottom" && tree.vy >0){
                tree.isOnGround = true;
                tree.vy = -tree.gravity;
                // console.log(tree.vy);
            }
            if(collSide !== "bottom" && tree.vy > 0){
                tree.isOnGround = false;
            }
            // console.log(tree.vy);
    } 
        // Set screen boundries and bounce
    // Right
    if(tree.x < 0){
        tree.x = 0;
        tree.vx = 0;
    }
    // Left
    if(tree.x > canvas.width - tree.width){
        tree.x = canvas.width - tree.width;
        tree.vx = 0;
    }
    // Bottom
    if(tree.y > canvas.height - tree.height){
        tree.y = canvas.height - tree.height;
        tree.isOnGround = true;
        tree.vy = -tree.gravity;
    }
    //! Stars
    // Check if touching stars
    for(let i = 0; i < stars.length; i ++){
        if(hitTestRectangle(tree,stars[i]) && stars[i].visible){
            starsCollected ++;
            stars[i].visible = false;
        }
        else if(aRot >= 45){
            rF = false;            
        }
        else if(aRot <= -45){
            rF = true;
        }
        if(rF){
            aRot += 0.1;
        }
        else{
            aRot -= 0.1;
        }
        stars[i].rotation = aRot;
    }
    if(starsCollected === stars.length && currentLevel != totalLevels){
        currentLevel += 2;
        gameState = BUILDING;
    }
    else if(starsCollected === stars.length && currentLevel === totalLevels){
        gameState = OVER;
    }
}
// Build Map
function buildMap(array){
    console.log("Building");
    for(let row = 0; row < ROWS; row ++){
        for(let column = 0; column < COLUMNS; column ++){
            let tile = array[row][column];
            // console.log(tile);
            if(tile != EMPTY){
                switch(tile){
                    case TREE:
                        tree = Object.create(spriteObject);
                        tree.x = column * SIZE;
                        tree.y = row * SIZE;
                        tree.isOnGround = true;
                        sprites.push(tree);
                        break;
                    case ICE:
                        let ice = Object.create(spriteObject);
                        ice.sourceY = 64;
                        ice.x = column * SIZE;
                        ice.y = row * SIZE;
                        ices.push(ice);
                        sprites.push(ice);
                        break;
                    case STAR:
                        star = Object.create(spriteObject);
                        star.sourceX = 64;
                        star.x = column * SIZE;
                        star.y = row * SIZE;
                        star.rotation = 90;
                        stars.push(star);
                        sprites.push(star);
                        break;
                }
            }
        }
    }
    gameState = PLAYING;
}
function endGame(){
    output.innerHTML = "You Won!";
    render();
}
function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(gameState != OVER){
        for(let i = 0; i < sprites.length; i ++){
            let sprite = sprites[i];
            ctx.save();
            if(sprite.visible){
                if(sprite.rotation != 0){
                    ctx.translate(
                        Math.floor(sprite.x + (sprite.width / 2)),
                        Math.floor(sprite.y + (sprite.height / 2))
                    );
                    ctx.rotate(sprite.rotation * Math.PI / 180);
                    ctx.drawImage(
                        image,
                        Math.floor(sprite.sourceX), Math.floor(sprite.sourceY), Math.floor(sprite.sourceWidth), Math.floor(sprite.sourceHeight),
                        Math.floor(-sprite.halfWidth()), Math.floor(-sprite.halfHeight()), Math.floor(sprite.width), Math.floor(sprite.height)
                    );    
                }
                else{
                    ctx.drawImage(
                        image,
                        Math.floor(sprite.sourceX), Math.floor(sprite.sourceY), Math.floor(sprite.sourceWidth), Math.floor(sprite.sourceHeight),
                        Math.floor(sprite.x), Math.floor(sprite.y), Math.floor(sprite.width), Math.floor(sprite.height)
                    );
                }
                ctx.restore();
            }
        }
    }
    else{
        ctx.drawImage(
            image,
            Math.floor(background.sourceX), Math.floor(background.sourceY), Math.floor(background.sourceWidth), Math.floor(background.sourceHeight),
            Math.floor(background.x), Math.floor(background.y), Math.floor(background.width), Math.floor(background.height)
        );
    }
}