var canvas;
var canvasContext;

var gameOver = false;

var backgroundImage;

var xGridAmount = 18;
var yGridAmount = 28;

var lastPt = null;
var gameOverScreen = false;

//time in seconds between updates
var timeStep = 0.5;
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
var BlockShapePosX = [];
var BlockShapePosY = [];
var BlockGridPosX = [];
var BlockGridPosY = [];

var surfaceBlock = [];

var currentX = 4;
var currentY = 0;

function load() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    init();
    gameLoop();
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

aSprite.prototype.render = function (width, height) {
    canvasContext.drawImage(this.sImage, this.x, this.y, width, height);
}

function init() {
    if (canvas.getContext) {
        //Set Event Listeners for window, mouse and touch

        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", touchXY, true);
        canvas.addEventListener("touchend", touchUp, false);

        document.body.addEventListener("touchcancel", touchUp, false);

        resizeCanvas();

        //hard coded values change
        gridCellWidth = 920 / xGridAmount;
        //var gridCellWidth = canvas.width / xGridAmount;
        gridCentreX = gridCellWidth / 2;

        gridCellHeight = 1650 / yGridAmount;
        //var gridCellHeight = canvas.height / yGridAmount;
        var gridYCentre = gridCellHeight / 2;

        for (var x = 0; x < xGridAmount; x++) {
            gridCellX.push((gridCentreX + (gridCellWidth * x)));
        }
        for (var y = 0; y < yGridAmount; y++) {
            gridCellY.push((gridYCentre + (gridCellHeight * y)));
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

        createNewShape();
    }
}

function timer() {
    if (incrementing == false) {
        incrementing = true;
        setTimeout(function () {
            time += 1;
            incrementing = false;
        }
            , timeStep * 1000);
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
        collisionDetection();
        update();
        checkLine();
        render();
        requestAnimationFrame(gameLoop);
    }
}

function update() {
    if (time != previousTime) {
        currentY += time - previousTime;
        previousTime = time;
    }
    for (var i = 0; i < shape.length; i++) {
        BlockGridPosX[i] = BlockShapePosX[i] + currentX;
        BlockGridPosY[i] = BlockShapePosY[i] + currentY;

        shape[i].x = gridCellX[BlockGridPosX[i]];
        shape[i].y = gridCellY[BlockGridPosY[i]];
    }
}

function render() {
    backgroundImage.render(canvas.width, canvas.height);

    for (var x = 0; x < xGridAmount; x++) {
        for (var y = 0; y < yGridAmount; y++) {
            if (surfaceBlock[x][y] != null) {
                surfaceBlock[x][y].render(gridCellWidth, gridCellHeight);
            }
        }
    }

    for (var i = 0; i < shape.length; i++) {
        shape[i].render(gridCellWidth, gridCellHeight);
    }
}

function collisionDetection() {
    var collided = false;
    // check that shape has reached ground or the space below is occupied
    for (var i = 0; i < shape.length; i++) {
        if (BlockGridPosY[i] == yGridAmount - 1 || gridCellOccupied[BlockGridPosX[i]][BlockGridPosY[i] + 1] == true) {
            collided = true;
            if (BlockGridPosY[i] == 0) {
                print("Game Over");
                gameOver = true;
                return;
            }
        }
    }
    if (collided) {
        for (var i = 0; i < shape.length; i++) {
            surfaceBlock[BlockGridPosX[i]][BlockGridPosY[i]] = new aSprite(shape[i].x, shape[i].y, "GreenBlock.png", 0, 0);
            gridCellOccupied[BlockGridPosX[i]][BlockGridPosY[i]] = true;

        }
        createNewShape();
    }
}

function emptyShapeElements() {
    shape.length = 0;
    BlockShapePosX.length = 0;
    BlockShapePosY.length = 0;
    BlockGridPosX.length = 0;
    BlockGridPosY.length = 0;
}

function createNewShape() {
    currentY = 0;
    currentX = 6;
    emptyShapeElements();
    shape = CreateShape();
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
    timeStep -= 0.05;
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

    for (var i = 0; i < shape.length; i++) {
        if (BlockShapePosX[i] < leftmost) {
            leftmost = BlockShapePosX[i];
        }
        if (BlockShapePosX[i] > rightmost) {
            rightmost = BlockShapePosX[i];
        }
    }

    if (scrollPoint.x < (gridCellX[BlockGridPosX[0]] + gridCellWidth)) {
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
    if (scrollPoint.x > (gridCellX[BlockGridPosX[shape.length - 1]] + gridCellWidth)) {
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
    }
    if (right == true) {
        currentX++;
    }
}

function rotateShape(shapeToRotate) {
    var oldX = [];
    var oldY = [];

    for (var i = 0; i < shape.length; i++) {
        oldX.push(BlockShapePosX[i]);
        oldY.push(BlockShapePosY[i]);
    }

    BlockShapePosX.length = 0;
    BlockShapePosY.length = 0;

    for (var i = 0; i < shape.length; i++) {
        BlockShapePosX.push(oldY[i] * -1);
        BlockShapePosY.push(oldX[i] * 1);

        if((BlockShapePosX[i] + currentX) < 0){
           currentX ++;
        }
        if((BlockShapePosX[i] + currentX) > xGridAmount - 1){
           currentX --;
        }
    }
}

function styleText(txtColour, txtFont, txtAlign, txtBaseline) {
    canvasContext.fillStyle = txtColour;
    canvasContext.font = txtFont;
    canvasContext.textAlign = txtAlign;
    canvasContext.textBaseline = txtBaseline;
}

var timePressed;

var rotate = true;

function touchUp(evt) {
    evt.preventDefault();
    // Terminate touch path
    lastPt = null;

    if (rotate == true) {
        rotateShape(shape);
    }
    else {
        rotate = true;
    }
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

    var elapsed = timePressed - Date.now() / 1000;
    if (elapsed < -0.07) {
        rotate = false;
        moveShape(lastPt);
    }
}