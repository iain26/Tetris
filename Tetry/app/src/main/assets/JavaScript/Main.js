var canvas;
var canvasContext;

const gameStates = {MENU:'menu', INSTRUCTION: 'instruction', GAME:'game', REPLAY:'replay'};

var previousGameState;
var gameState = gameStates.MENU;

var soundMgr;

var currentTouchPoint = null;

function load() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    gameSetup();
}

function image(newX, newY, iSRC) {
    this.zindex = 0;
    this.x = newX;
    this.y = newY;
    this.sImage = new Image();
    this.sImage.src = "Images/" + iSRC;
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

        if(soundMgr != null){
            soundMgr.playMusic(0);
        }
        sceneMgr();
    }
    else{
        print("No Canvas Context!!!");
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
        if(gameState == gameStates.INSTRUCTION){
            startInstruction();
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
    gameState = gameStates.INSTRUCTION;
}

function skipInstructions(){
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
    if(gameState == gameStates.GAME){
        var elapsed = Date.now() / 1000 - timePressed;
        var swipeDown = currentTouchPoint.y - firstPress.y >= 100;

        var clockwise;

        if(currentTouchPoint.x > canvas.width/3){
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
    currentTouchPoint = null;
}

function touchDown(evt) {
    timePressed = Date.now() / 1000;
    evt.preventDefault();
    touchXY(evt);
}

function touchXY(evt) {
    evt.preventDefault();
    if (currentTouchPoint != null) {
        var touchX = evt.touches[0].pageX - canvas.offsetLeft;
        var touchY = evt.touches[0].pageY - canvas.offsetTop;
    }
    currentTouchPoint = { x: evt.touches[0].pageX, y: evt.touches[0].pageY };

    switch(gameState){
        case gameStates.MENU:
            if(firstPress == null){
                firstPress = currentTouchPoint;
                playButtonCheck(firstPress);
            }
        break;
        case gameStates.INSTRUCTION:
            if(firstPress == null){
                firstPress = currentTouchPoint;
                skipButtonCheck(firstPress);
            }
        break;
        case gameStates.REPLAY:
            if(firstPress == null){
                firstPress = currentTouchPoint;
                replayButtonCheck(firstPress);
            }
        break;
        case gameStates.GAME:
            if(firstPress == null){
                firstPress = currentTouchPoint;
                point = currentTouchPoint;
            }

            var elapsed = Date.now() / 1000 - timePressed;

            if (elapsed >= 0.15) {
                moveShape(currentTouchPoint);
            }
        break;
    }
}
