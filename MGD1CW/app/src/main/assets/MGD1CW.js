var canvas;
var canvasContext;

var gameOver = false;

var backgroundImage;
var headerImage;

var xGridAmount = 10;
var yGridAmount = 24;

var spawnPos = 0;

var lastPt = null;
var gameOverScreen = false;

//time in seconds between updates
var timeStep = 0.3;
var originalTimeStep;
var previousTime = 0;
var time = 0;
var incrementing = false;

var gridCellWidth;
var gridCellHeight;
var gridCentreX;

var gridCellX = [];
var gridCellY = [];
var gridCellOccupied = [];

var shape = [];
var ghostShape = [];

var BlockShapePosX = [];
var BlockShapePosY = [];
var BlockGridPosX = [];
var BlockGridPosY = [];

var surfaceBlock = [];

var currentX = 0;
var currentY = 0;

var hardPlacement = false;

var currentTime = Date.now()/1000;

function load() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    init();
    gameLoop();
}

// function aSprite(x, y, imageSRC, velx, vely) {
//     this.zindex = 0;
//     this.x = x;
//     this.y = y;
//     this.vx = velx;
//     this.vy = vely;
//     this.sImage = new Image();
//     this.sImage.src = imageSRC;
// }

aSprite.prototype.render = function (width, height) {
    canvasContext.drawImage(this.sImage, this.x, this.y, width, height);
}

block.prototype.render = function (width, height) {
    canvasContext.drawImage(this.sImage, this.x, this.y, width, height);
}

function init() {
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

        originalTimeStep = timeStep;

        spawnPos = Math.round(xGridAmount/2) - 1;
        currentX = spawnPos;

        //hard coded values change
        // gridCellWidth = 920 / xGridAmount;
        // var gridCellWidth = canvas.width / xGridAmount;
        gridCentreX = getGridWidth() / 2;

        // gridCellHeight = 1650 / yGridAmount;
        // gridCellHeight = canvas.height / yGridAmount;
        var gridYCentre = getGridHeight() / 2;

        for (var x = 0; x < xGridAmount; x++) {
            // gridCellX.push((gridCentreX + (getGridWidth() * x)));
            gridCellX.push(((getGridWidth() * x)));
        }
        for (var y = 0; y < yGridAmount; y++) {
            // gridCellY.push((gridYCentre + (getGridHeight() * y)));
            gridCellY.push(((getGridHeight() * y)));
        }

        for (var x = 0; x < xGridAmount; x++) {
            gridCellOccupied[x] = new Array(yGridAmount);
            surfaceBlock[x] = new Array(yGridAmount);

            for (var y = 0; y < yGridAmount; y++) {
                gridCellOccupied[x][y] = false;
                surfaceBlock[x][y] = null;
            }
        }

        backgroundImage = new aSprite(0, 0, "grey-background.jpg", 0, 0);
        headerImage = new aSprite(0, 0, "Header.png", 0, 0);

        createNewShape();
    }
}

function getGridWidth(){
    return canvas.width/xGridAmount;
}

function getGridHeight(){
    return canvas.height/yGridAmount;
}

function timer() {
    if (incrementing == false) {
        incrementing = true;
        setTimeout(function () {
            time += 1;
            incrementing = false;
            }, timeStep * 1000);
    }
}

function print(message) {
    console.log(message);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function gameLoop() {
    if (gameOver == false) {
        timer();
        update();
        placementCheck();
        collisionDetection();
        checkLine();
        render();
        requestAnimationFrame(gameLoop);
    }
}


var lowestX = 0;
var highestX = 0;

var lowestY = 0;
var highestY = 0;

function collisionDetection(){
    var surfaceX = [];
    var surfaceY = [];
    for (var x = (lowestX + currentX); x <= (highestX + currentX); x++) {
        for (var y = (highestY + currentY); y < yGridAmount; y++) {
            if(surfaceBlock[x][y] != null ){
                surfaceX.push(x);
                surfaceY.push(y);
            }
        }
    }
    if(surfaceY.length == 0){
        ghostCurrentY = yGridAmount - 1;
    }
    else{
        ghostCurrentY = Math.min(...surfaceY);
    }
    var counter = 0;
    for (var i = 0; i < shape.length; i++) {
        if(BlockShapePosY[i] == 0 && lowestY - highestY > 1){
            counter++;
        }
    }
    if(counter == 2 && ghostCurrentY != yGridAmount - 1){
        ghostCurrentY++;
    }
    for (var i = 0; i < shape.length; i++) {
        for (var s = 0; s < surfaceX.length; s++) {
            var ghostX = BlockShapePosX[i] + currentX;
            var ghostY = ghostCurrentY + BlockShapePosY[i]- lowestY;
            if(ghostX == surfaceX[s] && surfaceY[s] == ghostY){
                ghostCurrentY--;
                s = 0;
            }
        }
    }
}

var ghostCurrentY = yGridAmount - 1;
var lowestY;

function update() {
    if (time != previousTime) {
        currentY += time - previousTime;
        previousTime = time;
    }
    var counter = 0;
    lowestY = Math.max(...BlockShapePosY);
    for (var i = 0; i < shape.length; i++) {
        BlockGridPosX[i] = BlockShapePosX[i] + currentX;
        BlockGridPosY[i] = BlockShapePosY[i] + currentY;

        shape[i].x = gridCellX[BlockGridPosX[i]];
        shape[i].y = gridCellY[BlockGridPosY[i]];

        var ghostY = ghostCurrentY + BlockShapePosY[i]- lowestY;
        ghostShape[i].x = gridCellX[BlockGridPosX[i]];
        ghostShape[i].y = gridCellY[ghostY];
    }

    lowestX = Math.min(...BlockShapePosX);
    highestX = Math.max(...BlockShapePosX);

    lowestY = Math.max(...BlockShapePosY);
    highestY = Math.min(...BlockShapePosY);
}

function render() {
    backgroundImage.render(canvas.width, canvas.height);

    for (var i = 0; i < shape.length; i++) {
        ghostShape[i].render(getGridWidth(), getGridHeight());
        shape[i].render(getGridWidth(), getGridHeight());
    }

    for (var x = 0; x < xGridAmount; x++) {
        for (var y = 0; y < yGridAmount; y++) {
            if (surfaceBlock[x][y] != null) {
                surfaceBlock[x][y].render(getGridWidth(), getGridHeight());
            }
        }
    }
    headerImage.render(canvas.width, getGridHeight());
}

var timeToPlace = null;
var placed = false;

function placementCheck() {
    // check that shape has reached ground or the space below is occupied
    for (var i = 0; i < shape.length; i++) {
        if (BlockGridPosY[i] == yGridAmount - 1 || gridCellOccupied[BlockGridPosX[i]][BlockGridPosY[i] + 1] == true) {
            placed = true;
            if (BlockGridPosY[i] == 0) {
                print("Game Over");
                gameOver = true;
                return;
            }
        }
    }
    if (placed) {
        placementDelay();
    }
}

function placementDelay(){
    // timeStep = 100;
    if(timeToPlace == null){
        timeToPlace = Date.now()/1000;
    }
    var elapsed = (Date.now()/1000) - timeToPlace;
    // if(elapsed > 0.5)
    {
        placed = false;
        timeToPlace = null;

        for (var i = 0; i < shape.length; i++) {
            surfaceBlock[BlockGridPosX[i]][BlockGridPosY[i]] = new aSprite(shape[i].x, shape[i].y, "GreenBlock.png", 0, 0);
            gridCellOccupied[BlockGridPosX[i]][BlockGridPosY[i]] = true;
        }
        createNewShape();
        // timeStep = originalTimeStep;
    }
}

function emptyShapeElements() {
    shape.length = 0;
    ghostShape.length = 0;
    BlockShapePosX.length = 0;
    BlockShapePosY.length = 0;
    BlockGridPosX.length = 0;
    BlockGridPosY.length = 0;
    if(hardPlacement == true){
        hardPlacement = false;
        timeStep = originalTimeStep;
    }
}

function createNewShape() {
    currentY = -2;
    currentX = spawnPos;
    emptyShapeElements();
    shape = CreateShape();
    ghostShape = createGhostShape();
    sortShapePos(shape);
}

function sortShapePos(newShape) {
    for (var i = 0; i < newShape.length; i++) {
        BlockShapePosX.push(newShape[i].x);
        BlockShapePosY.push(newShape[i].y);

        BlockGridPosX.push(BlockShapePosX[i] + currentX);
        BlockGridPosY.push(BlockShapePosY[i] + currentY);

        newShape[i].x = gridCellX[BlockGridPosX[i]];
        newShape[i].y = gridCellY[BlockGridPosY[i]];
    }
}

function checkLine() {
    for (var y = yGridAmount - 1; y > 0; y--) {
        var rowCheck = [];
        for (var x = 0; x < xGridAmount; x++) {
            if (gridCellOccupied[x][y] == true) {
                rowCheck.push(x);
            }
        }
        if (rowCheck.length == xGridAmount) {
            lineDeletion(y);
        }
    }
}

function lineDeletion(yStart) {
    for (var yG = yStart; yG > 0; yG--) {
        for (var x = 0; x < xGridAmount; x++) {
            gridCellOccupied[x][yG] = gridCellOccupied[x][yG - 1];
            if (surfaceBlock[x][yG - 1] != null) {
                surfaceBlock[x][yG] = new aSprite(gridCellX[x], gridCellY[yG], "GreenBlock.png", 0, 0);
            }
            else {
                surfaceBlock[x][yG] = null;
            }
        }
    }
}

function moveShape(scrollPoint) {
    var left = false;
    var right = false;

    var leftmost = BlockShapePosX[0];
    var rightmost = BlockShapePosX[0];

    var leftmostIndex = 0;
    var rightmostIndex = 0;

    for (var i = 0; i < shape.length; i++) {
        if (BlockShapePosX[i] < leftmost) {
            leftmostIndex = i;
            leftmost = BlockShapePosX[i];
        }
        if (BlockShapePosX[i] > rightmost) {
            rightmostIndex = i;
            rightmost = BlockShapePosX[i];
        }
    }

    if (scrollPoint.x < (gridCellX[BlockGridPosX[leftmostIndex]])) {
        if ((leftmost + currentX) > 0) {
            left = true;
        }
        else {
            left = false;
        }
    }
    else {
        left = false;
    }
    if (scrollPoint.x > (gridCellX[BlockGridPosX[rightmostIndex]] + (canvas.width/ xGridAmount))) {
        if ((rightmost + currentX) < xGridAmount - 1) {
            right = true;
        }
        else {
            right = false;
        }
    }
    else {
        right = false;
    }

    for (var i = 0; i < shape.length; i++) {
        if (BlockGridPosX[i] - 1 > 0) {
            if (gridCellOccupied[BlockGridPosX[i] - 1][BlockGridPosY[i]] == true) {
                left = false;
            }
        }

        if (BlockGridPosX[i] + 1 < xGridAmount - 1) {
            if (gridCellOccupied[BlockGridPosX[i] + 1][BlockGridPosY[i]] == true) {
                right = false;
            }
        }
    }

    if (left == true) {
        currentX--;
        currentChangeX = 0;
    }
    if (right == true) {
        currentX++;
        currentChangeX = 0;
    }
}

var currentChangeX = 0;
var currentChangeY = 0;

function isRotatable(x, y,tempCurrentX){
    var result = true;
    for(var xI = 0; xI < x.length; xI++){
        if(((y[xI] + currentY)) < (yGridAmount -1)){
            if(gridCellOccupied[(x[xI] + tempCurrentX)][(y[xI] + currentY)] == true && (y[xI] + currentY) < yGridAmount - 1){
                print("Cannot rotate: shape");
                result = false;
                break;
            }
        }
        else{
            print("Cannot rotate: ground");
            result = false;
            break;
        }
    }
    return result;
}

function rotateShape(shapeToRotate, clockwise) {

    var oldX = [];
    var oldY = [];

    var checkX = [];
    var checkY = [];

    var tempCurrentX = currentX;
    tempCurrentX -= currentChangeX;
    currentChangeX = 0;

    for (var i = 0; i < shape.length; i++) {
        oldX.push(BlockShapePosX[i]);
        oldY.push(BlockShapePosY[i]);
    }

    var height = (lowestY - highestY) + 1;
    var length = (highestX - lowestX) + 1;

    for (var i = 0; i < shape.length; i++) {
        if(height == 3 || length == 3){
            oldX[i] -= 1;
            oldY[i] -= 1;
        }
        else if(height == 4 || length == 4){
            if(length == 4){
                oldX[i] = i;
                oldY[i] = 2;
            }
            if(height == 4){
                oldX[i] = 2;
                oldY[i] = i;
            }
        }
    }

    for (var i = 0; i < shape.length; i++) {
        checkX.push(oldY[i] * (-1 * clockwise));
        checkY.push(oldX[i] * (1 * clockwise));
    }

    for (var i = 0; i < shape.length; i++) {
        if(height == 3 || length == 3){
            checkX[i] += 1;
            checkY[i] += 1;
        }
        else if(height == 4 || length == 4){
            if(length == 4){
                checkX[i] = oldY[i];
                checkY[i] = oldX[i];
            }
            if(height == 4){
                checkX[i] = oldY[i];
                checkY[i] = oldX[i];
            }
        }
        else if(height == 2 || length == 2){
            checkX[i] = BlockShapePosX[i];
            checkY[i] = BlockShapePosY[i];
        }
    }

    //wall kicks
    if((Math.min(...checkX) + tempCurrentX) < 0){
        while((Math.min(...checkX) + tempCurrentX) < 0){
            tempCurrentX++;
            currentChangeX++;
        }
    }
    if((Math.max(...checkX) + tempCurrentX) > xGridAmount - 1){
        while((Math.max(...checkX) + tempCurrentX) > xGridAmount - 1){
            tempCurrentX--;
            currentChangeX--;
        }
    }

    if(isRotatable(checkX, checkY, tempCurrentX))
    {
        BlockShapePosX.length = 0;
        BlockShapePosY.length = 0;

        BlockShapePosX = checkX;
        BlockShapePosY = checkY;

        currentX = tempCurrentX;
    }
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

function touchUp(evt) {
    evt.preventDefault();
    // Terminate touch path

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

    lastPt = null;
    firstPress = null;
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

    if(firstPress == null){
        firstPress = lastPt;
    }

    var elapsed = Date.now() / 1000 - timePressed;

    if (elapsed > 0.15) {
        moveShape(lastPt);
    }
}