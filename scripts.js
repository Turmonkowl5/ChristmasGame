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
let faces = [];
//! Game Variables
let assetsLoaded = 0;
let facesCollected = 0;
let faceNum = 0;
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
let FACE = 2;
let SLEIGH = 3;
let ROWS = 12;
let COLUMNS = 16;
let SIZE = 64;
let map1 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,1,2,0,1,1,0,1,1,1,0,2,0,0,0,0],
    [0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0],
    [2,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
    [1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,1,1,1,1,0,0,0,2,1,1],
    [1,1,1,2,0,0,0,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1]
];
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
// Creat image
let image = new Image();
image.src = "images/f1spritesheet.png";
image.addEventListener("load",loadHandler, false);
assetsToLoad.push(image);
// Create backgroun
let background = null;
// Create Player
let sleigh = null;
// face
let face = null;
// facet update loop
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
            faces = [];
            facesCollected = 0;
            ices = [];
            sprites = [];
            background = Object.create(spriteObject);
            background.sourceWidth = 1024;
            background.sourceHeight = 763;
            background.width = 1024;
            background.height = 768;
            sprites.push(background);
            buildMap(map1);
            buildMap(objects1);
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
        sleigh.vx = -accel;
        sleigh.flip = -1;
    }
    if(moveRight && !moveLeft){
        sleigh.vx = accel;
        sleigh.flip = 1;
    }
    if(jump && sleigh.isOnGround){
        sleigh.vy += sleigh.jumpForce;
        sleigh.isOnGround = false;
    }
    // Checks for no movement
    if(!moveLeft && !moveRight){
        sleigh.vx = 0;
    }
    // Apply gravity
    sleigh.vy += sleigh.gravity;
    // Limit the top speed
    if(sleigh.vy > sleigh.speedLimit * 2){
        sleigh.vy = sleigh.speedLimit * 2;
    }
    // Apply movement
    sleigh.x += sleigh.vx;
    sleigh.y += sleigh.vy;
    // Check for box collision
    for(let i = 0; i < ices.length; i ++){
        let collSide = blockRectangle(sleigh,ices[i], false);
            if(collSide === "bottom" && sleigh.vy >0){
                sleigh.isOnGround = true;
                sleigh.vy = -sleigh.gravity;
                // console.log(sleigh.vy);
            }
            if(collSide !== "bottom" && sleigh.vy > 0){
                sleigh.isOnGround = false;
            }
    } 
        // Set screen boundries and bounce
    // Right
    if(sleigh.x < 0){
        sleigh.x = 0;
        sleigh.vx = 0;
    }
    // Left
    if(sleigh.x > canvas.width - sleigh.width){
        sleigh.x = canvas.width - sleigh.width;
        sleigh.vx = 0;
    }
    // Bottom
    if(sleigh.y > canvas.height - sleigh.height){
        sleigh.y = canvas.height - sleigh.height;
        sleigh.isOnGround = true;
        sleigh.vy = -sleigh.gravity;
    }
    //! faces
    // Check if touching faces
    for(let i = 0; i < faces.length; i ++){
        let face = faces[i];
        if(hitTestRectangle(sleigh,face) && face.visible){
            facesCollected ++;
            face.visible = false;
        }
        if(face.visible){
            if(face.aRot >= 45){
                face.rF = false;            
            }
            else if(face.aRot <= -45){
                face.rF = true;
            }
            if(face.rF){
                face.aRot += 0.7;
            }
            else{
                face.aRot -= 0.7;
            }
            face.rotation = face.aRot;
        }
        
    }
    if(facesCollected === faces.length){
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
                    case SLEIGH:
                        sleigh = Object.create(spriteObject);
                        sleigh.sourceX = 1152;
                        sleigh.x = column * SIZE;
                        sleigh.y = row * SIZE;
                        sleigh.isOnGround = true;
                        sprites.push(sleigh);
                        break;
                    case ICE:
                        let ice = Object.create(spriteObject);
                        ice.sourceX = 1024;
                        ice.sourceY = 64;
                        ice.x = column * SIZE;
                        ice.y = row * SIZE;
                        ices.push(ice);
                        sprites.push(ice);
                        break;
                    case FACE:
                        face = Object.create(spriteObject);
                        face.sourceX = 1216 + faceNum * 500;
                        face.sourceWidth = 500;
                        face.sourceHeight = 500;
                        face.x = column * SIZE;
                        face.y = row * SIZE;
                        face.rotation = 90;
                        faceNum ++;
                        faces.push(face);
                        sprites.push(face);
                        break;
                }
            }
        }
    }
    gameState = PLAYING;
}
function endGame(){
    output.innerHTML = "Happy Holidays";
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
                    if(sprite.flip === -1){
                        ctx.scale(sprite.flip, 1);
                        ctx.drawImage(
                            image,
                            Math.floor(sprite.sourceX), Math.floor(sprite.sourceY), Math.floor(sprite.sourceWidth), Math.floor(sprite.sourceHeight),
                            Math.floor(-sprite.x - sprite.width), Math.floor(sprite.y), Math.floor(sprite.width), Math.floor(sprite.height)
                        );
                    }
                    else{
                        ctx.drawImage(
                            image,
                            Math.floor(sprite.sourceX), Math.floor(sprite.sourceY), Math.floor(sprite.sourceWidth), Math.floor(sprite.sourceHeight),
                            Math.floor(sprite.x), Math.floor(sprite.y), Math.floor(sprite.width), Math.floor(sprite.height)
                        );
                    }
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