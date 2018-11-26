var canvas;
var canvasContext;
var canvasX;
var canvasY;
var mouseIsDown = 0;

var background;

var xGridAmount = 7;
var yGridAmount = 15;

var lastPt = null;
var gameOverScreen = false;

var startTimeMS;

var previousTime = -1;
var time = 0;
var incrementing = false;

var gridPositions = new Array(2);

function load() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    init();

    canvasX = canvas.width / 2;
    canvasY = canvas.height - 30;

    if (!gameOverScreen) {
        gameLoop();
    }
}

function aSprite(x, y, imageSRC, velx, vely) {
    this.zindex = 0;
    this.x = x;
    this.y = y;
    this.vx = velx;
    this.vy = vely;
    this.sImage = new Image();
    this.sImage.src = imageSRC;
}

aSprite.prototype.renderF = function (width, height) {
    canvasContext.drawImage(this.sImage, this.x, this.y, width, height);
}

aSprite.prototype.render = function () {
    canvasContext.drawImage(this.sImage, this.x, this.y);
}

aSprite.prototype.update = function (deltaTime) {
    this.x += deltaTime * this.vx;
    this.y += deltaTime * this.vy;
}

function init() {

    //if (canvas.getContext) {
    //    //Set Event Listeners for window, mouse and touch

    //    window.addEventListener('resize', resizeCanvas, false);
    //    window.addEventListener('orientationchange', resizeCanvas, false);

    //    canvas.addEventListener("touchstart", touchDown, false);
    //    canvas.addEventListener("touchmove", touchXY, true);
    //    canvas.addEventListener("touchend", touchUp, false);

    //    document.body.addEventListener("touchcancel", touchUp, false);

    resizeCanvas();

    var gridWidth = canvas.width / xGridAmount;
    var gridXCentre = gridWidth / 2;

    var gridHeight = canvas.height / yGridAmount;
    var gridYCentre = gridHeight / 2;

    for(var x = 0; x < xGridAmount; x++){
        var gridXPoint = (gridXCentre + (gridWidth * x));
        for(var y = 0; y < yGridAmount; y++){
            var gridYPoint = (gridYCentre + (gridHeight * y));
            //gridPositions.push("X: " + (gridXCentre + (gridWidth * x)) + " Y: " + (gridYCentre + (gridHeight * y)));

            //gridPositions.push(0);
        }
    }

    print (gridPositions);

    background = new aSprite(0, 0, "grey-background.jpg", 0, 0);
    startTimeMS = Date.now();
    //}
}

function Timer(){
    if(incrementing == false){
        incrementing = true;
        setTimeout(function(){
            time += 1;
            incrementing = false;}
            , 1000);
    }
}

function print(message){
    console.log(message);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function gameLoop() {
    Timer();
    var elapsed = (Date.now() - startTimeMS) / 1000;
    //update(elapsed);
    render(elapsed);
    startTimeMS = Date.now();
    requestAnimationFrame(gameLoop);
}

function render(delta) {
    background.renderF(canvas.width, canvas.height);
}

function update(delta) {

}

function collisionDetection() {

}

function styleText(txtColour, txtFont, txtAlign, txtBaseline) {
    canvasContext.fillStyle = txtColour;
    canvasContext.font = txtFont;
    canvasContext.textAlign = txtAlign;
    canvasContext.textBaseline = txtBaseline;
}

//function touchUp(evt) {
//    evt.preventDefault();
//    // Terminate touch path
//    lastPt = null;
//}

//function touchDown(evt) {
//    evt.preventDefault();
//    if (gameOverScreenScreen) {

//        return;
//    }
//    touchXY(evt);
//}

//function touchXY(evt) {
//    evt.preventDefault();
//    if (lastPt != null) {
//        var touchX = evt.touches[0].pageX - canvas.offsetLeft;
//        var touchY = evt.touches[0].pageY - canvas.offsetTop;
//    }
//    lastPt = { x: evt.touches[0].pageX, y: evt.touches[0].pageY };
//}