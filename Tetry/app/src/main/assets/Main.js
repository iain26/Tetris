var canvas;
var canvasContext;

var backgroundImage;
var headerImage;

const gameStates = {MENU:'menu', GAME:'game', REPLAY:'replay'};

var previousGameState;
var gameState = gameStates.MENU;

var lastPt = null;

function load() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    gameSetup();
    sceneMgr();
}

function image(newX, newY, iSRC, velocityX, velocityY) {
    this.zindex = 0;
    this.x = newX;
    this.y = newY;
    this.vx = velocityX;
    this.vy = velocityY;
    this.sImage = new Image();
    this.sImage.src = iSRC;
}

image.prototype.render = function (width, height) {
    canvasContext.drawImage(this.sImage, this.x, this.y, width, height);
}

function gameSetup() {
    if (canvas.getContext)
    {
        //Set Event Listeners for window, mouse and touch

        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", touchXY, true);
        canvas.addEventListener("touchend", touchUp, false);

        document.body.addEventListener("touchcancel", touchUp, false);

        resizeCanvas();
    }
}

function print(message) {
    console.log(message);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function sceneMgr() {
    if(gameState != previousGameState)
    {
        previousGameState = gameState;
        if(gameState == gameStates.MENU){
            startMenu();
        }
        if(gameState == gameStates.GAME){
            startGame();
        }
        if(gameState == gameStates.REPLAY){
            startReplay();
        }
    }
    requestAnimationFrame(sceneMgr);
}

function playGame(){
    gameState = gameStates.GAME;
}

function stopGame(){
    gameState = gameStates.REPLAY;
}

function styleText(txtColour, txtFont, txtAlign, txtBaseline) {
    canvasContext.fillStyle = txtColour;
    canvasContext.font = txtFont;
    canvasContext.textAlign = txtAlign;
    canvasContext.textBaseline = txtBaseline;
}

var timePressed;
var firstPress = null;
var previousTimeStep;
var point;

function touchUp(evt) {
    evt.preventDefault();
    // Terminate touch path

    if(gameState == gameStates.GAME){
        var elapsed = Date.now() / 1000 - timePressed;
        var swipeDown = lastPt.y - firstPress.y >= 200;

        var clockwise;

        if(lastPt.x > canvas.width/3){
            clockwise = 1;
        }
        else{
            clockwise = -1;
        }

        if(swipeDown == true && elapsed < 0.15){
            hardPlacement = true;
            timeStep *= 0.1;
        }

        if (elapsed < 0.15 && swipeDown == false) {
            rotateShape(shape, clockwise);
        }
    }
    firstPress = null;
    point = null;
    lastPt = null;
}

function touchDown(evt) {
    timePressed = Date.now() / 1000;
    evt.preventDefault();
    touchXY(evt);
}

function touchXY(evt) {
    evt.preventDefault();
    if (lastPt != null) {
        var touchX = evt.touches[0].pageX - canvas.offsetLeft;
        var touchY = evt.touches[0].pageY - canvas.offsetTop;
    }
    lastPt = { x: evt.touches[0].pageX, y: evt.touches[0].pageY };

    if(gameState == gameStates.MENU){
        if(firstPress == null){
            firstPress = lastPt;
            playButtonCheck(firstPress);
        }
    }

    if(gameState == gameStates.REPLAY){
        if(firstPress == null){
            firstPress = lastPt;
            replayButtonCheck(firstPress);
        }
    }

    if(gameState == gameStates.GAME){
        if(firstPress == null){
            firstPress = lastPt;
            point = lastPt;
        }

        var elapsed = Date.now() / 1000 - timePressed;

        if (elapsed > 0.15) {
            if(lastPt.y - point.y > 50 && Math.sign(lastPt.y - point.y) * (lastPt.y - point.y) > getGridWidth()){
                currentY++;
                point = lastPt;
            }
            moveShape(lastPt);
        }
    }
}